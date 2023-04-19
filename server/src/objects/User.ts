class User {
    public static ANONYMOUS: number = 0;
    public static REGISTERED: number = 1;
    public static PREMIUM: number = 2;
    public static ADMIN: number = 3;

    public id: number;
    public name: string;
    public surname: string;
    public email: string;
    public pass: string;
    public level: 0 | 1 | 2 | 3;

    public constructor(id: number, name: string, surname: string, email: string, pass: string, level: 0 | 1 | 2 | 3) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.pass = pass;
        this.level = level;
    }
}

export default User;