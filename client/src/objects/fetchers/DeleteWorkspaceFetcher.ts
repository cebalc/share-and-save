import Fetcher from "./Fetcher";
import HTTPMethod from "../enums/HTTPMethod";

class DeleteWorkspaceFetcher extends Fetcher<string> {

    private static buildURL(workspaceId: number): string {
        return `/workspaces/${workspaceId}`;
    }

    public constructor(workspaceId: number) {
        super(
            DeleteWorkspaceFetcher.buildURL(workspaceId),
            HTTPMethod.DELETE
        );
    }
}

export default DeleteWorkspaceFetcher;
