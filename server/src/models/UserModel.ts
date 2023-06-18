import Model from "./Model";
import User from "../objects/entities/User";
import UserRow from "../objects/rows/UserRow";

class UserModel extends Model {
    public async emailExists(email: string): Promise<boolean> {
        return (await this.getUserByEmail(email) != null);
    }

    public async createUser(name: string, surname: string, email: string, pass: string): Promise<User> {
        let sqlQuery: string = "INSERT INTO users (name, surname, email, pass) VALUES (:name, :surname, :email, :pass)";
        let insertId: number = await super.getSingleInsertedRecordId(sqlQuery, {
            "name": name,
            "surname": surname,
            "email": email,
            "pass": pass
        });
        if(insertId == UserModel.ID_NULL) {
            return null;
        }
        return await this.getUserById(insertId);
    }

    public async getUserByEmail(email: string): Promise<User> {
        return await this.getSingleUser("email = :email", {"email": email});
    }

    public async getUserById(id: number): Promise<User> {
        return await this.getSingleUser("id = :id", {"id": id});
    }

    private async getSingleUser(sqlWhere: "id = :id" | "email = :email", value: {"id": number} | {"email": string}): Promise<User> {
        let sqlQuery: string = `SELECT * FROM users WHERE ${sqlWhere}`;
        let row: UserRow = await super.getSingleRecord<UserRow>(sqlQuery, value);
        return (row != null ? User.ofRow(row) : null);
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