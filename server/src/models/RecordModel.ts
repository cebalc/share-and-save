import WorkspaceUsersModel from "./WorkspaceUsersModel";
import Record from "../objects/entities/Record";
import FullRecordRow from "../objects/rows/FullRecordRow";

class RecordModel extends WorkspaceUsersModel {

    public async createRecord(type: number, date: string, description: string, amount: number,
                              reference: string, shared: boolean, category: number, place: number,
                              user: number, workspace: number): Promise<number> {
        let sqlQuery: string = `INSERT INTO record
                                    (type, date, description, amount, reference, shared, category, place, user, workspace)
                                VALUES
                                    (:type, :date, :description, :amount, :reference, :shared, :category, :place, :user, :workspace)`;
        return await super.getSingleInsertedRecordId(sqlQuery, {
            "type": type, "date": date, "description": description, "amount": amount, "reference": reference,
            "shared": shared, "category": category, "place": place, "user": user, "workspace": workspace
        });
    }

    public async readRecordsByWorkspace(workspaceId: number): Promise<Record[]> {
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
                                ORDER BY R.date, P.name, R.reference, R.type`;
        let rows: FullRecordRow[] = await super.getMultipleRecords<FullRecordRow>(sqlQuery, {"workspaceId": workspaceId});
        return (rows != null ? rows.map(row => Record.ofFullRow(row)) : null);
    }
}

export default RecordModel;
