import ServerController from "./ServerController";
import {NextFunction, Request, Response} from "express";
import WorkspaceModel from "../models/WorkspaceModel";
import Workspace from "../objects/entities/Workspace";
import User from "../objects/entities/User";
import WorkspaceResponse from "../objects/responses/WorkspaceResponse";
import PersistWorkspaceResponse from "../objects/responses/PersistWorkspaceResponse";
import ReadWorkspaceResponse from "../objects/responses/ReadWorkspaceResponse";
import {body, Result, ValidationChain, ValidationError, validationResult} from "express-validator";
import strip_tags from "striptags";
import {globalTrim} from "../modules/sanitizers";
import CRUDAction from "../objects/enums/CRUDAction";
import DeleteWorkspaceResponse from "../objects/responses/DeleteWorkspaceResponse";

class WorkspaceController extends ServerController<WorkspaceModel> {

    private static readonly MSG_NAME_EXISTS: string = "Ya tienes un espacio de trabajo con ese nombre. Usa otro.";
    private static readonly MSG_NOT_CREATED: string = "El espacio de trabajo no ha podido crearse.";
    private static readonly MSG_NOT_UPDATED: string = "El espacio de trabajo no existe o no ha podido actualizarse.";
    private static readonly MSG_NOT_DELETED: string = "El espacio de trabajo no existe o no ha podido borrarse.";

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

    public persistWorkspaceFilters(): ValidationChain[] {
        return [
            body("id")
                .exists()
                .isInt({min: 0}),
            body("name", "Máximo 30 caracteres")
                .exists()
                .customSanitizer(value => strip_tags(value))
                .customSanitizer(value => globalTrim(value))
                .isLength({min: 1, max: 30}),
            body("description", "Opcional, máximo 100 caracteres")
                .customSanitizer(value => strip_tags(value))
                .customSanitizer(value => globalTrim(value))
                .isLength({max: 100})
        ];
    }

    public async persistWorkspace(request: Request, response: Response, next: NextFunction): Promise<void> {
        let errors: Result<ValidationError> = validationResult(request);
        if(!errors.isEmpty()) {
            let errorsObject: Record<string, ValidationError> = errors.mapped();
            response.json(new PersistWorkspaceResponse(false,
                errorsObject.name !== undefined ? errorsObject.name.msg : "",
                errorsObject.description !== undefined ? errorsObject.description.msg : ""
            ));
            return;
        }

        let requestWorkspace: Workspace = new Workspace(
            <number>request.body.id,
            <string>request.body.name,
            <string>request.body.description,
            false
        );
        let userId: number = (<User>request.session["user"]).id;
        if(requestWorkspace.id == Workspace.NULL.id) {
            await this.createWorkspace(requestWorkspace, userId, response, next);
        } else {
            await this.updateWorkspace(requestWorkspace, userId, response, next);
        }
    }

    private async createWorkspace(requestWorkspace: Workspace, userId: number, response: Response, next: NextFunction): Promise<void> {
        try {
            this.model = new WorkspaceModel();

            let workspaceNameExists: boolean = await this.model.workspaceNameExists(userId, requestWorkspace.name);
            if(workspaceNameExists) {
                this.model.delete();
                response.json(new PersistWorkspaceResponse(false, WorkspaceController.MSG_NAME_EXISTS));
                return;
            }

            let newWorkspace: Workspace = await this.model.createWorkspace(userId, requestWorkspace);
            let success: boolean = (newWorkspace != null);

            this.model.delete();

            response.json(new PersistWorkspaceResponse(
                success,
                "",
                "",
                success ? "" : WorkspaceController.MSG_NOT_CREATED,
                success ? newWorkspace.id : Workspace.NULL.id
            ));
        } catch (error) {
            next(error);
        }
    }

    private async updateWorkspace(requestWorkspace: Workspace, userId: number, response: Response, next: NextFunction): Promise<void> {
        try {
            let updateResponse: PersistWorkspaceResponse = await this.alterWorkspace<PersistWorkspaceResponse>(
                requestWorkspace,
                CRUDAction.UPDATE,
                userId,
                new PersistWorkspaceResponse(false, "", "", WorkspaceController.MSG_NOT_UPDATED),
                new PersistWorkspaceResponse(true, "", "", "", requestWorkspace.id)
            );
            response.json(updateResponse);
        } catch (error) {
            next(error);
        }
    }

    private async alterWorkspace<T extends WorkspaceResponse<any>>(
        requestWorkspace: Workspace,
        action: CRUDAction.UPDATE | CRUDAction.DELETE,
        userId: number,
        responseOnNoAlter: T,
        responseOnAlter: T
    ): Promise<T> {
        this.model = new WorkspaceModel();
        let storedWorkspace: Workspace = await this.model.getWorkspaceProperties(requestWorkspace.id, userId);
        let altered: boolean = false;
        let alterable: boolean = (storedWorkspace != null && storedWorkspace.userIsAdmin);
        if(alterable) {
            switch (action) {
                case CRUDAction.UPDATE:
                    requestWorkspace.userIsAdmin = true;
                    altered = await this.model.updateWorkspaceProperties(requestWorkspace);
                    break;
                case CRUDAction.DELETE:
                    altered = await this.model.deleteWorkspace(requestWorkspace.id);
                    break;
            }
        }
        this.model.delete();
        if(!alterable || !altered) {
            return responseOnNoAlter;
        }
        return responseOnAlter;
    }

    public async deleteWorkspace(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let workspaceId: number = parseInt(request.params.id);
            let userId: number = (<User>request.session["user"]).id;
            let deleteResponse: DeleteWorkspaceResponse = await this.alterWorkspace<DeleteWorkspaceResponse>(
                new Workspace(workspaceId, "", "", false),
                CRUDAction.DELETE,
                userId,
                new DeleteWorkspaceResponse(false, WorkspaceController.MSG_NOT_DELETED),
                new DeleteWorkspaceResponse(true)
            );
            response.json(deleteResponse);
        } catch (error) {
            next(error);
        }
    }
}

export default WorkspaceController;
