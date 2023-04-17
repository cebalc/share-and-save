import ServerController from "./ServerController";
import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import { makeHash } from "../modules/encryption";

class UserController extends ServerController<UserModel> {
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
}

export default UserController;