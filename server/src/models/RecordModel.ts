import WorkspaceUsersModel from "./WorkspaceUsersModel";
import Record from "../objects/entities/Record";
import FullRecordRow from "../objects/rows/FullRecordRow";
import User from "../objects/entities/User";
import RecordType from "../objects/enums/RecordType";
import {CategorySummary, SummaryData, UserSummary} from "../objects/entities/SummaryData";
import SummaryRow from "../objects/rows/SummaryRow";
import Category from "../objects/entities/Category";
import UserLevel from "../objects/enums/UserLevel";

class RecordModel extends WorkspaceUsersModel {

    private static readonly SELECT_FULL_RECORD: string = `SELECT 
        R.id AS id, R.type AS type_id, R.date AS date, R.description AS description,
        R.amount AS amount, R.reference AS reference, R.shared AS shared,
        R.category AS category_id, C.name AS category_name, R.place AS place_id,
        P.name AS place_name, R.user AS user_id, U.name AS user_name, R.workspace AS workspace_id`;
    private static readonly SELECT_SUMMARY_RECORD: string = `SELECT
        R.type AS type_id,
        R.category AS category_id,
        C.name AS category_name,
        R.user AS user_id,
        U.name AS user_name,
        sum(R.amount) as sum_amount`;
    private static readonly FROM_FULL_JOIN: string = `FROM (
            (
                record R INNER JOIN category C ON C.id = R.category
            ) INNER JOIN place P ON P.id = R.place
        ) INNER JOIN users U ON U.id = R.user`;

    public async createRecord(newRecord: Record): Promise<number> {
        let sqlQuery: string = `INSERT INTO record
                                    (type, date, description, amount, reference, shared, category, place, user, workspace)
                                VALUES
                                    (:type, :date, :description, :amount, :reference, :shared, :category, :place, :user, :workspace)`;
        return await super.getSingleInsertedRecordId(sqlQuery, {
            "type": newRecord.type.id, "date": newRecord.date, "description": newRecord.description, "amount": newRecord.amount,
            "reference": newRecord.reference, "shared": newRecord.shared, "category": newRecord.category.id,
            "place": newRecord.place.id, "user": newRecord.user.id, "workspace": newRecord.workspace.id
        });
    }

    public async readRecordsByWorkspace(workspaceId: number, recordId: number = Record.NEW.id): Promise<Record[]> {
        let recordFilter: string = "";
        let values: Object = {"workspaceId": workspaceId};
        if(recordId != Record.NEW.id) {
            recordFilter = "AND R.id = :recordId";
            values["recordId"] = recordId;
        }
        let sqlQuery: string = `${RecordModel.SELECT_FULL_RECORD} ${RecordModel.FROM_FULL_JOIN}
                                WHERE R.workspace = :workspaceId
                                ${recordFilter}
                                ORDER BY R.date, P.name, R.reference, R.type`;
        let rows: FullRecordRow[] = await super.getMultipleRecords<FullRecordRow>(sqlQuery, values);
        return (rows != null ? rows.map(row => Record.ofFullRow(row)) : null);
    }

    public async readRecordsWithFilters(workspaceId: number, dateFrom: string, dateTo: string,
                                        summarizeByUser: boolean, userId: number = User.GUEST.id): Promise<Record[]> {
        let searchFilters: string = "";
        let values: Object = {
            "workspaceId": workspaceId
        };
        if(dateFrom.length > 0) {
            searchFilters += "AND R.date >= :dateFrom ";
            values["dateFrom"] = dateFrom;
        }
        if(dateTo.length > 0) {
            searchFilters += "AND R.date <= :dateTo ";
            values["dateTo"] = dateTo;
        }
        if(summarizeByUser) {
            searchFilters += "AND R.user = :userId ";
            values["userId"] = userId;
        } else {
            searchFilters += `AND R.type = ${RecordType.SPEND.id} AND R.shared = 1 `;
        }
        let sqlQuery: string = `${RecordModel.SELECT_FULL_RECORD} ${RecordModel.FROM_FULL_JOIN}
                                WHERE R.workspace = :workspaceId ${searchFilters}
                                ORDER BY R.date, P.name, R.reference, R.type`;
        let rows: FullRecordRow[] = await super.getMultipleRecords<FullRecordRow>(sqlQuery, values);
        return (rows != null ? rows.map(row => Record.ofFullRow(row)) : null);
    }

    public async updateRecord(changedRecord: Record): Promise<boolean> {
        let sqlQuery: string = `UPDATE record SET
                                    type = :typeId, date = :date, description = :description,
                                    amount = :amount, reference = :reference, shared = :shared,
                                    category = :categoryId, place = :placeId, user = :userId
                                WHERE id = :recordId AND workspace = :workspaceId`;
        return await super.updateSingleRecord(sqlQuery, {
            "typeId": changedRecord.type.id,
            "date": changedRecord.date,
            "description": changedRecord.description,
            "amount": changedRecord.amount,
            "reference": changedRecord.reference,
            "shared": changedRecord.shared,
            "categoryId": changedRecord.category.id,
            "placeId": changedRecord.place.id,
            "userId": changedRecord.user.id,
            "recordId": changedRecord.id,
            "workspaceId": changedRecord.workspace.id
        });
    }

    public async deleteWorkspaceRecord(recordId: number): Promise<boolean> {
        let sqlQuery: string = `DELETE FROM record WHERE id = :recordId`;
        return await super.deleteSingleRecord(sqlQuery, {"recordId": recordId});
    }

    public async getSummaryData(workspaceId: number, dateFrom: string, dateTo: string,
                                summarizeByUser: boolean, userId: number = User.GUEST.id): Promise<SummaryData[]> {
        let searchFilters: string = "";
        let values: Object = {
            "workspaceId": workspaceId
        };
        if(dateFrom.length > 0) {
            searchFilters += "AND R.date >= :dateFrom ";
            values["dateFrom"] = dateFrom;
        }
        if(dateTo.length > 0) {
            searchFilters += "AND R.date <= :dateTo ";
            values["dateTo"] = dateTo;
        }
        if(summarizeByUser) {
            searchFilters += "AND R.user = :userId ";
            values["userId"] = userId;
        } else {
            searchFilters += `AND R.type = ${RecordType.SPEND.id} AND R.shared = 1 `;
        }
        let sqlQuery: string = `${RecordModel.SELECT_SUMMARY_RECORD} ${RecordModel.FROM_FULL_JOIN}
                                   WHERE R.workspace = :workspaceId ${searchFilters}
                                   GROUP BY R.type, R.category, C.name, R.user, U.name
                                   ORDER BY R.type, C.name, U.name`;
        let rows: SummaryRow[] = await super.getMultipleRecords<SummaryRow>(sqlQuery, values);
        if(rows == null) {
            return null;
        }
        let summaryData: SummaryData[] = [];
        let currentSummary: SummaryData = null;

        let currentCategorySummary: CategorySummary = null;
        let currentUserSummary: UserSummary = null;
        for(let row of rows) {
            if(currentSummary == null || currentSummary.type.id != row.type_id) {
                summaryData.push(<SummaryData>{
                    type: RecordType.of(row.type_id),
                    categories: <CategorySummary[]>[]});
                currentCategorySummary = null;
                currentUserSummary = null;
            }
            currentSummary = summaryData.find(summary => summary.type.id == row.type_id);
            if(currentCategorySummary == null || currentCategorySummary.category.id != row.category_id) {
                currentSummary.categories.push(<CategorySummary>{
                    category: new Category(row.category_id, row.category_name),
                    users: <UserSummary[]>[]
                });
                currentUserSummary = null;
            }
            currentCategorySummary = currentSummary.categories.find(summary =>
                summary.category.id == row.category_id);
            if(currentUserSummary == null || currentUserSummary.user.id != row.user_id) {
                currentCategorySummary.users.push(<UserSummary>{
                    user: new User(row.user_id, row.user_name, "", "", "", UserLevel.ANONYMOUS),
                    value: row.sum_amount
                });
            }
            currentUserSummary = currentCategorySummary.users.find(summary =>
                summary.user.id == row.user_id);
        }
        return summaryData;
    }
}

export default RecordModel;
