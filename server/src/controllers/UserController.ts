import ServerController from "./ServerController";
import {NextFunction, Request, Response} from "express";
import UserModel from "../models/UserModel";
import {makeHash, verifyHash} from "../modules/encryption";
import User, {UserPublicInfo} from "../objects/entities/User";
import {body, Result, ValidationChain, ValidationError, validationResult} from "express-validator";
import strip_tags from "striptags";
import SignInResponse from "../objects/responses/users/SignInResponse";
import SignOutResponse from "../objects/responses/users/SignOutResponse";
import StatusResponse from "../objects/responses/users/StatusResponse";
import FilterFactory from "../objects/filters/FilterFactory";
import PersistUserResponse from "../objects/responses/users/PersistUserResponse";

class UserController extends ServerController<UserModel> {
    private static MSG_INV_LOGIN: string = "Usuario o contraseña incorrectos";

    public checkStatus(request: Request, response: Response): void {
        let userPublicInfo: UserPublicInfo = User.GUEST.getPublicInfo();
        if(request.session["user"] !== undefined) {
            userPublicInfo = User.extractUserPublicInfo(request.session["user"]);
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

            let userId: number = parseInt(request.body.id);
            let pass: string = request.body.pass;
            let oldPass: string = request.body.oldPass;

            if(userId == User.GUEST.id) {
                if(pass.length == 0) {
                    response.json(new PersistUserResponse(false, "", "", "", "",
                        "Debes introducir una contraseña")
                    );
                    return;
                }
                await this.createUser(request, response, next);
            } else {
                if(pass.length > 0 && oldPass.length == 0) {
                    response.json(new PersistUserResponse(false, "", "", "",
                        "Debes introducir tu contraseña actual")
                    );
                    return;
                }
                await this.updateUser(request, response, next);
            }
        } catch (error) {
            return next(error);
        }
    }

    private async createUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let name: string = request.body.name;
            let surname: string = request.body.surname;
            let email: string = request.body.email;
            let pass: string = request.body.pass;

            this.model = new UserModel();

            let emailExists: boolean = await this.model.emailExists(email);
            if (emailExists) {
                this.model.delete();
                response.json(new PersistUserResponse(false, "", "",
                    "El email introducido ya existe. Escoge otro.")
                );
                return;
            }

            let encryptedPass: string = await makeHash(pass);
            let newUser: User = await this.model.createUser(name, surname, email, encryptedPass);
            this.model.delete();

            let success: boolean = (newUser != null);
            if(success) {
                request.session["user"] = newUser;
            }
            response.json(new PersistUserResponse(success, "", "", "", "", "",
                success ? "" : "El usuario no ha podido crearse")
            );
        } catch (error) {
            return next(error);
        }
    }

    private async updateUser(request: Request, response: Response, next: NextFunction): Promise<void> {

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
                response.json(new SignInResponse(false, [UserController.MSG_INV_LOGIN]));
                return;
            }
            request.session["user"] = user;
            response.json(new SignInResponse(true));
        } catch(error) {
            return next(error);
        }
    }

    public logout(request: Request, response: Response, next: NextFunction): void {
        try {
            let userName: string = "";
            if(request.session["user"] !== undefined) {
                userName = (<User>request.session["user"]).name;
            }
            request.session.destroy(null);
            response.json(new SignOutResponse(userName.length > 0, userName));
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;
