import Model from "./Model";
import Workspace from "../objects/entities/Workspace";
import { OkPacket, RowDataPacket } from "mysql2";

class WorkspaceModel extends Model {

    public async workspaceNameExists(userId: number, name: string): Promise<boolean> {
        let sqlQuery: string = `SELECT Count(W.id) AS wscount FROM workspace W INNER JOIN workspace_members WM
                ON W.id = WM.workspace WHERE WM.user = :userId AND W.name = :name`;
        let results: any = await super.preparedQuery(sqlQuery, {"userId": userId, "name": name});
        return !(<boolean>results) || (<RowDataPacket[]>results)[0].wscount === 1;
    }

    public async addUserToWorkspace(workspaceId: number, userId: number, userIsAdmin: boolean = false) {

    }

    public async removeAllUsersFromWorkspace(workspaceId: number): Promise<boolean> {
        let sqlQuery: string = "DELETE FROM workspace_members WHERE workspace = :workspaceId";
        let result: any = await super.preparedQuery(sqlQuery, {"workspaceId": workspaceId});
        return <boolean>result;
    }

    public async deleteWorkspace(workspaceId: number): Promise<boolean> {
        await this.removeAllUsersFromWorkspace(workspaceId);
        let sqlQuery: string = "DELETE FROM workspace WHERE id = :workspaceId";
        let result: any = await super.preparedQuery(sqlQuery, {"workspaceId": workspaceId});
        return !(!<boolean>result || (<OkPacket>result).affectedRows != 1);
    }

    public async getWorkspaceProperties(workspaceId: number, userId: number): Promise<Workspace> {
        let sqlQuery: string = `SELECT W.name, W.description, WM.admin FROM workspace W
                                        INNER JOIN workspace_members WM on W.id = WM.workspace
                                        WHERE W.id = :workspaceId AND WM.user = :userId`;
        let result: any = await super.preparedQuery(sqlQuery, {"workspaceId": workspaceId, "userId": userId});
        if(!<boolean>result || (<RowDataPacket[]>result).length != 1) {
            return null;
        }
        let row: RowDataPacket = (<RowDataPacket[]>result)[0];
        return new Workspace(workspaceId, row.name, row.description, row.admin);
    }

    public async updateWorkspaceProperties(workspace: Workspace): Promise<boolean> {
        let sqlQuery: string = "UPDATE workspace SET name = :name, description = :description WHERE id = :id";
        let result: any = await super.preparedQuery(sqlQuery, {
            "name": workspace.name,
            "description": workspace.description,
            "id": workspace.id
        });
        return !(!<boolean>result || (<OkPacket>result).affectedRows != 1);
    }

    public async getWorkspacesByUser(userId: number): Promise<Workspace[]> {
        let sqlQuery: string = `
            SELECT
                W.id AS id, W.name AS name, W.description AS description, WM.admin AS admin
                FROM workspace W INNER JOIN workspace_members WM ON W.id = WM.workspace
                WHERE WM.user = :userId
                ORDER BY W.name`;
        let results: any = await super.preparedQuery(sqlQuery, {"userId": userId});
        if(!<boolean>results) { //Error en la consulta
            return null;
        }
        return (<RowDataPacket[]>results).map(row =>
            new Workspace(row.id, row.name, row.description, row.admin)
        );
    }

    public async createWorkspace(userId: number, workspace: Workspace): Promise<Workspace> {
        let createSqlQuery: string = "INSERT INTO workspace (name, description) VALUES (:name, :description)";
        let createResult: any = await super.preparedQuery(createSqlQuery, {
            "name": workspace.name,
            "description": workspace.description}
        );
        if(!(<boolean>createResult)) {
            return null;
        }
        let workspaceId: number = (<OkPacket>createResult).insertId;
        let addUserSqlQuery: string = "INSERT INTO workspace_members (workspace, user, admin) VALUES (:workspaceId, :userId, 1)";
        let addUserResult: any = await super.preparedQuery(addUserSqlQuery, {"workspaceId": workspaceId, "userId": userId});
        if(!(<boolean>addUserResult)) {
            await this.deleteWorkspace(workspaceId);
            return null;
        }
        workspace.id = workspaceId;
        workspace.userIsAdmin = true;
        return workspace;
    }
}

export default WorkspaceModel;
