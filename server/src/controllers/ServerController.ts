import { NextFunction, Request, Response } from "express";
import Model from "../models/Model";
import path from "path";

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
}

export default ServerController;
