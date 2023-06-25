import Fetcher from "../../Fetcher";
import Record from "../../../entities/Record";
import HTTPMethod from "../../../enums/HTTPMethod";

class ReadRecordsFetcher extends Fetcher<Record[]> {

    private static buildURL(workspaceId: number): string {
        return `/workspaces/${workspaceId}/records`;
    }

    public constructor(workspaceId: number) {
        super(ReadRecordsFetcher.buildURL(workspaceId), HTTPMethod.GET);
    }
}

export default ReadRecordsFetcher;
