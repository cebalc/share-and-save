import Model from "./Model";
import User from "../objects/User";
import { RowDataPacket } from "mysql2";

class UserModel extends Model {
    public async emailExists(email: string): Promise<boolean> {
        let sqlQuery: string = "SELECT Count(id) AS emailcount FROM users WHERE email = :email";
        let results: any = await super.preparedQuery(sqlQuery, {"email": email});
        return !(results as boolean) || (results as RowDataPacket[])[0].emailcount === 1;
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
        let sqlQuery: string = "SELECT * FROM users WHERE email LIKE :email";
        let results: any = await super.preparedQuery(sqlQuery, {"email": email});
        if(!(results as boolean) || (results as RowDataPacket[]).length != 1) {
            return null;
        }
        let row = (results as RowDataPacket[])[0];
        return new User(row.id, row.name, row.surname, row.email, row.pass, row.level);
    }
}

export default UserModel;