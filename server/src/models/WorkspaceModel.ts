import Model from "./Model";
import Workspace from "../objects/entities/Workspace";
import WorkspaceRow from "../objects/rows/WorkspaceRow";

class WorkspaceModel extends Model {

    public async deleteWorkspace(workspaceId: number): Promise<boolean> {
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

        workspace.id = workspaceId;
        workspace.userIsAdmin = true;
        return workspace;
    }
}

export default WorkspaceModel;
