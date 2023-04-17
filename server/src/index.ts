import express, { Express, Request, Response } from "express";
import path from "path";
import ServerRouter from "./objects/ServerRouter";

const ENV: Object = require("./modules/config").getEnvVars();
const app: Express = express();
app.use(express.static(path.resolve(__dirname, "../../client/build")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const serverRouter: ServerRouter = new ServerRouter(app);

/* Default requests are sent to React front-end app */
app.get("*", (request: Request, response: Response) => {
    response.sendFile(path.resolve(__dirname, "../../client/build", "index.html"))
});

app.listen(ENV["PORT"], () => {
    console.log(`Servidor escuchando en puerto ${ENV["PORT"]}`);
});