import { Express, Request, Response, NextFunction } from "express";
import api from "../../routes/api";
import users from "../../routes/users";
import users_subscriptions from "../../routes/users_subscriptions";
import workspaces from "../../routes/workspaces";
import workspaces_users from "../../routes/workspaces_users";
import records from "../../routes/records";
import workspaces_records from "../../routes/workspaces_records";

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
            workspaces_users
        );
        app.use("/workspaces/:workspace(\\d+)/records",
            this.findWorkspaceId,
            workspaces_records
        )
        app.use("/workspaces", workspaces);
        app.use("/records", records);
    }

    private findUserId(request: Request, response: Response, next: NextFunction): void {
        response.locals["userId"] = request.params.id;
        next();
    }

    private findWorkspaceId(request: Request, response: Response, next: NextFunction): void {
        response.locals["workspaceId"] = request.params.workspace;
        next();
    }
}

export default ServerRouter;
