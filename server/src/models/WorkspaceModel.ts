import Model from "./Model";
import Workspace from "../objects/entities/Workspace";
import {OkPacket, RowDataPacket} from "mysql2";
import workspace from "../objects/entities/Workspace";
import user from "../objects/User";
import {create} from "domain";

class WorkspaceModel extends Model {

    public async workspaceNameExists(userId: number, name: string): Promise<boolean> {
        let sqlQuery: string = `SELECT Count(W.id) AS wscount FROM workspace W INNER JOIN workspace_members WM
                ON W.id = WM.workspace WHERE WM.user = :userId AND W.name = :name`;
        let results: any = await this.preparedQuery(sqlQuery, {"userId": userId, "name": name});
        return !(<boolean>results) || (<RowDataPacket[]>results)[0].wscount === 1;
    }

    public async addUserToWorkspace(workspaceId: number, userId: number, userIsAdmin: boolean = false) {

    }

    public async deleteWorkspace(workspaceId: number): Promise<boolean> {
        return true;
    }

    public async createWorkspace(userId: number, name: string, description: string): Promise<Workspace> {
        let createSqlQuery: string = "INSERT INTO workspace (name, description) VALUES (:name, :description)";
        let createResult: any = await this.preparedQuery(createSqlQuery, {"name": name, "description": description});
        if(!(<boolean>createResult)) {
            return null;
        }
        let workspaceId: number = (<OkPacket>createResult).insertId;
        let addUserSqlQuery: string = "INSERT INTO workspace_members (workspace, user, admin) VALUES (:workspaceId, :userId, 1)";
        let addUserResult: any = await this.preparedQuery(addUserSqlQuery, {"workspaceId": workspaceId, "userId": userId});
        if(!(<boolean>addUserResult)) {
            await this.deleteWorkspace(workspaceId);
            return null;
        }
        return new Workspace(workspaceId, name, description, true);
    }
}

export default WorkspaceModel;
