import ServerController from "./ServerController";
import {NextFunction, Request, Response} from "express";
import {Result, ValidationChain, ValidationError, validationResult} from "express-validator";
import UserModel from "../models/UserModel";
import {makeHash, verifyHash} from "../modules/encryption";
import User, {FrontEndUser} from "../objects/entities/User";
import UserLevel from "../objects/enums/UserLevel";
import FilterFactory from "../objects/filters/FilterFactory";
import SignInResponse from "../objects/responses/users/SignInResponse";
import SignOutResponse from "../objects/responses/users/SignOutResponse";
import StatusResponse from "../objects/responses/users/StatusResponse";
import PersistUserResponse from "../objects/responses/users/PersistUserResponse";

interface PersistUserResult {
    user: User,
    response: PersistUserResponse
}

class UserController extends ServerController<UserModel> {

    public checkStatus(request: Request, response: Response): void {
        let userPublicInfo: FrontEndUser = User.GUEST.makeFrontEndUser();
        let sessionUser: User = super.getSessionUser(request);
        if(sessionUser !== undefined) {
            userPublicInfo = User.makeFrontEndUser(sessionUser);
        }
        response.json(new StatusResponse(true, userPublicInfo));
    }

    public persistUserFilters(): ValidationChain[] {
        return [
            FilterFactory.id(),
            FilterFactory.userName(),
            FilterFactory.userSurname(),
            FilterFactory.userEmail(),
            FilterFactory.password(true, false, true), //oldPass
            FilterFactory.password(false, true, true) //pass
        ];
    }

    public async persistUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let errors: Result<ValidationError> = validationResult(request);
            if(!errors.isEmpty()) {
                let errorsObject: Record<string, ValidationError> = errors.mapped();
                response.json(new PersistUserResponse(false,
                    errorsObject.name !== undefined ? errorsObject.name.msg : "",
                    errorsObject.surname !== undefined ? errorsObject.surname.msg : "",
                    errorsObject.email !== undefined ? errorsObject.email.msg : "",
                    errorsObject.oldPass !== undefined ? errorsObject.oldPass.msg : "",
                    errorsObject.pass !== undefined ? errorsObject.pass.msg : ""
                ));
                return;
            }

            let requestUser: User = new User(
                parseInt(request.body.id),
                request.body.name,
                request.body.surname,
                request.body.email,
                request.body.pass, //not encrypted!
                UserLevel.ANONYMOUS //unknown
            );
            let persistResult: PersistUserResult = null;
            let oldPass: string = request.body.oldPass;

            if(requestUser.id == User.GUEST.id) {
                if(requestUser.pass.length == 0) {
                    response.json(PersistUserResponse.NEW_PASSWORD_MISSING);
                    return;
                }
                persistResult = await this.createUser(requestUser, next);
            } else {
                if(requestUser.pass.length > 0 && oldPass.length == 0) {
                    response.json(PersistUserResponse.OLD_PASSWORD_MISSING);
                    return;
                }
                persistResult = await this.updateUser(requestUser, oldPass, next);
            }
            if(persistResult.user != null) {
                super.setSessionUser(request, persistResult.user);
            }
            console.log("Al terminar persistUser():");
            console.table(request.session["user"]);
            response.json(persistResult.response);
        } catch (error) {
            return next(error);
        }
    }

    private async createUser(requestUser: User, next: NextFunction): Promise<PersistUserResult> {
        try {
            this.model = new UserModel();

            let emailExists: boolean = await this.model.emailExists(requestUser.email);
            if (emailExists) {
                this.model.delete();
                return <PersistUserResult>{
                    user: null,
                    response: PersistUserResponse.EMAIL_EXISTS
                };
            }

            let encryptedPass: string = await makeHash(requestUser.pass);
            let newUser: User = await this.model.createUser(
                requestUser.name,
                requestUser.surname,
                requestUser.email,
                encryptedPass);
            this.model.delete();

            return <PersistUserResult>{
                user: newUser,
                response: newUser != null ? PersistUserResponse.SUCCESS : PersistUserResponse.USER_NOT_CREATED
            };
        } catch (error) {
            next(error);
            return null;
        }
    }

    private async updateUser(requestUser: User, oldPass: string, next: NextFunction): Promise<PersistUserResult> {
        try {
            this.model = new UserModel();
            let existingUser: User = await this.model.getUserById(requestUser.id);
            if(requestUser.email != existingUser.email && await this.model.emailExists(requestUser.email)) {
                this.model.delete();
                return <PersistUserResult>{
                    user: null,
                    response: PersistUserResponse.EMAIL_EXISTS
                };
            }
            let savedUser: User = await this.model.updateUserPersonalData(
                requestUser.id,
                requestUser.name,
                requestUser.surname,
                requestUser.email
            );
            let personalDataUpdated: boolean = (savedUser != null);
            let updatePassword: boolean = (oldPass.length > 0 && requestUser.pass.length > 0);
            let passwordUpdated: boolean = false;
            let encryptedPass: string = await makeHash(requestUser.pass);
            if(personalDataUpdated && updatePassword && await verifyHash(oldPass, savedUser.pass)) {
                passwordUpdated = await this.model.updateUserPassword(savedUser.id, encryptedPass);
            }
            this.model.delete();
            if(!personalDataUpdated) {
                return <PersistUserResult>{
                    user: null,
                    response: PersistUserResponse.DATA_NOT_UPDATED
                };
            }

            let persistResponse: PersistUserResponse;
            if(updatePassword && !passwordUpdated) {
                persistResponse = PersistUserResponse.PASSWORD_NOT_UPDATED;
            } else {
                savedUser.pass = encryptedPass;
                persistResponse = PersistUserResponse.SUCCESS;
            }

            return <PersistUserResult>{
                user: savedUser,
                response: persistResponse
            };
        } catch (error) {
            next(error);
            return null;
        }
    }

    public loginFilters(): ValidationChain[] {
        return [
            FilterFactory.userEmail(false),
            FilterFactory.password()
        ];
    }

    public async login(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let errors: Result<ValidationError> = validationResult(request);
            if(!errors.isEmpty()) {
                response.json(new SignInResponse(false, errors.array().map(error => error.msg)));
                return;
            }

            let email: string = request.body.email;
            let pass: string = request.body.pass;

            this.model = new UserModel();
            let user: User = await this.model.getUserByEmail(email);
            this.model.delete();

            let passMatches: boolean = false;
            if(user != null) {
                passMatches = await verifyHash(pass, user.pass);
            }

            if (user == null || !passMatches) {
                response.json(SignInResponse.LOGIN_INCORRECT);
                return;
            }
            super.setSessionUser(request, user);
            response.json(SignInResponse.LOGIN_OK);
        } catch(error) {
            return next(error);
        }
    }

    public logout(request: Request, response: Response, next: NextFunction): void {
        try {
            let userName: string = "";
            let sessionUser = super.getSessionUser(request);
            if(sessionUser !== undefined) {
                userName = sessionUser.name;
            }
            request.session.destroy(null);
            response.json(new SignOutResponse(userName.length > 0, userName));
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;
