import path from "path";
import SMTPConnection from "nodemailer/lib/smtp-connection";

function getEnvVars(): Object {
    let envVars: NodeRequire = require(path.resolve(__dirname, "../../..", "env-vars.json"));
    let nodeEnv: string = process.env.NODE_ENV || "development";
    return envVars[nodeEnv];
}

function getSMTPConfigOptions(): SMTPConnection.Options {
    let options: NodeRequire = require(path.resolve(__dirname, "../../..", "mail.json"));
    return <SMTPConnection.Options>options;
}

export {getEnvVars, getSMTPConfigOptions};
