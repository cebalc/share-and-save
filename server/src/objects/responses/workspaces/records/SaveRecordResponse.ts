import JSONResponse from "../../JSONResponse";
import Record from "../../../entities/Record";

interface ISaveRecordResponse {
    date: string,
    description: string,
    amount: string,
    reference: string,
    global: string,
    id: number
}

class SaveRecordResponse extends JSONResponse<ISaveRecordResponse> {

    public static readonly USER_NOT_ALLOWED: SaveRecordResponse = new SaveRecordResponse(false, "",
        "", "", "","Error: No formas parte de este espacio.");
    public static readonly NOT_ADDED: SaveRecordResponse = new SaveRecordResponse(false, "", "",
        "", "", "El movimiento no ha podido crearse.");
    public static readonly NOT_EDITED: SaveRecordResponse = new SaveRecordResponse(false, "", "",
        "", "", "El movimiento no ha podido actualizarse");

    public static success(savedRecordId: number): SaveRecordResponse {
        return new SaveRecordResponse(true, "", "", "", "", "", savedRecordId);
    }

    public constructor(success: boolean, date: string = "", description: string = "", amount: string = "",
                       reference: string = "", global: string = "", id: number = Record.NEW.id) {
        super(success, <ISaveRecordResponse>{date, description, amount, reference, global, id});
    }
}

export default SaveRecordResponse;
