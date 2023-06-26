import {Result, ValidationChain, ValidationError, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import WorkspaceDependentController from "./WorkspaceDependentController";
import FilterFactory from "../objects/filters/FilterFactory";
import SaveRecordResponse from "../objects/responses/workspaces/records/SaveRecordResponse";
import RecordModel from "../models/RecordModel";
import RecordEntity from "../objects/entities/Record";
import ReadRecordResponse from "../objects/responses/workspaces/records/ReadRecordResponse";
import RecordType from "../objects/enums/RecordType";
import Category from "../objects/entities/Category";
import Place from "../objects/entities/Place";
import User from "../objects/entities/User";
import Workspace from "../objects/entities/Workspace";
import DeleteRecordResponse from "../objects/responses/workspaces/records/DeleteRecordResponse";
import FilterRecordsResponse from "../objects/responses/workspaces/records/FilterRecordsResponse";
import MakeSummaryResponse from "../objects/responses/workspaces/records/MakeSummaryResponse";
import {CategorySummary, SummaryData, UserSummary} from "../objects/entities/SummaryData";
import SummaryRow from "../objects/rows/SummaryRow";
import UserLevel from "../objects/enums/UserLevel";


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
        this.model.delete();
        if(newRecordId == RecordEntity.NEW.id) {
            response.json(SaveRecordResponse.NOT_ADDED);
            return;
        }
        response.json(SaveRecordResponse.success(newRecordId));
    }

    private async editRecord(requestRecord: RecordEntity, response: Response): Promise<void> {
        let updated: boolean = await this.model.updateRecord(requestRecord);
        this.model.delete();
        if(!updated) {
            response.json(SaveRecordResponse.NOT_EDITED);
            return;
        }
        response.json(SaveRecordResponse.success(requestRecord.id));
    }

    public async readRecords(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let workspaceId: number = super.getWorkspaceId(response);
            let currentUserId: number = super.getSessionUser(request).id;
            this.model = new RecordModel();

            let currentUserAllowed: boolean = await this.model.isUserInWorkspace(workspaceId, currentUserId);
            if(!currentUserAllowed) {
                this.model.delete();
                response.json(ReadRecordResponse.ERRORS);
                return;
            }

            let recordId: number = 0;
            if(request.params.id !== undefined) {
                recordId = parseInt(request.params.id);
            }

            let records: RecordEntity[] = await this.model.readRecordsByWorkspace(workspaceId, recordId);
            this.model.delete();

            if(records == null) {
                response.json(ReadRecordResponse.ERRORS);
                return;
            }
            response.json(new ReadRecordResponse(true, records));
        } catch (error) {
            return next(error);
        }
    }

    public async deleteRecord(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let workspaceId: number = super.getWorkspaceId(response);
            let currentUserId: number = super.getSessionUser(request).id;

            this.model = new RecordModel();

            let currentUserAllowed: boolean = await this.model.isUserInWorkspace(workspaceId, currentUserId);
            if(!currentUserAllowed) {
                this.model.delete();
                response.json(DeleteRecordResponse.NOT_ALLOWED);
                return;
            }

            let recordId: number = parseInt(request.params.id);
            let deleted: boolean = await this.model.deleteWorkspaceRecord(recordId);
            this.model.delete();

            if(!deleted) {
                response.json(DeleteRecordResponse.NOT_DELETED);
                return;
            }
            response.json(DeleteRecordResponse.SUCCESS);
        } catch (error) {
            return next(error);
        }
    }

    public getSummaryFilters(): ValidationChain[] {
        return [
            FilterFactory.date("dateFrom", false),
            FilterFactory.date("dateTo", false),
            FilterFactory.id("user")
        ];
    }

    public async getSummary(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let errors: Result<ValidationError> = validationResult(request);
            if(!errors.isEmpty()) {
                let errorsObject: Record<string, ValidationError> = errors.mapped();
                response.json(new MakeSummaryResponse(false,
                    errorsObject.dateFrom !== undefined ? errorsObject.dateFrom.msg : "",
                    errorsObject.dateTo !== undefined ? errorsObject.dateTo.msg : ""
                ));
                return;
            }

            let dateFrom: string = request.body.dateFrom;
            let dateTo: string = request.body.dateTo;

            console.log("Valor recibido de dateFrom = " + dateFrom);
            console.log("Valor recibido de dateTo = " + dateTo);

            if(dateFrom.length > 0 && dateTo.length > 0 && new Date(dateFrom) > new Date(dateTo)) {
                response.json(MakeSummaryResponse.REVERSED_DATES);
                return;
            }

            let workspaceId: number = super.getWorkspaceId(response);
            let currentUserId: number = super.getSessionUser(request).id;
            this.model = new RecordModel();

            let currentUserAllowed: boolean = await this.model.isUserInWorkspace(workspaceId, currentUserId);
            if(!currentUserAllowed) {
                this.model.delete();
                response.json(MakeSummaryResponse.ERRORS);
                return;
            }

            let summarizeByUser: boolean = new RegExp(/true/i).test(request.body.summarizeByUser);
            let userId: number = parseInt(request.body.user);

            // let summaryData: SummaryData[] = await this.model.getSummaryData(workspaceId, dateFrom, dateTo, summarizeByUser, userId);
            let summaryRows: SummaryRow[] = await this.model.getSummaryData(workspaceId, dateFrom, dateTo, summarizeByUser, userId);
            this.model.delete();

            // if(summaryData == null) {
            if(summaryRows == null) {
                response.json(MakeSummaryResponse.ERRORS);
                return;
            }
            let summaryData: SummaryData[] = this.formatSummaryRows(summaryRows);
            response.json(MakeSummaryResponse.success(summaryData));
        } catch (error) {
            return next(error);
        }
    }

    public async getRecordsFilteredList(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let errors: Result<ValidationError> = validationResult(request);
            if(!errors.isEmpty()) {
                let errorsObject: Record<string, ValidationError> = errors.mapped();
                response.json(new FilterRecordsResponse(false,
                    errorsObject.dateFrom !== undefined ? errorsObject.dateFrom.msg : "",
                    errorsObject.dateTo !== undefined ? errorsObject.dateTo.msg : ""
                ));
                return;
            }

            let dateFrom: string = request.body.dateFrom;
            let dateTo: string = request.body.dateTo;

            console.log("Valor recibido de dateFrom = " + dateFrom);
            console.log("Valor recibido de dateTo = " + dateTo);

            if(dateFrom.length > 0 && dateTo.length > 0 && new Date(dateFrom) > new Date(dateTo)) {
                response.json(FilterRecordsResponse.REVERSED_DATES);
                return;
            }

            let workspaceId: number = super.getWorkspaceId(response);
            let currentUserId: number = super.getSessionUser(request).id;
            this.model = new RecordModel();

            let currentUserAllowed: boolean = await this.model.isUserInWorkspace(workspaceId, currentUserId);
            if(!currentUserAllowed) {
                this.model.delete();
                response.json(FilterRecordsResponse.ERRORS);
                return;
            }

            let summarizeByUser: boolean = new RegExp(/true/i).test(request.body.summarizeByUser);
            let userId: number = parseInt(request.body.user);

            let records: RecordEntity[] = await this.model.readRecordsWithFilters(workspaceId, dateFrom, dateTo, summarizeByUser, userId);
            this.model.delete();

            if(records == null) {
                response.json(FilterRecordsResponse.ERRORS);
                return;
            }
            response.json(FilterRecordsResponse.success(records));
        } catch (error) {
            return next(error);
        }
    }

    private formatSummaryRows(summaryRows: SummaryRow[]): SummaryData[] {
        let typesMap: Map<number, RecordType> = new Map();
        let categoriesMap: Map<number, Category> = new Map();
        let usersMap: Map<number, User> = new Map();
        let summaryMap: Map<number, Map<number, Map<number, number>>> = new Map();
        summaryRows.forEach(row => {
            typesMap.set(row.type_id, RecordType.of(row.type_id));
            categoriesMap.set(row.category_id, new Category(row.category_id, row.category_name));
            usersMap.set(row.user_id, new User(row.user_id, row.user_name, "", "", "", UserLevel.ANONYMOUS));
        });
        typesMap.forEach((recordType, typeId) => {
            summaryMap.set(typeId, new Map());
            categoriesMap.forEach((category, categoryId) => {
                summaryMap.get(typeId).set(categoryId, new Map());
                usersMap.forEach((user, userId) => {
                    summaryMap.get(typeId).get(categoryId).set(userId, 0);
                });
            });
        });
        summaryRows.forEach(row => {
            summaryMap.get(row.type_id).get(row.category_id).set(row.user_id, row.sum_amount);
        });

        let summaryData: SummaryData[] = [];
        typesMap.forEach((recordType, typeId) => {
            summaryData.push(<SummaryData>{
                type: recordType,
                categories: []
            });
            let currentSummary: SummaryData = summaryData.find(summary=> summary.type == recordType);
            categoriesMap.forEach((category, categoryId) => {
                currentSummary.categories.push(<CategorySummary>{
                    category: category,
                    users: []
                });
                let currentCategorySummary: CategorySummary = currentSummary.categories.find(catSum =>
                    catSum.category == category);
                usersMap.forEach((user, userId) => {
                    currentCategorySummary.users.push(<UserSummary>{
                        user: user,
                        value: summaryMap.get(typeId).get(categoryId).get(userId)})
                })
            })
        })

        return summaryData;



        // let currentSummary: SummaryData = null;
        //
        // let currentCategorySummary: CategorySummary = null;
        // let currentUserSummary: UserSummary = null;
        // for(let row of summaryRows) {
        //     if(currentSummary == null || currentSummary.type.id != row.type_id) {
        //         summaryData.push(<SummaryData>{
        //             type: RecordType.of(row.type_id),
        //             categories: <CategorySummary[]>[]});
        //         currentCategorySummary = null;
        //         currentUserSummary = null;
        //     }
        //     currentSummary = summaryData.find(summary => summary.type.id == row.type_id);
        //     if(currentCategorySummary == null || currentCategorySummary.category.id != row.category_id) {
        //         currentSummary.categories.push(<CategorySummary>{
        //             category: new Category(row.category_id, row.category_name),
        //             users: <UserSummary[]>[]
        //         });
        //         currentUserSummary = null;
        //     }
        //     currentCategorySummary = currentSummary.categories.find(summary =>
        //         summary.category.id == row.category_id);
        //     if(currentUserSummary == null || currentUserSummary.user.id != row.user_id) {
        //         currentCategorySummary.users.push(<UserSummary>{
        //             user: new User(row.user_id, row.user_name, "", "", "", UserLevel.ANONYMOUS),
        //             value: row.sum_amount
        //         });
        //     }
        //     currentUserSummary = currentCategorySummary.users.find(summary =>
        //         summary.user.id == row.user_id);
        // }
        // return summaryData;
    }
}

export default RecordController;
