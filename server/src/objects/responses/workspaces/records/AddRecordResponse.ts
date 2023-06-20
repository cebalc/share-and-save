import JSONResponse from "../../JSONResponse";
import Record from "../../../entities/Record";

interface IAddRecordResponse {
    date: string,
    description: string,
    amount: string,
    reference: string,
    global: string,
    id: number
}

class AddRecordResponse extends JSONResponse<IAddRecordResponse> {

    public static readonly USER_NOT_ALLOWED: AddRecordResponse = new AddRecordResponse(false, "",
        "", "", "","Error: No formas parte de este espacio.");
    public static readonly NOT_ADDED: AddRecordResponse = new AddRecordResponse(false, "", "",
        "", "", "El movimiento no ha podido crearse.");

    public static success(newRecordId: number): AddRecordResponse {
        return new AddRecordResponse(true, "", "", "", "", "", newRecordId);
    }

    public constructor(success: boolean, date: string = "", description: string = "", amount: string = "",
                       reference: string = "", global: string = "", id: number = Record.NEW.id) {
        super(success, <IAddRecordResponse>{date, description, amount, reference, global, id});
    }
}

export default AddRecordResponse;
