import WorkspaceUsersModel from "./WorkspaceUsersModel";
import Record from "../objects/entities/Record";

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
}

export default RecordModel;
