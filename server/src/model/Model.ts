import mysql, { MysqlError } from "mysql";

const ENV: Object = require("../modules/config").getEnvVars();

class Model {
    private static CONFIG: mysql.ConnectionConfig = {
        host: ENV["MYSQL_SERVER"],
        database: ENV["MYSQL_DB_NAME"],
        user: ENV["MYSQL_DB_USER"],
        password: ENV["MYSQL_DB_PASS"]
    };

    /**
     * Callback function, allows :field replacement syntax in SQL prepared queries
     * IMPORTANT! Function has to be bound to a mysql.Connection object using bind()
     * @param query SQL query containing :field occurences
     * @param values Object containing values to be placed in the query
     * @returns Prepared query after replacing each :field by a matching field value in values
     */
    private static customQueryFormat(query: string, values: Object): string {
        if(!values) {
            return query;
        };
        const REPLACE_PATTERN: RegExp = new RegExp(/\:(\w+)/g);
        let replacer: string = function(text: string, key: any){
            if(!values.hasOwnProperty(key)) {
                return text;
            }
            return this.escape(values[key]); //this = mysql.Connection object
        }.bind(this);
        let replacedQuery: string = query.replace(REPLACE_PATTERN, replacer);
        return replacedQuery;
    }

    private connection: mysql.Connection;
    
    public constructor() {
        this.connection = mysql.createConnection(Model.CONFIG);
        this.connection.config.queryFormat = Model.customQueryFormat.bind(this.connection);
    }

    protected preparedQuery(sqlQuery: string, values?: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            this.connection.query(sqlQuery, values, (error: MysqlError, results: any) => {
                if(error) {
                    reject(error);
                }
                resolve(results);
            });
        });
    }

    public delete(): void {
        this.connection.end();
    }
}

export default Model;
