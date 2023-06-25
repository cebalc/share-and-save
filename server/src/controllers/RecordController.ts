import {Result, ValidationChain, ValidationError, validationResult} from "express-validator";
import { Request, Response, NextFunction } from "express";
import WorkspaceDependentController from "./WorkspaceDependentController";
import FilterFactory from "../objects/filters/FilterFactory";
import SaveRecordResponse from "../objects/responses/workspaces/records/SaveRecordResponse";
import RecordModel from "../models/RecordModel";
import RecordEntity from "../objects/entities/Record";
import ReadRecordsResponse from "../objects/responses/workspaces/records/ReadRecordsResponse";
import RecordType from "../objects/enums/RecordType";
import Category from "../objects/entities/Category";
import Place from "../objects/entities/Place";
import User from "../objects/entities/User";
import Workspace from "../objects/entities/Workspace";

class RecordController extends WorkspaceDependentController<RecordModel> {

    public saveRecordFilters(): ValidationChain[] {
        return [
            FilterFactory.id(),
            FilterFactory.recordType(),
            FilterFactory.date(),
            FilterFactory.recordDescription(),
            FilterFactory.recordAmount(),
            FilterFactory.id("user"),
            FilterFactory.id("category"),
            FilterFactory.id("place"),
            FilterFactory.recordReference()
        ];
    }

    public async saveRecord(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let errors: Result<ValidationError> = validationResult(request);
            if(!errors.isEmpty()) {
                let errorsObject: Record<string, ValidationError> = errors.mapped();
                response.json(new SaveRecordResponse(false,
                    errorsObject.date !== undefined ? errorsObject.date.msg : "",
                    errorsObject.description !== undefined ? errorsObject.description.msg : "",
                    errorsObject.amount !== undefined ? errorsObject.amount.msg : "",
                    errorsObject.reference !== undefined ? errorsObject.reference.msg : "",
                    errorsObject.global !== undefined ? errorsObject.global.msg : ""
                ));
                return;
            }

            let requestRecord: RecordEntity = new RecordEntity(
                parseInt(request.body.id),
                RecordType.of(parseInt(request.body.type)),
                request.body.date,
                request.body.description,
                parseFloat(request.body.amount),
                request.body.reference,
                new RegExp(/true/i).test(request.body.shared),
                Category.idWrapper(parseInt(request.body.category)),
                Place.idWrapper(parseInt(request.body.place)),
                User.idWrapper(parseInt(request.body.user)),
                Workspace.idWrapper(super.getWorkspaceId(response))
            );

            this.model = new RecordModel();
            let currentUserId: number = super.getSessionUser(request).id;

            let usersAllowed: boolean = await this.model.isUserInWorkspace(
                requestRecord.workspace.id,
                requestRecord.user.id,
                currentUserId
            );
            if(!usersAllowed) {
                this.model.delete();
                response.json(SaveRecordResponse.USER_NOT_ALLOWED);
                return;
            }

            if(requestRecord.id == RecordEntity.NEW.id) {
                await this.createRecord(requestRecord, response);
            } else {
                await this.editRecord(requestRecord, response);
            }
        } catch (error) {
            return next(error);
        }
    }

    private async createRecord(requestRecord: RecordEntity, response: Response): Promise<void> {
        let newRecordId: number = await this.model.createRecord(requestRecord);
        console.log("Se ha intentado crear el nuevo registro (id " + newRecordId + ")");
        this.model.delete();
        if(newRecordId == RecordEntity.NEW.id) {
            response.json(SaveRecordResponse.NOT_ADDED);
            return;
        }
        response.json(SaveRecordResponse.success(newRecordId));
    }

    private async editRecord(requestRecord: RecordEntity, response: Response): Promise<void> {

        this.model.delete();
    }

    public async readWorkspaceRecords(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let workspaceId: number = super.getWorkspaceId(response);
            let currentUserId: number = super.getSessionUser(request).id;
            this.model = new RecordModel();

            let currentUserAllowed: boolean = await this.model.isUserInWorkspace(workspaceId, currentUserId);
            if(!currentUserAllowed) {
                this.model.delete();
                response.json();
                return;
            }

            let records: RecordEntity[] = await this.model.readRecordsByWorkspace(workspaceId);
            this.model.delete();
            if(records == null) {
                response.json(ReadRecordsResponse.NONE);
                return;
            }
            response.json(new ReadRecordsResponse(true, records));
        } catch (error) {
            return next(error);
        }
    }
}

export default RecordController;
