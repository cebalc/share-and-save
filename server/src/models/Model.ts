import mysql, {MysqlError} from "mysql";

const ENV: Object = require("../modules/config").getEnvVars();

abstract class Model {
    private static CONFIG: mysql.ConnectionConfig = {
        host: ENV["MYSQL_SERVER"],
        database: ENV["MYSQL_DB_NAME"],
        user: ENV["MYSQL_DB_USER"],
        password: ENV["MYSQL_DB_PASS"]
    };

    /**
     * Callback function, allows :field replacement syntax in SQL prepared queries
     * IMPORTANT! Function has to be bound to a mysql.Connection object using bind()
     * @param query SQL query containing :field occurrences
     * @param values Object containing values to be placed in the query
     * @returns Prepared query after replacing each :field by a matching field value in values
     */
    private static customQueryFormat(query: string, values: Object): string {
        if(!values) {
            return query;
        }
        const REPLACE_PATTERN: RegExp = new RegExp(/:(\w+)/g);
        let replacer: string = function(text: string, key: any){
            if(!values.hasOwnProperty(key)) {
                return text;
            }
            return this.escape(values[key]); //this = mysql.Connection object
        }.bind(this);
        return query.replace(REPLACE_PATTERN, replacer);
    }

    private readonly connection: mysql.Connection;
    private connectionClosed: boolean;
    
    public constructor() {
        this.connection = mysql.createConnection(Model.CONFIG);
        this.connection.config.queryFormat = Model.customQueryFormat.bind(this.connection);
        this.connectionClosed = false;
    }

    /**
     * Executes a prepared query using sqlQuery as parameterized template
     * @param sqlQuery SQL sentence which may include ':param'-like parameters
     * @param values Object that maps template params with values (e.g. use {"foo": bar} to replace :foo with bar value)
     * @returns Promise that resolves into SQL query results or false if an error occurred
     */
    protected async preparedQuery(sqlQuery: string, values?: Object): Promise<any | false> {
        try {
            return new Promise((resolve, reject) => {
                this.connection.query(sqlQuery, values, (error: MysqlError, results: any) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                });
            });
        } catch (error) {
            console.log("Error en preparedQuery");
            this.logError(error);
            return false;
        }
    }

    protected logError(error: MysqlError): void {
        console.log(`Error en la base de datos: ${error}`);
    }

    public delete(): void {
        if(!this.connectionClosed) {
            this.connection.end();
            this.connectionClosed = true;
        }
    }
}

export default Model;
