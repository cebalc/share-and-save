import Fetcher from "../Fetcher";
import HTTPMethod from "../../enums/HTTPMethod";

interface AddWorkspaceUserResponse {
    email: string,
    global: string
}

class AddWorkspaceUserFetcher extends Fetcher<AddWorkspaceUserResponse> {

    private static buildURL(workspaceId: number): string {
        return `/workspaces/${workspaceId}/users`;
    }

    public constructor(workspaceId: number, userEmail: string) {
        super(
            AddWorkspaceUserFetcher.buildURL(workspaceId),
            HTTPMethod.POST,
            JSON.stringify({
                email: userEmail
            })
        );
    }
}

export default AddWorkspaceUserFetcher;
export type { AddWorkspaceUserResponse };
