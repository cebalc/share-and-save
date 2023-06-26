import {RowDataPacket} from "mysql2";

interface SummaryRow extends RowDataPacket {
    type_id: number,
    category_id: number,
    category_name: string,
    user_id: number,
    user_name: string,
    sum_amount: number
}

export default SummaryRow;
