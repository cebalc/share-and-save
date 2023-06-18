import { Express, Request, Response, NextFunction } from "express";
import api from "../../routes/api";
import users from "../../routes/users";
import workspaces from "../../routes/workspaces";
import workspaces_users from "../../routes/workspaces_users";
import users_subscriptions from "../../routes/users_subscriptions";

class ServerRouter {
    public constructor(app: Express) {
        app.use("/api", api);
        app.use("/users/:id/subscription",
            this.findUserId,
            users_subscriptions
        );
        app.use("/users", users);
        app.use("/workspaces/:workspace(\\d+)/users",
            this.findWorkspaceId,
            workspaces_users);
        app.use("/workspaces", workspaces);
    }

    private findUserId(request: Request, response: Response, next: NextFunction): void {
        response.locals["userId"] = request.params.id;
        next();
    }

    private findWorkspaceId(request: Request, response: Response, next: NextFunction): void {
        request["workspaceId"] = request.params.workspace;
        next();
    }
}

export default ServerRouter;
