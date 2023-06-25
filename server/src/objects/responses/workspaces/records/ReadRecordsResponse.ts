import JSONResponse from "../../JSONResponse";
import Record from "../../../entities/Record";

class ReadRecordsResponse extends JSONResponse<Record[]> {

    public static readonly NONE: ReadRecordsResponse = new ReadRecordsResponse(false, []);

    public constructor(success: boolean, records: Record[] = []) {
        super(success, records);
    }
}

export default ReadRecordsResponse;
