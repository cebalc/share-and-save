import path from "path";

function getEnvVars(): Object {
    let envVars: NodeRequire = require(path.resolve(__dirname, "../../..", "env-vars.json"));
    let nodeEnv: string = process.env.NODE_ENV || "development";
    return envVars[nodeEnv];
}

export {getEnvVars};