import Fetcher from "../../Fetcher";
import SummaryData from "../../../entities/SummaryData";
import HTTPMethod from "../../../enums/HTTPMethod";


class MakeSummaryFetcher extends Fetcher<SummaryData[]> {

    private static buildURL(workspaceId: number): string {
        return `/workspaces/${workspaceId}/records/summarize`;
    }

    public constructor(workspaceId: number, dateFrom: string, dateTo: string, summarizeByUser: boolean, user: number) {
        super(
            MakeSummaryFetcher.buildURL(workspaceId),
            HTTPMethod.POST,
            JSON.stringify({
                dateFrom: dateFrom,
                dateTo: dateTo,
                summarizeByUser: summarizeByUser,
                user: user
            }));
    }
}

export default MakeSummaryFetcher;
