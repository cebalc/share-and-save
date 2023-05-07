import express, { Express } from "express";
import path from "path";
import ServerRouter from "./objects/ServerRouter";
import ServerController from "./controllers/ServerController";
import session from "express-session";
import cookieParser from "cookie-parser";

const ENV: Object = require("./modules/config").getEnvVars();
const app: Express = express();

/* Static folder */
app.use(express.static(path.resolve(__dirname, "../../client/build")));

/* Process POST requests */
app.use(express.urlencoded({extended: true}));
app.use(express.json());

/* Support sessions */
app.use(cookieParser());
app.use(session({
    secret: ENV["SESSION_SECRET"],
    saveUninitialized: true,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: false
    }
}));

new ServerRouter(app);
const serverController = new ServerController();

/* Default requests are sent to React front-end app */
app.get("*", serverController.redirectToClientRouter);

app.post("*", serverController.redirectToClientRouter);

app.listen(ENV["PORT"], () => {
    console.log(`Servidor escuchando en puerto ${ENV["PORT"]}`);
});