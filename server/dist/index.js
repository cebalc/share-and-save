"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
//const express = require("express");
//const path = require("path");
const PORT = parseInt(process.env.PORT) || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../../client/build")));
app.get("/api", (req, res) => {
    res.json({ message: "Backend Node.js funcionando" });
});
app.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../../client/build", "index.html"));
});
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
//# sourceMappingURL=index.js.map