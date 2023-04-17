import Model from "./Model";

class UserModel extends Model {
    public async emailExists(email: string): Promise<boolean> {
        let sqlQuery: string = "SELECT Count(id) AS emailcount FROM users WHERE email = :email";
        let results: any = await super.preparedQuery(sqlQuery, {"email": email});
        return !results || results[0].emailcount === 1;
    }

    public async createUser(name: string, surname: string, email: string, pass: string): Promise<number> {
        let sqlQuery: string = "INSERT INTO users (name, surname, email, pass) VALUES (:name, :surname, :email, :pass)";
        let results: any = await super.preparedQuery(sqlQuery, {"name": name, "surname": surname, "email": email, "pass": pass});
        if(!results) {
            return 0;
        } else {
            return results.insertId;
        }
    }
}

export default UserModel;