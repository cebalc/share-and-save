import ServerController from "./ServerController";
import Model from "../models/Model";
import {Response} from "express";

abstract class WorkspaceDependentController<T extends Model> extends ServerController<T> {

    protected getWorkspaceId(response: Response): number {
        return parseInt(response.locals["workspaceId"]);
    }

}

export default WorkspaceDependentController;
