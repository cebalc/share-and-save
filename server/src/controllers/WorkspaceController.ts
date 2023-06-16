import ServerController from "./ServerController";
import {NextFunction, Request, Response} from "express";
import {Result, ValidationChain, ValidationError, validationResult} from "express-validator";
import WorkspaceModel from "../models/WorkspaceModel";
import UserModel from "../models/UserModel";
import Workspace from "../objects/entities/Workspace";
import User from "../objects/entities/User";
import CRUDAction from "../objects/enums/CRUDAction";
import FilterFactory from "../objects/filters/FilterFactory";
import AlterWorkspaceResponse from "../objects/responses/workspaces/AlterWorkspaceResponse";
import PersistWorkspaceResponse from "../objects/responses/workspaces/PersistWorkspaceResponse";
import ReadWorkspaceResponse from "../objects/responses/workspaces/ReadWorkspaceResponse";
import ReadWorkspaceUsersResponse from "../objects/responses/workspaces/ReadWorkspaceUsersResponse";
import DeleteWorkspaceResponse from "../objects/responses/workspaces/DeleteWorkspaceResponse";
import AddWorkspaceUserResponse from "../objects/responses/workspaces/AddWorkspaceUserResponse";
import UnlinkWorkspaceUserResponse from "../objects/responses/workspaces/UnlinkWorkspaceUserResponse";

class WorkspaceController extends ServerController<WorkspaceModel> {

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
                response.json(PersistWorkspaceResponse.NAME_EXISTS);
                return;
            }

            let newWorkspace: Workspace = await this.model.createWorkspace(userId, requestWorkspace);
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
            let updateResponse: PersistWorkspaceResponse = await this.alterWorkspace<PersistWorkspaceResponse>(
                requestWorkspace,
                CRUDAction.UPDATE,
                userId,
                PersistWorkspaceResponse.NOT_UPDATED,
                PersistWorkspaceResponse.success(requestWorkspace.id)
            );
            response.json(updateResponse);
        } catch (error) {
            return next(error);
        }
    }

    private async alterWorkspace<T extends AlterWorkspaceResponse<any>>(
        requestWorkspace: Workspace,
        action: CRUDAction.UPDATE | CRUDAction.DELETE,
        agentUserId: number,
        responseOnNoAlter: T,
        responseOnAlter: T,
        workspaceUserId: number = User.GUEST.id
    ): Promise<T> {
        this.model = new WorkspaceModel();
        let storedWorkspace: Workspace = await this.model.getWorkspace(requestWorkspace.id, agentUserId);
        let altered: boolean = false;
        let alterable: boolean = (storedWorkspace != null && storedWorkspace.userIsAdmin);
        if(alterable) {
            switch (action) {
                case CRUDAction.UPDATE:
                    if(workspaceUserId == User.GUEST.id) {
                        requestWorkspace.userIsAdmin = true;
                        altered = await this.model.updateWorkspaceProperties(requestWorkspace);
                    } else {
                        altered = await this.model.addUserToWorkspace(requestWorkspace.id, workspaceUserId);
                    }
                    break;
                case CRUDAction.DELETE:
                    if(workspaceUserId == User.GUEST.id) {
                        altered = await this.model.deleteWorkspace(requestWorkspace.id);
                    } else {
                        altered = await this.model.removeUserFromWorkspace(requestWorkspace.id, workspaceUserId);
                    }
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
                DeleteWorkspaceResponse.NOT_DELETED,
                DeleteWorkspaceResponse.SUCCESS
            );
            response.json(deleteResponse);
        } catch (error) {
            return next(error);
        }
    }

    public async getWorkspaceUsers(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            this.model = new WorkspaceModel();
            let userId: number = (<User>request.session["user"]).id;
            let workspaceId: number = parseInt(request.params.id);

            let workspaceUsers: User[] = await this.model.getUsersByWorkspace(workspaceId);
            this.model.delete();

            if(workspaceUsers == null || !workspaceUsers.some(user => user.id == userId)) {
                response.json(ReadWorkspaceUsersResponse.ERRORS);
                return;
            }
            response.json(new ReadWorkspaceUsersResponse(true,
                workspaceUsers.map(user => user.makeFrontEndUser())));
        } catch (error) {
            return next(error);
        }
    }

    public addWorkspaceUserFilters(): ValidationChain {
        return FilterFactory.userEmail();
    }

    public async addWorkspaceUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let errors: Result<ValidationError> = validationResult(request);
            if(!errors.isEmpty()) {
                let errorsObject: Record<string, ValidationError> = errors.mapped();
                response.json(new AddWorkspaceUserResponse(false,
                    errorsObject.email !== undefined ? errorsObject.email.msg : ""
                ));
                return;
            }

            let workspaceId: number = parseInt(request.params.id);
            let workspaceUserEmail: string = request.body.email;
            let agentUserId: number = (<User>request.session["user"]).id;

            let userModel: UserModel = new UserModel();
            let newWorkspaceUser: User = await userModel.getUserByEmail(workspaceUserEmail);
            userModel.delete();
            if(newWorkspaceUser == null) {
                response.json(AddWorkspaceUserResponse.USER_NOT_FOUND);
                return;
            }

            this.model = new WorkspaceModel();
            let workspaceUsers: User[] = await this.model.getUsersByWorkspace(workspaceId);
            this.model.delete();
            if(workspaceUsers.some(user => user.id == newWorkspaceUser.id)) {
                response.json(AddWorkspaceUserResponse.USER_LINKED);
                return;
            }

            let addResponse: AddWorkspaceUserResponse = await this.alterWorkspace<AddWorkspaceUserResponse>(
                new Workspace(workspaceId, "", "", false),
                CRUDAction.UPDATE,
                agentUserId,
                AddWorkspaceUserResponse.USER_NOT_ADDED,
                AddWorkspaceUserResponse.SUCCESS,
                newWorkspaceUser.id
            );
            response.json(addResponse);
        } catch (error) {
            return next(error);
        }
    }

    public async unlinkWorkspaceUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let workspaceId: number = parseInt(request.params.workspace);
            let unlinkUserId: number = parseInt(request.params.user);
            let agentUserId: number = (<User>request.session["user"]).id;

            let unlinkResponse: UnlinkWorkspaceUserResponse = await this.alterWorkspace<UnlinkWorkspaceUserResponse>(
                new Workspace(workspaceId, "", "", false),
                CRUDAction.DELETE,
                agentUserId,
                UnlinkWorkspaceUserResponse.NOT_UNLINKED,
                UnlinkWorkspaceUserResponse.SUCCESS,
                unlinkUserId
            );
            response.json(unlinkResponse);
        } catch (error) {
            return next(error);
        }
    }
}

export default WorkspaceController;
