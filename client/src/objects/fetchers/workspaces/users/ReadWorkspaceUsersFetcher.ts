import Fetcher from "../../Fetcher";
import User from "../../../entities/User";
import HTTPMethod from "../../../enums/HTTPMethod";

class ReadWorkspaceUsersFetcher extends Fetcher<User[]> {

    private static buildURL(workspaceId: number) {
        return `/workspaces/${workspaceId}/users`;
    }

    public constructor(workspaceId: number) {
        super(ReadWorkspaceUsersFetcher.buildURL(workspaceId), HTTPMethod.GET);
    }
}

export default ReadWorkspaceUsersFetcher;
