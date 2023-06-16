import mysql, { OkPacket, RowDataPacket } from "mysql2";

const ENV: Object = require("../modules/config").getEnvVars();

abstract class Model {
    private static readonly CONFIG: mysql.ConnectionOptions = {
        host: ENV["MYSQL_SERVER"],
        database: ENV["MYSQL_DB_NAME"],
        user: ENV["MYSQL_DB_USER"],
        password: ENV["MYSQL_DB_PASS"]
    };

    protected static readonly ID_NULL: number = 0;

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
    protected async preparedQuery(sqlQuery: string, values?: Object): Promise<RowDataPacket[] | OkPacket | false> {
        if(this.connectionClosed) {
            throw new Error("La conexión a la base de datos ya está cerrada");
        }
        try {
            return new Promise<RowDataPacket[] | OkPacket>((resolve, reject) => {
                this.connection.query<RowDataPacket[] | OkPacket>(sqlQuery, values, (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                });
            });
        } catch (error) {
            this.logError(error);
            return false;
        }
    }

    protected async insertSingleRecord(sqlQuery: string, values?: Object): Promise<number> {
        if(!sqlQuery.match(/^INSERT/i)) {
            throw new Error(`Instrucción SQL inválida, se esperaba "INSERT..."`);
        }
        let queryResult: any = await this.preparedQuery(sqlQuery, values);
        if(!<boolean>queryResult) {
            return Model.ID_NULL;
        }
        return (<OkPacket>queryResult).insertId;
    }

    protected async getSingleRecord(sqlQuery: string, values?: Object): Promise<RowDataPacket> {
        if(!sqlQuery.match(/^SELECT/i)) {
            throw new Error(`Instrucción SQL inválida, se esperaba "SELECT..."`);
        }
        let queryResult: any = await this.preparedQuery(sqlQuery, values);
        if(!<boolean>queryResult || (<RowDataPacket[]>queryResult).length != 1) {
            return null;
        }
        return (<RowDataPacket[]>queryResult)[0];
    }

    protected async updateSingleRecord(sqlQuery: string, values?: Object): Promise<boolean> {
        if(!sqlQuery.match(/^UPDATE/i)) {
            throw new Error(`Instrucción SQL inválida, se esperaba "UPDATE..."`);
        }
        let queryResult: any = await this.preparedQuery(sqlQuery, values);
        return !(!<boolean>queryResult || (<OkPacket>queryResult).affectedRows != 1);
    }

    protected logError(error: mysql.QueryError): void {
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
