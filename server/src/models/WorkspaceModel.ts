import Model from "./Model";
import User from "../objects/entities/User";
import Workspace from "../objects/entities/Workspace";
import { OkPacket } from "mysql2";
import UserRow from "../objects/rows/UserRow";
import WorkspaceRow from "../objects/rows/WorkspaceRow";

class WorkspaceModel extends Model {

    public async workspaceNameExists(userId: number, name: string): Promise<boolean> {
        let userWorkspaces: Workspace[] = await this.getWorkspacesByUser(userId);
        if(userWorkspaces == null) {
            return true;
        }
        return userWorkspaces.some(workspace => workspace.name == name);
    }

    public async getUsersByWorkspace(workspaceId: number): Promise<User[]> {
        let sqlQuery: string = `SELECT
                U.id AS id, U.name AS name, U.surname AS surname, U.email AS email, U.pass AS pass, U.level AS level
                FROM users U INNER JOIN workspace_members WM ON U.id = WM.user
                WHERE WM.workspace = :workspaceId
                ORDER BY WM.admin DESC, U.name ASC`;
        let rows: UserRow[] = await this.getMultipleRecords<UserRow>(sqlQuery, {"workspaceId": workspaceId});
        return (rows != null ? rows.map(row => User.ofRow(row)) : null);
    }

    public async addUserToWorkspace(workspaceId: number, userId: number, userIsAdmin: boolean = false): Promise<boolean> {
        let sqlQuery: string = `INSERT INTO workspace_members (workspace, user, admin)
                                    VALUES (:workspaceId, :userId, :userIsAdmin)`;
        return await super.singleInsertedRecordSuccessful(sqlQuery, {
            "workspaceId": workspaceId,
            "userId": userId,
            "userIsAdmin": userIsAdmin
        });
    }

    public async removeAllUsersFromWorkspace(workspaceId: number): Promise<number> {
        let sqlQuery: string = "DELETE FROM workspace_members WHERE workspace = :workspaceId";
        let result: OkPacket = await super.deleteMultipleRecords(sqlQuery, {"workspaceId": workspaceId});
        return result.affectedRows;
    }

    public async removeUserFromWorkspace(workspaceId: number, workspaceUserId: number): Promise<boolean> {
        let sqlQuery: string = `DELETE FROM workspace_members WHERE
                                    workspace = :workspaceId AND
                                    user = :workspaceUserId`;
        return await super.deleteSingleRecord(sqlQuery, {
            "workspaceId": workspaceId,
            "workspaceUserId": workspaceUserId
        });
    }

    public async deleteWorkspace(workspaceId: number): Promise<boolean> {
        await this.removeAllUsersFromWorkspace(workspaceId);
        let sqlQuery: string = "DELETE FROM workspace WHERE id = :workspaceId";
        return await this.deleteSingleRecord(sqlQuery, {"workspaceId": workspaceId});
    }

    public async getWorkspace(workspaceId: number, userId: number): Promise<Workspace> {
        let sqlQuery: string = `SELECT W.id, W.name, W.description, WM.admin FROM workspace W
                                        INNER JOIN workspace_members WM on W.id = WM.workspace
                                        WHERE W.id = :workspaceId AND WM.user = :userId`;
        let workspaceRow: WorkspaceRow = await super.getSingleRecord<WorkspaceRow>(sqlQuery, {
            "workspaceId": workspaceId,
            "userId": userId}
        );
        return (workspaceRow != null ? Workspace.ofRow(workspaceRow) : null);
    }

    public async updateWorkspaceProperties(workspace: Workspace): Promise<boolean> {
        let sqlQuery: string = "UPDATE workspace SET name = :name, description = :description WHERE id = :id";
        return await super.updateSingleRecord(sqlQuery, {
            "name": workspace.name,
            "description": workspace.description,
            "id": workspace.id
        });
    }

    public async getWorkspacesByUser(userId: number): Promise<Workspace[]> {
        let sqlQuery: string = `SELECT
                W.id AS id, W.name AS name, W.description AS description, WM.admin AS admin
                FROM workspace W INNER JOIN workspace_members WM ON W.id = WM.workspace
                WHERE WM.user = :userId
                ORDER BY W.name`;
        let workspaceRows: WorkspaceRow[] = await super.getMultipleRecords<WorkspaceRow>(sqlQuery, {"userId": userId});
        return (workspaceRows != null ? workspaceRows.map(row => Workspace.ofRow(row)) : null);
    }

    public async createWorkspace(userId: number, workspace: Workspace): Promise<Workspace> {
        let sqlQuery: string = "INSERT INTO workspace (name, description) VALUES (:name, :description)";
        let workspaceId: number = await super.getSingleInsertedRecordId(sqlQuery, {
            "name": workspace.name,
            "description": workspace.description
        });
        if(workspaceId == WorkspaceModel.ID_NULL) {
            return null;
        }

        let userAddedToWorkspace: boolean = await this.addUserToWorkspace(workspaceId, userId, true);
        if(!userAddedToWorkspace) {
            await this.deleteWorkspace(workspaceId);
            return null;
        }

        workspace.id = workspaceId;
        workspace.userIsAdmin = true;
        return workspace;
    }
}

export default WorkspaceModel;
