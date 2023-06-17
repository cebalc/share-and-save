import { Express, Request, Response, NextFunction } from "express";
import api from "../../routes/api";
import users from "../../routes/users";
import workspaces from "../../routes/workspaces";
import workspaces_users from "../../routes/workspaces_users";

class ServerRouter {
    public constructor(app: Express) {
        app.use("/api", api);
        app.use("/users", users);
        app.use("/workspaces/:workspace(\\d+)/users",
            this.findWorkspaceId,
            workspaces_users);
        app.use("/workspaces", workspaces);
    }

    private findWorkspaceId(request: Request, response: Response, next: NextFunction): void {
        request["workspaceId"] = request.params.workspace;
        next();
    }
}

export default ServerRouter;
