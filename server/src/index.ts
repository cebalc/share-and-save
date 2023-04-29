import express, { Express } from "express";
import path from "path";
import ServerRouter from "./objects/ServerRouter";
import ServerController from "./controllers/ServerController";

const ENV: Object = require("./modules/config").getEnvVars();
const app: Express = express();
app.use(express.static(path.resolve(__dirname, "../../client/build")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

new ServerRouter(app);
const serverController = new ServerController();

/* Default requests are sent to React front-end app */
app.get("*", serverController.redirectToClientRouter);

app.post("*", serverController.redirectToClientRouter);

app.listen(ENV["PORT"], () => {
    console.log(`Servidor escuchando en puerto ${ENV["PORT"]}`);
});