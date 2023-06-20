import {RowDataPacket} from "mysql2";

interface PlaceRow extends RowDataPacket {
    id: number,
    name: string
}

export default PlaceRow;
