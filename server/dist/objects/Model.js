"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const mysql_1 = __importDefault(require("mysql"));
const ENV = require("../modules/config").getEnvVars();
class Model {
    /**
     * Callback function, allows :field replacement syntax in SQL prepared queries
     * IMPORTANT! Function has to be bound to a mysql.Connection object using bind()
     * @param query SQL query containing :field occurences
     * @param values Object containing values to be placed in the query
     * @returns Prepared query after replacing each :field by a matching field value in values
     */
    static customQueryFormat(query, values) {
        if (!values) {
            return query;
        }
        ;
        const REPLACE_PATTERN = new RegExp(/\:(\w+)/g);
        let replacer = function (text, key) {
            if (!values.hasOwnProperty(key)) {
                return text;
            }
            return this.escape(values[key]); //this = mysql.Connection object
        }.bind(this);
        let replacedQuery = query.replace(REPLACE_PATTERN, replacer);
        return replacedQuery;
    }
    constructor() {
        this.connection = mysql_1.default.createConnection(Model.CONFIG);
        this.connection.config.queryFormat = Model.customQueryFormat.bind(this.connection);
    }
    preparedQuery(sqlQuery, values) {
        return new Promise((resolve, reject) => {
            this.connection.query(sqlQuery, values, (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
    }
    delete() {
        this.connection.end();
    }
}
exports.Model = Model;
Model.CONFIG = {
    host: ENV["MYSQL_SERVER"],
    database: ENV["MYSQL_DB_NAME"],
    user: ENV["MYSQL_DB_USER"],
    password: ENV["MYSQL_DB_PASS"]
};
//# sourceMappingURL=Model.js.map