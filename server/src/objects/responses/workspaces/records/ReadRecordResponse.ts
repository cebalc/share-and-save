import JSONResponse from "../../JSONResponse";
import Record from "../../../entities/Record";

class ReadRecordResponse extends JSONResponse<Record[]> {

    public static readonly ERRORS: ReadRecordResponse = new ReadRecordResponse(false, []);

    public constructor(success: boolean, records: Record[] = []) {
        super(success, records);
    }
}

export default ReadRecordResponse;
