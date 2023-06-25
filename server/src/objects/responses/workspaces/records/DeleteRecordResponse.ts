import JSONResponse from "../../JSONResponse";

class DeleteRecordResponse extends JSONResponse<string> {

    public static readonly NOT_ALLOWED: DeleteRecordResponse = new DeleteRecordResponse(
        false, "Error: no puedes borrar movimientos de un espacio al que no perteneces.");
    public static readonly NOT_DELETED: DeleteRecordResponse = new DeleteRecordResponse(
        false, "Ha ocurrido un error al intentar borrar el movimiento.");
    public static readonly SUCCESS: DeleteRecordResponse = new DeleteRecordResponse(true);

    public constructor(success: boolean, deleteError: string = "") {
        super(success, deleteError);
    }
}

export default DeleteRecordResponse;
