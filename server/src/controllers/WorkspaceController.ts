import ServerController from "./ServerController";
import { Request, Response, NextFunction } from "express";
import WorkspaceModel from "../models/WorkspaceModel";
import Workspace from "../objects/entities/Workspace";
import User from "../objects/User";
import CreateWorkspaceResponse from "../objects/responses/CreateWorkspaceResponse";
import ReadWorkspaceResponse from "../objects/responses/ReadWorkspaceResponse";
import UserModel from "../models/UserModel";

class WorkspaceController extends ServerController<WorkspaceModel> {

    private static readonly MSG_NAME_EXISTS: string = "Ya tienes un espacio de trabajo con ese nombre. Usa otro.";
    private static readonly MSG_NOT_CREATED: string = "El espacio de trabajo no ha podido crearse.";

    public async getWorkspaces(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let userId: number = (<User>request.session["user"]).id;
            this.model = new WorkspaceModel();
            let workspaces: Workspace[] = await this.model.getWorkspacesByUser(userId);
            this.model.delete();
            if(workspaces == null) {
                response.json({success: false, data: []});
                return;
            }
            response.json({
                success: true,
                data: workspaces
            });
        } catch (error) {
            return next(error);
        }
    }

    public async getWorkspaceDetails(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let workspaceId: number = parseInt(request.params.id);
            let userId: number = (<User>request.session["user"]).id;
            this.model = new WorkspaceModel();
            let workspace: Workspace = await this.model.getWorkspaceProperties(workspaceId, userId);
            this.model.delete();
            response.json(new ReadWorkspaceResponse(workspace != null, [workspace]));
        } catch (error) {
            next(error);
        }
    }

    public async createWorkspace(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let name: string = request.body.name;
            let description: string = request.body.description;
            let userId: number = (<User>request.session["user"]).id;
            this.model = new WorkspaceModel();

            let workspaceNameExists: boolean = await this.model.workspaceNameExists(userId, name);
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
