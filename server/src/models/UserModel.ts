import Model from "./Model";
import User from "../objects/entities/User";
import { RowDataPacket } from "mysql2";

class UserModel extends Model {
    public async emailExists(email: string): Promise<boolean> {
        return (await this.getUserByEmail(email) != null);
    }

    public async createUser(name: string, surname: string, email: string, pass: string): Promise<User> {
        let sqlQuery: string = "INSERT INTO users (name, surname, email, pass) VALUES (:name, :surname, :email, :pass)";
        let results: any = await super.preparedQuery(sqlQuery, {"name": name, "surname": surname, "email": email, "pass": pass});
        if(!(results as boolean)) {
            return null;
        }
        return await this.getUserByEmail(email);
    }

    public async getUserByEmail(email: string): Promise<User> {
        return await this.getSingleUser("email = :email", {"email": email});
    }

    public async getUserById(id: number): Promise<User> {
        return await this.getSingleUser("id = :id", {"id": id});
    }

    private async getSingleUser(sqlWhere: "id = :id" | "email = :email", value: {"id": number} | {"email": string}): Promise<User> {
        let sqlQuery: string = `SELECT * FROM users WHERE ${sqlWhere}`;
        let row: RowDataPacket = await super.getSingleRecord(sqlQuery, value);
        return (row != null ? new User(row.id, row.name, row.surname, row.email, row.pass, row.level) : null);
    }

    public async updateUserPersonalData(id: number, name: string, surname: string, email: string): Promise<User> {
        let sqlQuery: string = "UPDATE users SET name = :name, surname = :surname, email = :email WHERE id = :id";
        let updateResult: boolean = await super.updateSingleRecord(sqlQuery, {
            "name": name,
            "surname": surname,
            "email": email,
            "id": id
        });
        return (updateResult ? await this.getUserById(id) : null);
    }

    public async updateUserPassword(id: number, password: string): Promise<boolean> {
        let sqlQuery: string = "UPDATE users SET pass = :password WHERE id = :id";
        return await super.updateSingleRecord(sqlQuery, {
            "password": password,
            "id": id
        });
    }
}

export default UserModel;