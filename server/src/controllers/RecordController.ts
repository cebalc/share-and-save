import {Result, ValidationChain, ValidationError, validationResult} from "express-validator";
import { Request, Response, NextFunction } from "express";
import WorkspaceDependentController from "./WorkspaceDependentController";
import FilterFactory from "../objects/filters/FilterFactory";
import AddRecordResponse from "../objects/responses/workspaces/records/AddRecordResponse";
import RecordModel from "../models/RecordModel";
import RecordEntity from "../objects/entities/Record";
import ReadRecordsResponse from "../objects/responses/workspaces/records/ReadRecordsResponse";

class RecordController extends WorkspaceDependentController<RecordModel> {

    public createRecordFilters(): ValidationChain[] {
        return [
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

    public async createRecord(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let errors: Result<ValidationError> = validationResult(request);
            if(!errors.isEmpty()) {
                let errorsObject: Record<string, ValidationError> = errors.mapped();
                response.json(new AddRecordResponse(false,
                    errorsObject.date !== undefined ? errorsObject.date.msg : "",
                    errorsObject.description !== undefined ? errorsObject.description.msg : "",
                    errorsObject.amount !== undefined ? errorsObject.amount.msg : "",
                    errorsObject.reference !== undefined ? errorsObject.reference.msg : "",
                    errorsObject.global !== undefined ? errorsObject.global.msg : ""
                ));
                return;
            }

            let recordTypeId: number = parseInt(request.body.type);
            let dateStr: string = request.body.date;
            let description: string = request.body.description;
            let amount: number = parseFloat(request.body.amount);
            let reference: string = request.body.reference;
            let shared: boolean = new RegExp(/true/i).test(request.body.shared);
            let categoryId: number = parseInt(request.body.category);
            let placeId: number = parseInt(request.body.place);
            let userId: number = parseInt(request.body.user);
            let workspaceId: number = super.getWorkspaceId(response);

            this.model = new RecordModel();
            let currentUserId: number = super.getSessionUser(request).id;

            let usersAllowed: boolean = await this.model.isUserInWorkspace(workspaceId, userId, currentUserId);
            if(!usersAllowed) {
                this.model.delete();
                response.json(AddRecordResponse.USER_NOT_ALLOWED);
                return;
            }

            let newRecordId: number = await this.model.createRecord(recordTypeId, dateStr, description, amount, reference,
                shared, categoryId, placeId, userId, workspaceId);
            this.model.delete();
            if(newRecordId == RecordEntity.NEW.id) {
                response.json(AddRecordResponse.NOT_ADDED);
                return;
            }
            response.json(AddRecordResponse.success(newRecordId));
        } catch (error) {
            return next(error);
        }
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
