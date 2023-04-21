import { Request, Response } from "express";
import Model from "../models/Model";
import path from "path";

class ServerController<T extends Model> {
    protected request: Request;
    protected response: Response;
    protected model: T;

    public constructor(request: Request, response: Response) {
        this.request = request;
        this.response = response;
    }

    public redirectToClientRouter(): void {
        this.response.sendFile(path.resolve(__dirname, "../../../client/build", "index.html"))
    }
}

export default ServerController;