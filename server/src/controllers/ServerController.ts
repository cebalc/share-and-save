import { Request, Response } from "express";
import Model from "../models/Model";

abstract class ServerController<T extends Model> {
    protected request: Request;
    protected response: Response;
    protected model: T;

    protected constructor(request: Request, response: Response) {
        this.request = request;
        this.response = response;
    }
}

export default ServerController;