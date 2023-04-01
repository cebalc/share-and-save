import { Express } from "express";
import api from "../routes/api";

class ServerRouter {
    public constructor(app: Express) {
        app.use("/api", api);
    }
}

export default ServerRouter;