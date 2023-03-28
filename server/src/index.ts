import express, { Express, Request, Response } from "express";
import path from "path";

const ENV: Object = require("./modules/config").getEnvVars();
const app: Express = express();

app.use(express.static(path.resolve(__dirname, "../../client/build")));

app.get("/api", (req: Request, res: Response) => {
    res.json({message: "Backend Node.js funcionando"})
});

app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../../client/build", "index.html"))
});

app.listen(ENV["PORT"], () => {
    console.log(`Servidor escuchando en puerto ${ENV["PORT"]}`);
});