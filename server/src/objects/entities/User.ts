import UserLevel from "../enums/UserLevel";
import UserRow from "../rows/UserRow";

interface FrontEndUser {
    id: number,
    name: string,
    surname: string,
    email: string,
    level: UserLevel
}

class User {

    public static readonly GUEST: User = new User(0, "", "", "", "", UserLevel.ANONYMOUS);

    public static makeFrontEndUser(user: any): FrontEndUser {
        return <FrontEndUser>{
            id: (user.id === undefined ? 0 : user.id),
            name: (user.name === undefined ? "" : user.name),
            surname: (user.surname === undefined ? "" : user.surname),
            email: (user.email === undefined ? "" : user.email),
            level: (user.level === undefined ? UserLevel.ANONYMOUS : user.level)
        };
    }

    public static ofRow(row: UserRow): User {
        return new User(row.id, row.name, row.surname, row.email, row.pass, row.level);
    }

    public static idWrapper(id: number): User {
        return new User(id, "", "", "", "", UserLevel.ANONYMOUS);
    }

    public id: number;
    public name: string;
    public surname: string;
    public email: string;
    public pass: string;
    public level: UserLevel;

    public constructor(id: number, name: string, surname: string, email: string, pass: string, level: UserLevel) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.pass = pass;
        this.level = level;
    }

    public makeFrontEndUser(): FrontEndUser {
        return User.makeFrontEndUser(this);
    }
}

export default User;
export type { FrontEndUser };
