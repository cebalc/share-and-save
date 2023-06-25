import {RowDataPacket} from "mysql2";

interface RecordRow extends RowDataPacket {
    id: number,
    type_id: number,
    date: string,
    description: string,
    amount: number,
    reference: string,
    shared: boolean,
    category_id: number,
    place_id: number,
    user_id: number,
    workspace_id: number
}

export default RecordRow;
