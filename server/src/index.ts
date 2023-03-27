import express, { Express, Request, Response } from "express";
import path from "path";

//const express = require("express");
//const path = require("path");
const PORT: number = parseInt(process.env.PORT) || 3001;
const app: Express = express();

app.use(express.static(path.resolve(__dirname, "../../client/build")));

app.get("/api", (req: Request, res: Response) => {
    res.json({message: "Backend Node.js funcionando"})
});

app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../../client/build", "index.html"))
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});