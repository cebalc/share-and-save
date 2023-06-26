import Fetcher from "../../Fetcher";
import Record from "../../../entities/Record";
import HTTPMethod from "../../../enums/HTTPMethod";

class FilterRecordsFetcher extends Fetcher<Record[]> {

    private static buildURL(workspaceId: number): string {
        return `/workspaces/${workspaceId}/records/filter`;
    }

    public constructor(workspaceId: number, dateFrom: string, dateTo: string, summarizeByUser: boolean, user: number) {
        super(
            FilterRecordsFetcher.buildURL(workspaceId),
            HTTPMethod.POST,
            JSON.stringify({
                dateFrom: dateFrom,
                dateTo: dateTo,
                summarizeByUser: summarizeByUser,
                user: user
            }));
    }
}

export default FilterRecordsFetcher;
