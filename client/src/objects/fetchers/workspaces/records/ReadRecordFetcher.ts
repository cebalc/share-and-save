import Fetcher from "../../Fetcher";
import Record from "../../../entities/Record";
import HTTPMethod from "../../../enums/HTTPMethod";

class ReadRecordFetcher extends Fetcher<Record[]> {

    private static buildURL(workspaceId: number, recordId: number = Record.NEW.id): string {
        let url: string = `/workspaces/${workspaceId}/records`;
        if(recordId !== Record.NEW.id) {
            url += `/${recordId}`;
        }
        return url;
    }

    public constructor(workspaceId: number, recordId: number = Record.NEW.id) {
        super(ReadRecordFetcher.buildURL(workspaceId, recordId), HTTPMethod.GET);
    }
}

export default ReadRecordFetcher;
