import UserLevel from "../enums/UserLevel";


class User {
    private static readonly USER_LABELS: Map<UserLevel, string> = new Map([
        [UserLevel.ANONYMOUS, "Usuario no identificado"],
        [UserLevel.REGISTERED, "Usuario"],
        [UserLevel.PREMIUM, "Premium"],
        [UserLevel.ADMIN, "Administrador"]
    ]);

    public static getLabel(userLevel: UserLevel): string {
        return this.USER_LABELS.get(userLevel) as string;
    }

    public id: number;
    public name: string;
    public surname: string;
    public email: string;
    public level: UserLevel;

    public static readonly GUEST: User = new User(0, "", "", "", UserLevel.ANONYMOUS);

    public constructor(id: number, name: string, surname: string, email: string, level: UserLevel) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.level = level;
    }

    public buildFullName(): string {
        return `${this.name} ${this.surname}`;
    }
}

export default User;
