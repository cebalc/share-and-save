import ServerController from "./ServerController";
import { NextFunction, Request, Response } from "express";
import UserModel from "../models/UserModel";
import { makeHash, verifyHash } from "../modules/encryption";
import User from "../objects/User";
import { ValidationChain, body, validationResult } from "express-validator";
import { globalTrim } from "../modules/sanitizers";
import strip_tags from "striptags";

class UserController extends ServerController<UserModel> {
    private static MSG_NO_USER: string = "No existe ningún usuario asociado al email introducido."
    private static MSG_INV_PASS: string = "La contraseña introducida no es correcta.";

    public checkStatus(request: Request, response: Response): void {
        let userLevel: number = User.ANONYMOUS;
        let userName: string = "";
        let user = request.session["user"];
        if(user !== undefined) {
            userLevel = (user as User).level;
            userName = (user as User).name;
        }
        response.json({
            success: true,
            data: { userLevel, userName }
        });
    }

    public createUserFilters(): ValidationChain[] {
        return [
            body("name", "Máximo 25 caracteres, sin símbolos")
                .exists()
                .customSanitizer(value => strip_tags(value))
                .customSanitizer(value => globalTrim(value))
                .matches(/^[a-záéíóú\s]{1,25}$/i),
            body("surname", "Máximo 50 caracteres, sin símbolos")
                .exists()
                .customSanitizer(value => strip_tags(value))
                .customSanitizer(value => globalTrim(value))
                .matches(/^[a-záéíóú\s]{1,50}$/i),
            body("email", "Dirección válida de hasta 50 caracteres")
                .exists()
                .notEmpty()
                .isEmail()
                .normalizeEmail({
                    all_lowercase: true,
                    gmail_remove_dots: true}),
            body("pass", "Entre 8 y 15 caracteres incluyendo mayúsculas, minúsculas, números y símbolos ($, @, !, %, *, ?, &, -)")
                .exists()
                .customSanitizer(value => strip_tags(value))
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*?&-])[A-Za-z\d$@!%*?&-]{8,15}$/)
        ];
    }

    public async createUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let errors = validationResult(request);
            if(!errors.isEmpty()) {
                let errorsObject = errors.mapped();
                response.json({
                    success: false,
                    data: {
                        name: (errorsObject.name !== undefined ? errorsObject.name.msg : ""),
                        surname: (errorsObject.surname !== undefined ? errorsObject.surname.msg : ""),
                        email: (errorsObject.email !== undefined ? errorsObject.email.msg : ""),
                        pass: (errorsObject.pass !== undefined ? errorsObject.pass.msg : "")
                    }
                })
                return;
            }

            let name: string = request.body.name;
            let surname: string = request.body.surname;
            let email: string = request.body.email;
            let pass: string = request.body.pass;

            this.model = new UserModel();

            let emailExists: boolean = await this.model.emailExists(email);
            if (emailExists) {
                this.model.delete();
                response.json({
                    success: false,
                    data: {
                        email: "El email introducido ya existe. Escoge otro."
                    }
                });
                return;
            }

            let encryptedPass: string = await makeHash(pass);
            let newUserId: number = await this.model.createUser(name, surname, email, encryptedPass);
            let success: boolean = (newUserId != 0);
            this.model.delete();
            response.json({
                success: success,
                data: {
                    global: success ? "" : "El usuario no ha podido crearse"
                }
            });
        } catch (error) {
            return next(error);
        }
    }

    public validateEmail(request: Request, response: Response): void {

    }

    public loginFilters(): ValidationChain[] {
        return [
            body("email", "Debes introducir un email")
                .exists()
                .notEmpty()
                .isEmail()
                .normalizeEmail({
                    all_lowercase: true,
                    gmail_remove_dots: true}),
            body("pass", "Debes introducir una contraseña")
                .exists()
                .customSanitizer(value => strip_tags(value))
                .notEmpty()
        ];
    }

    public async login(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let errors = validationResult(request);
            if(!errors.isEmpty()) {
                response.json({
                    success: false,
                    data: errors.array().map(error => error.msg)
                });
                return;
            }

            let email: string = request.body.email;
            let pass: string = request.body.pass;

            this.model = new UserModel();
            let user: User = await this.model.getUserByEmail(email);
            this.model.delete();

            if (user == null) {
                response.json({
                    success: false,
                    data: new Array<string>(UserController.MSG_NO_USER)
                });
                return;
            }
            let passMatches: boolean = await verifyHash(pass, user.pass);
            if (!passMatches) {
                response.json({
                    success: false,
                    data: new Array<string>(UserController.MSG_INV_PASS)
                });
            } else {
                request.session["user"] = user;
                response.json({
                    success: true,
                    data: user.id
                });
            }
        } catch(error) {
            return next(error);
        }
    }

    public logout(request: Request, response: Response, next: NextFunction): void {
        try {
            request.session.destroy(null);
            response.json({success: true});
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;
