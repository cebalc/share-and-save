import { Express } from "express";
import root from "../routes/root";
import api from "../routes/api";
import users from "../routes/users";

class ServerRouter {
    public constructor(app: Express) {
        app.use("/", root);
        app.use("/api", api);
        app.use("/users", users);
    }
}

export default ServerRouter;