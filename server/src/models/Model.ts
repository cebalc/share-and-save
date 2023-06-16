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
    protected async preparedQuery<T extends RowDataPacket>(sqlQuery: string, values?: Object): Promise<T[] | OkPacket | false> {
        try {
            if(this.connectionClosed) {
                throw new Error("La conexión a la base de datos ya está cerrada");
            }
            return new Promise<T[] | OkPacket>((resolve, reject) => {
                this.connection.query<T[] | OkPacket>(sqlQuery, values, (error, results) => {
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

    protected async insertSingleRecord(sqlQuery: string, values?: Object): Promise<OkPacket> {
        if(!sqlQuery.match(/^INSERT/i)) {
            throw new Error(`Instrucción SQL inválida, se esperaba "INSERT..."`);
        }
        let queryResult: any = await this.preparedQuery(sqlQuery, values);
        if(!<boolean>queryResult) {
            return null;
        }
        return <OkPacket>queryResult;
    }

    protected async getSingleInsertedRecordId(sqlQuery: string, values?: Object): Promise<number> {
        let insertResult: OkPacket = await this.insertSingleRecord(sqlQuery, values);
        return (insertResult != null ? insertResult.insertId : Model.ID_NULL);
    }

    protected async singleInsertedRecordSuccessful(sqlQuery: string, values?: Object): Promise<boolean> {
        let insertResult: OkPacket = await this.insertSingleRecord(sqlQuery, values);
        return (insertResult != null && insertResult.affectedRows == 1);
    }

    protected async getSingleRecord<T extends RowDataPacket>(sqlQuery: string, values?: Object): Promise<T> {
        let queryResult: T[] = await this.getMultipleRecords<T>(sqlQuery, values);
        if(queryResult == null || queryResult.length != 1) {
            return null;
        }
        return queryResult[0];
    }

    protected async getMultipleRecords<T extends RowDataPacket>(sqlQuery: string, values?: Object): Promise<T[]> {
        if(!sqlQuery.match(/^\s*SELECT/i)) {
            throw new Error(`Instrucción SQL inválida, se esperaba "SELECT..."`);
        }
        let queryResult: any = await this.preparedQuery(sqlQuery, values);
        if(!<boolean>queryResult) {
            return null;
        }
        return <T[]>queryResult;
    }

    protected async updateSingleRecord(sqlQuery: string, values?: Object): Promise<boolean> {
        return this.alterSingleRecord(await this.updateMultipleRecords(sqlQuery, values));
    }

    protected async updateMultipleRecords(sqlQuery: string, values?: Object): Promise<OkPacket> {
        if(!sqlQuery.match(/^\s*UPDATE/i)) {
            throw new Error(`Instrucción SQL inválida, se esperaba "UPDATE..."`);
        }
        return await this.alterMultipleRecords(sqlQuery, values);
    }

    protected async deleteSingleRecord(sqlQuery: string, values?: Object): Promise<boolean> {
        return this.alterSingleRecord(await this.deleteMultipleRecords(sqlQuery, values));
    }

    protected async deleteMultipleRecords(sqlQuery: string, values?: Object): Promise<OkPacket> {
        if(!sqlQuery.match(/^\s*DELETE/i)) {
            throw new Error(`Instrucción SQL inválida, se esperaba "DELETE..."`);
        }
        return await this.alterMultipleRecords(sqlQuery, values);
    }

    private alterSingleRecord(alterResult: OkPacket): boolean {
        return (alterResult != null && alterResult.affectedRows == 1);
    }

    private async alterMultipleRecords(sqlQuery: string, values?: Object): Promise<OkPacket> {
        let result: any = await this.preparedQuery(sqlQuery, values);
        if(!<boolean>result) {
            return null;
        }
        return <OkPacket>result;
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
