import WorkspaceModel from "./WorkspaceModel";
import User from "../objects/entities/User";
import UserRow from "../objects/rows/UserRow";
import {OkPacket} from "mysql2";

class WorkspaceUsersModel extends WorkspaceModel {

    public async getUsersByWorkspace(workspaceId: number): Promise<User[]> {
        let sqlQuery: string = `SELECT
                U.id AS id, U.name AS name, U.surname AS surname, U.email AS email, U.pass AS pass, U.level AS level
                FROM users U INNER JOIN workspace_members WM ON U.id = WM.user
                WHERE WM.workspace = :workspaceId
                ORDER BY WM.admin DESC, U.name ASC`;
        let rows: UserRow[] = await super.getMultipleRecords<UserRow>(sqlQuery, {"workspaceId": workspaceId});
        return (rows != null ? rows.map(row => User.ofRow(row)) : null);
    }

    public async isUserInWorkspace(workspaceId: number, ...userIds: number[]): Promise<boolean> {
        let workspaceUsers: User[] = await this.getUsersByWorkspace(workspaceId);
        let workspaceUserIds: number[] = workspaceUsers.map(user => user.id);
        return userIds.every(userId=> workspaceUserIds.includes(userId));
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
}

export default WorkspaceUsersModel;
