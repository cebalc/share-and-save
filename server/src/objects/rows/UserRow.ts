import { RowDataPacket } from "mysql2";
import UserLevel from "../enums/UserLevel";

interface UserRow extends RowDataPacket {
    id: number;
    name: string;
    surname: string;
    email: string;
    pass: string;
    level: UserLevel;
}

export default UserRow;
