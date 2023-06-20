import {RowDataPacket} from "mysql2";

interface UniqueStringEntityRow extends RowDataPacket {
    id: number,
    name: string
}

export default UniqueStringEntityRow;
