import { NextFunction, Request, Response } from "express";
import Model from "../models/Model";
import path from "path";
import User from "../objects/entities/User";

class ServerController<T extends Model> {

    protected model: T;

    public redirectToClientRouter(request: Request, response: Response): void {
        response.sendFile(path.resolve(__dirname, "../../../client/build", "index.html"))
    }

    public requireAuth(request: Request, response: Response, next: NextFunction): void {
        if(request.session["user"] === undefined) {
            response.sendStatus(401);
            return;
        }
        next();
    }

    public getSessionUser(request: Request): User {
        return <User>request.session["user"];
    }

    public setSessionUser(request: Request, user: User): void {
        request.session["user"] = user;
    }
}

export default ServerController;
