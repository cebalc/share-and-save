import JSONResponse from "../../JSONResponse";
import Record from "../../../entities/Record";

interface IFilterRecordsResponse {
    dateFrom: string,
    dateTo: string,
    global: string,
    records: Record[]
}

class FilterRecordsResponse extends JSONResponse<IFilterRecordsResponse> {

    public static readonly ERRORS: FilterRecordsResponse = new FilterRecordsResponse(
        false, "", "", "Ha ocurrido un error al solicitar los datos");
    public static readonly REVERSED_DATES: FilterRecordsResponse = new FilterRecordsResponse(
        false, "", "Este valor debe ser anterior al de arriba.");

    public static success(records: Record[]): FilterRecordsResponse {
        return new FilterRecordsResponse(
            true, "", "", "", records
        );
    }

    public constructor(success: boolean, dateFrom: string = "", dateTo: string = "",
                       global: string = "", records: Record[] = []) {
        super(success, <IFilterRecordsResponse>{dateFrom, dateTo, global, records});
    }
}

export default FilterRecordsResponse;
