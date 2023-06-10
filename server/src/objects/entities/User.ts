type UserLevel = 0 | 1 | 2 | 3;

interface UserPublicInfo {
    id: number,
    name: string,
    surname: string,
    email: string,
    level: UserLevel
}

class User {
    public static ANONYMOUS: UserLevel = 0;
    public static REGISTERED: UserLevel = 1;
    public static PREMIUM: UserLevel = 2;
    public static ADMIN: UserLevel = 3;

    public static readonly GUEST: User = new User(0, "", "", "", "", this.ANONYMOUS);

    public static extractUserPublicInfo(user: any): UserPublicInfo {
        return <UserPublicInfo>{
            id: (user.id === undefined ? 0 : user.id),
            name: (user.name === undefined ? "" : user.name),
            surname: (user.surname === undefined ? "" : user.surname),
            email: (user.email === undefined ? "" : undefined),
            level: (user.level === undefined ? this.ANONYMOUS : user.level)
        };
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

    public getPublicInfo(): UserPublicInfo {
        return User.extractUserPublicInfo(this);
    }
}

export default User;
export type { UserPublicInfo };
