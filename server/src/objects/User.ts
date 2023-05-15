type UserLevel = 0 | 1 | 2 | 3;

interface UserPublicInfo {
    userId: number,
    userName: string,
    userLevel: UserLevel
}

class User {
    public static ANONYMOUS: UserLevel = 0;
    public static REGISTERED: UserLevel = 1;
    public static PREMIUM: UserLevel = 2;
    public static ADMIN: UserLevel = 3;

    public static getDefaultUserPublicInfo(): UserPublicInfo {
        return <UserPublicInfo>{
            userId: 0,
            userName: "",
            userLevel: this.ANONYMOUS
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
        return <UserPublicInfo>{
            userId: this.id,
            userName: this.name,
            userLevel: this.level
        };
    }
}

export default User;
export type { UserPublicInfo };
