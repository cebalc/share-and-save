"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const Model_1 = require("./objects/Model");
const ENV = require("./modules/config").getEnvVars();
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../../client/build")));
app.get("/api", (req, res) => {
    res.json({ message: "Backend Node.js funcionando" });
});
app.get("/mysql", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let model = new Model_1.Model();
        let result = yield model.preparedQuery("SELECT * FROM prueba WHERE id <= :maxId", { maxId: 0 });
        model.delete();
        model = null;
        res.json(result);
    }
    catch (error) {
        res.send("Ha ocurrido un error: " + error);
    }
}));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../../client/build", "index.html"));
});
app.listen(ENV["PORT"], () => {
    console.log(`Servidor escuchando en puerto ${ENV["PORT"]}`);
});
//# sourceMappingURL=index.js.map