import ServerController from "./ServerController";
import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import { makeHash, verifyHash } from "../modules/encryption";
import User from "../objects/User";

class UserController extends ServerController<UserModel> {
    private static MSG_NO_USER: string = "No existe ningún usuario asociado al email introducido."
    private static MSG_INV_PASS: string = "La contraseña introducida no es correcta.";

    public constructor(request: Request, response: Response) {
        super(request, response);
    }

    public async createUser(): Promise<void> {
        let name: string = this.request.body.name.value;
        let surname: string = this.request.body.surname.value;
        let email: string = this.request.body.email.value;
        let pass: string = this.request.body.pass.value;
        this.model = new UserModel();

        let emailExists: boolean = await this.model.emailExists(email);
        if(emailExists) {
            this.model.delete();
            this.response.json({response: "emailExists", data: {name, surname, email, pass}});
            return;
        }

        let encryptedPass: string = await makeHash(pass);
        let newUserId: number = await this.model.createUser(name, surname, email, encryptedPass);
        this.model.delete();
        this.response.json({response: (newUserId == 0 ? "userNotCreated" : "userCreated"), data: newUserId});
        return;
    }

    public validateEmail(): void {

    }

    public async login(): Promise<void> {
        let email: string = this.request.body.email;
        let pass: string = this.request.body.pass;

        this.model = new UserModel();
        let user: User = await this.model.getUserByEmail(email);
        this.model.delete();

        if(user == null) {
            this.response.json({
                success: false,
                data: UserController.MSG_NO_USER
            });
            return;
        }
        let passMatches: boolean = await verifyHash(pass, user.pass);
        if(!passMatches) {
            this.response.json({
                success: false,
                data: UserController.MSG_INV_PASS
            });
        } else {
            this.response.json({
                success: true,
                data: user.id
            });
        }
    }
}

export default UserController;