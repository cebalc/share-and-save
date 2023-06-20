import {NextFunction, Request, Response} from "express";
import {Result, ValidationChain, ValidationError, validationResult} from "express-validator";
import WorkspaceModel from "../models/WorkspaceModel";
import WorkspaceUsersModel from "../models/WorkspaceUsersModel";
import Workspace from "../objects/entities/Workspace";
import User from "../objects/entities/User";
import CRUDAction from "../objects/enums/CRUDAction";
import UserLevel from "../objects/enums/UserLevel";
import FilterFactory from "../objects/filters/FilterFactory";
import AlterWorkspaceResponse from "../objects/responses/workspaces/AlterWorkspaceResponse";
import PersistWorkspaceResponse from "../objects/responses/workspaces/PersistWorkspaceResponse";
import ReadWorkspaceResponse from "../objects/responses/workspaces/ReadWorkspaceResponse";
import DeleteWorkspaceResponse from "../objects/responses/workspaces/DeleteWorkspaceResponse";
import WorkspaceDependentController from "./WorkspaceDependentController";

type AlterCommand = (requestWorkspace: Workspace, workspaceUserId: number, model: WorkspaceUsersModel) => Promise<boolean>;

class WorkspaceController extends WorkspaceDependentController<WorkspaceModel> {

    private static readonly MAX_FREE_WORKSPACES: number = 5;

    public async getWorkspaces(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let userId: number = (<User>request.session["user"]).id;
            this.model = new WorkspaceModel();
            let workspaces: Workspace[] = await this.model.getWorkspacesByUser(userId);
            this.model.delete();
            if(workspaces == null) {
                response.json(ReadWorkspaceResponse.NONE);
                return;
            }
            response.json(new ReadWorkspaceResponse(true, workspaces));
        } catch (error) {
            return next(error);
        }
    }

    public async getWorkspaceDetails(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let workspaceId: number = parseInt(request.params.id);
            let userId: number = (<User>request.session["user"]).id;
            this.model = new WorkspaceModel();
            let workspace: Workspace = await this.model.getWorkspace(workspaceId, userId);
            this.model.delete();
            response.json(new ReadWorkspaceResponse(workspace != null, [workspace]));
        } catch (error) {
            return next(error);
        }
    }

    public persistWorkspaceFilters(): ValidationChain[] {
        return [
            FilterFactory.id(),
            FilterFactory.workspaceName(),
            FilterFactory.workspaceDescription()
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
        let currentUser: User = <User>request.session["user"];
        if(requestWorkspace.id == Workspace.NULL.id) {
            await this.createWorkspace(requestWorkspace, currentUser, response, next);
        } else {
            await this.updateWorkspace(requestWorkspace, currentUser.id, response, next);
        }
    }

    private async createWorkspace(requestWorkspace: Workspace, currentUser: User, response: Response, next: NextFunction): Promise<void> {
        try {
            this.model = new WorkspaceUsersModel();

            let userWorkspaces: Workspace[] = await this.model.getWorkspacesByUser(currentUser.id);
            if(userWorkspaces != null && currentUser.level < UserLevel.PREMIUM && userWorkspaces.length >= WorkspaceController.MAX_FREE_WORKSPACES) {
                this.model.delete();
                response.json(PersistWorkspaceResponse.LIMIT_REACHED);
                return;
            }

            let newWorkspace: Workspace = await this.model.createWorkspace(currentUser.id, requestWorkspace);
            if(newWorkspace != null) {
                let userAddedToWorkspace: boolean = await (<WorkspaceUsersModel>this.model).addUserToWorkspace(
                    newWorkspace.id, currentUser.id, true);
                if(!userAddedToWorkspace) {
                    await this.model.deleteWorkspace(newWorkspace.id);
                    newWorkspace = null;
                }
            }
            this.model.delete();

            if(newWorkspace == null) {
                response.json(PersistWorkspaceResponse.NOT_CREATED);
                return;
            }
            response.json(PersistWorkspaceResponse.success(newWorkspace.id));
        } catch (error) {
            return next(error);
        }
    }

    private async updateWorkspace(requestWorkspace: Workspace, userId: number, response: Response, next: NextFunction): Promise<void> {
        try {
            this.model = new WorkspaceUsersModel();
            let updateResponse: PersistWorkspaceResponse = await this.alterWorkspace<PersistWorkspaceResponse>(
                requestWorkspace,
                CRUDAction.UPDATE,
                userId,
                <WorkspaceUsersModel>this.model,
                PersistWorkspaceResponse.NOT_UPDATED,
                PersistWorkspaceResponse.success(requestWorkspace.id)
            );
            this.model.delete();
            response.json(updateResponse);
        } catch (error) {
            return next(error);
        }
    }

    protected async sendUpdateCommand(requestWorkspace: Workspace, workspaceUserId: number, model: WorkspaceUsersModel): Promise<boolean> {
        return await model.updateWorkspaceProperties(requestWorkspace);
    }

    protected async sendDeleteCommand(requestWorkspace: Workspace, workspaceUserId: number, model: WorkspaceUsersModel): Promise<boolean> {
        await model.removeAllUsersFromWorkspace(requestWorkspace.id);
        return await model.deleteWorkspace(requestWorkspace.id);
    }

    protected async alterWorkspace<T extends AlterWorkspaceResponse<any>>(
        requestWorkspace: Workspace,
        action: CRUDAction.UPDATE | CRUDAction.DELETE,
        agentUserId: number,
        model: WorkspaceUsersModel,
        responseOnNoAlter: T,
        responseOnAlter: T,
        workspaceUserId: number = User.GUEST.id
    ): Promise<T> {
        let storedWorkspace: Workspace = await model.getWorkspace(requestWorkspace.id, agentUserId);
        let altered: boolean = false;
        let alterable: boolean = (storedWorkspace != null && storedWorkspace.userIsAdmin);
        let alterCommands: Map<CRUDAction, AlterCommand> = new Map([
            [CRUDAction.UPDATE, this.sendUpdateCommand],
            [CRUDAction.DELETE, this.sendDeleteCommand]
        ]);
        if(alterable) {
            altered = await alterCommands.get(action)(requestWorkspace, workspaceUserId, model);
        }
        if(!alterable || !altered) {
            return responseOnNoAlter;
        }
        return responseOnAlter;
    }

    public async deleteWorkspace(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let workspaceId: number = parseInt(request.params.id);
            let userId: number = (<User>request.session["user"]).id;
            this.model = new WorkspaceUsersModel();
            let deleteResponse: DeleteWorkspaceResponse = await this.alterWorkspace<DeleteWorkspaceResponse>(
                Workspace.idWrapper(workspaceId),
                CRUDAction.DELETE,
                userId,
                <WorkspaceUsersModel>this.model,
                DeleteWorkspaceResponse.NOT_DELETED,
                DeleteWorkspaceResponse.SUCCESS
            );
            this.model.delete();
            response.json(deleteResponse);
        } catch (error) {
            return next(error);
        }
    }
}

export default WorkspaceController;
