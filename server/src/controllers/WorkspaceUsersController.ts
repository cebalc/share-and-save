import {NextFunction, Request, Response} from "express";
import {Result, ValidationChain, ValidationError, validationResult} from "express-validator";
import WorkspaceController from "./WorkspaceController";
import UserModel from "../models/UserModel";
import WorkspaceUsersModel from "../models/WorkspaceUsersModel";
import User from "../objects/entities/User";
import Workspace from "../objects/entities/Workspace";
import FilterFactory from "../objects/filters/FilterFactory";
import CRUDAction from "../objects/enums/CRUDAction";
import ReadWorkspaceUsersResponse from "../objects/responses/workspaces/users/ReadWorkspaceUsersResponse";
import AddWorkspaceUserResponse from "../objects/responses/workspaces/users/AddWorkspaceUserResponse";
import UnlinkWorkspaceUserResponse from "../objects/responses/workspaces/users/UnlinkWorkspaceUserResponse";
import AlterWorkspaceUsersResponse from "../objects/responses/workspaces/users/AlterWorkspaceUsersResponse";

class WorkspaceUsersController extends WorkspaceController {

    protected model: WorkspaceUsersModel;

    private getWorkspaceId(request: Request): number {
        return parseInt(request["workspaceId"]);
    }

    public async getWorkspaceUsers(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            this.model = new WorkspaceUsersModel();
            let userId: number = (<User>request.session["user"]).id;
            let workspaceId: number = this.getWorkspaceId(request);

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

            let workspaceId: number = this.getWorkspaceId(request);
            let workspaceUserEmail: string = request.body.email;
            let agentUserId: number = (<User>request.session["user"]).id;

            let userModel: UserModel = new UserModel();
            let newWorkspaceUser: User = await userModel.getUserByEmail(workspaceUserEmail);
            userModel.delete();
            if(newWorkspaceUser == null) {
                response.json(AddWorkspaceUserResponse.USER_NOT_FOUND);
                return;
            }

            this.model = new WorkspaceUsersModel();
            let workspaceUsers: User[] = await this.model.getUsersByWorkspace(workspaceId);
            if(workspaceUsers.some(user => user.id == newWorkspaceUser.id)) {
                this.model.delete();
                response.json(AddWorkspaceUserResponse.USER_LINKED);
                return;
            }

            let addResponse: AddWorkspaceUserResponse = await this.alterWorkspace<AddWorkspaceUserResponse>(
                Workspace.idWrapper(workspaceId),
                CRUDAction.UPDATE,
                agentUserId,
                this.model,
                AddWorkspaceUserResponse.USER_NOT_ADDED,
                AddWorkspaceUserResponse.SUCCESS,
                newWorkspaceUser.id
            );
            this.model.delete();
            response.json(addResponse);
        } catch (error) {
            return next(error);
        }
    }

    public async unlinkWorkspaceUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let workspaceId: number = this.getWorkspaceId(request);
            let unlinkUserId: number = parseInt(request.params.user);
            let agentUserId: number = (<User>request.session["user"]).id;

            this.model = new WorkspaceUsersModel();
            let unlinkResponse: UnlinkWorkspaceUserResponse = await this.alterWorkspace<UnlinkWorkspaceUserResponse>(
                Workspace.idWrapper(workspaceId),
                CRUDAction.DELETE,
                agentUserId,
                this.model,
                UnlinkWorkspaceUserResponse.NOT_UNLINKED,
                UnlinkWorkspaceUserResponse.SUCCESS,
                unlinkUserId
            );
            this.model.delete();

            response.json(unlinkResponse);
        } catch (error) {
            return next(error);
        }
    }

    protected async alterWorkspace<T extends AlterWorkspaceUsersResponse<any>>(requestWorkspace: Workspace, action: CRUDAction.UPDATE | CRUDAction.DELETE, agentUserId: number, model: WorkspaceUsersModel, responseOnNoAlter: T, responseOnAlter: T, workspaceUserId: number): Promise<T> {
        return super.alterWorkspace<T>(requestWorkspace, action, agentUserId, model, responseOnNoAlter, responseOnAlter, workspaceUserId);
    }

    protected async sendUpdateCommand(requestWorkspace: Workspace, workspaceUserId: number, model: WorkspaceUsersModel): Promise<boolean> {
        return model.addUserToWorkspace(requestWorkspace.id, workspaceUserId);
    }

    protected async sendDeleteCommand(requestWorkspace: Workspace, workspaceUserId: number, model: WorkspaceUsersModel): Promise<boolean> {
        return model.removeUserFromWorkspace(requestWorkspace.id, workspaceUserId);
    }
}

export default WorkspaceUsersController;
