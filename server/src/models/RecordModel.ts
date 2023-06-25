import WorkspaceUsersModel from "./WorkspaceUsersModel";
import Record from "../objects/entities/Record";
import FullRecordRow from "../objects/rows/FullRecordRow";

class RecordModel extends WorkspaceUsersModel {

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
        let sqlQuery: string = `SELECT 
                                    R.id AS id, R.type AS type_id, R.date AS date, R.description AS description,
                                    R.amount AS amount, R.reference AS reference, R.shared AS shared,
                                    R.category AS category_id, C.name AS category_name, R.place AS place_id,
                                    P.name AS place_name, R.user AS user_id, U.name AS user_name, R.workspace AS workspace_id
                                FROM (
                                    (
                                        record R INNER JOIN category C ON C.id = R.category
                                    ) INNER JOIN place P ON P.id = R.place
                                ) INNER JOIN users U ON U.id = R.user
                                WHERE R.workspace = :workspaceId
                                ${recordFilter}
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
}

export default RecordModel;
