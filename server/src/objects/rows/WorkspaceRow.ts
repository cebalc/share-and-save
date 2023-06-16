import { RowDataPacket } from "mysql2";

interface WorkspaceRow extends RowDataPacket {
    id: number;
    name: string;
    description: string;
    admin: boolean;
}

export default WorkspaceRow;
