import JSONResponse from "../../JSONResponse";
import { SummaryData } from "../../../entities/SummaryData";


interface IMakeSummaryResponse {
    dateFrom: string,
    dateTo: string,
    global: string,
    summaryData: SummaryData[]
}

class MakeSummaryResponse extends JSONResponse<IMakeSummaryResponse> {

    public static readonly ERRORS: MakeSummaryResponse = new MakeSummaryResponse(
        false, "", "", "Ha ocurrido un error en la petición al servidor");
    public static readonly REVERSED_DATES: MakeSummaryResponse = new MakeSummaryResponse(
        false, "", "Este valor debe ser anterior al de arriba.");

    public static success(summaryData: SummaryData[]): MakeSummaryResponse {
        return new MakeSummaryResponse(
            true, "", "", "", summaryData
        );
    }

    public constructor(success: boolean, dateFrom: string = "", dateTo: string = "", global: string = "", summaryData: SummaryData[] = []) {
        super(success, <IMakeSummaryResponse>{dateFrom, dateTo, global, summaryData});
    }
}

export default MakeSummaryResponse;
