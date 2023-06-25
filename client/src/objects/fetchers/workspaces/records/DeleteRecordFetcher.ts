import Fetcher from "../../Fetcher";
import HTTPMethod from "../../../enums/HTTPMethod";

class DeleteRecordFetcher extends Fetcher<string> {

    private static buildURL(recordId: number, workspaceId: number): string {
        return `/workspaces/${workspaceId}/records/${recordId}`;
    }

    public constructor(recordId: number, workspaceId: number) {
        super(DeleteRecordFetcher.buildURL(recordId, workspaceId), HTTPMethod.DELETE);
    }
}

export default DeleteRecordFetcher;
