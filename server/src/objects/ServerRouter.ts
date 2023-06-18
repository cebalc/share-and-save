import { Express, Request, Response, NextFunction } from "express";
import api from "../routes/api";
import users from "../routes/users";
import workspaces from "../routes/workspaces";
import users_subscriptions from "../routes/users_subscriptions";

class ServerRouter {
    public constructor(app: Express) {
        app.use("/api", api);
        app.use("/users/:id/subscription",
            this.findUserId,
            users_subscriptions
        );
        app.use("/users", users);
        app.use("/workspaces", workspaces);
    }

    private findUserId(request: Request, response: Response, next: NextFunction): void {
        response.locals["userId"] = request.params.id;
        next();
    }
}

export default ServerRouter;