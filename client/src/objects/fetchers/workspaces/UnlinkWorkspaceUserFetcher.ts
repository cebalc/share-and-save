import Fetcher from "../Fetcher";
import HTTPMethod from "../../enums/HTTPMethod";

class UnlinkWorkspaceUserFetcher extends Fetcher<string> {

    private static buildURL(unlinkUserId: number, workspaceId: number): string {
        return `/workspaces/${workspaceId}/users/${unlinkUserId}`;
    }

    public constructor(unlinkUserId: number, workspaceId: number) {
        super(
            UnlinkWorkspaceUserFetcher.buildURL(unlinkUserId, workspaceId),
            HTTPMethod.DELETE
        );
    }
}

export default UnlinkWorkspaceUserFetcher;
