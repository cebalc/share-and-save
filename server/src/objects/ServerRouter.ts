import { Express } from "express";
import api from "../routes/api";
import users from "../routes/users";
import workspaces from "../routes/workspaces";

class ServerRouter {
    public constructor(app: Express) {
        app.use("/api", api);
        app.use("/users", users);
        app.use("/workspaces", workspaces);
    }
}

export default ServerRouter;