import ServerController from "./ServerController";
import { Request, Response, NextFunction } from "express";
import WorkspaceModel from "../models/WorkspaceModel";
import Workspace from "../objects/entities/Workspace";
import User from "../objects/User";
import CreateWorkspaceResponse from "../objects/responses/CreateWorkspaceResponse";

class WorkspaceController extends ServerController<WorkspaceModel> {

    private static readonly MSG_NAME_EXISTS: string = "Ya tienes un espacio de trabajo con ese nombre. Usa otro.";
    private static readonly MSG_NOT_CREATED: string = "El espacio de trabajo no ha podido crearse.";

    public async createWorkspace(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let name: string = request.body.name;
            let description: string = request.body.description;
            let userId: number = (<User>request.session["user"]).id;
            this.model = new WorkspaceModel();

            let workspaceNameExists: boolean = await this.model.workspaceNameExists(userId, name);
            console.table(workspaceNameExists);
            if(workspaceNameExists) {
                this.model.delete();
                response.json(new CreateWorkspaceResponse(false, WorkspaceController.MSG_NAME_EXISTS));
                return;
            }

            let newWorkspace: Workspace = await this.model.createWorkspace(userId, name, description);
            this.model.delete();

            let success: boolean = (newWorkspace != null);
            let globalError: string = WorkspaceController.MSG_NOT_CREATED;
            let wsId: number = 0;
            if(success) {
                globalError = "";
                wsId = newWorkspace.id;
            }
            response.json(new CreateWorkspaceResponse(success, "", "", globalError, wsId));
        } catch (error) {
            next(error);
        }
    }
}

export default WorkspaceController;