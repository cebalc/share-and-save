"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVars = void 0;
const path_1 = __importDefault(require("path"));
function getEnvVars() {
    let envVars = require(path_1.default.resolve(__dirname, "../../..", "env-vars.json"));
    let nodeEnv = process.env.NODE_ENV || "development";
    return envVars[nodeEnv];
}
exports.getEnvVars = getEnvVars;
//# sourceMappingURL=config.js.map