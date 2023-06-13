import Workspace from "../../entities/Workspace";
import Fetcher from "../Fetcher";
import HTTPMethod from "../../enums/HTTPMethod";

class ReadWorkspaceFetcher extends Fetcher<Workspace[]> {

    private static readonly URL_BASE: string = "/workspaces";

    private static buildURL(workspaceId: number): string {
        let fetchURL: string = this.URL_BASE;
        if(workspaceId !== Workspace.NULL.id) {
            fetchURL += `/${workspaceId}`;
        }
        return fetchURL;
    }

    public constructor(workspaceId: number = Workspace.NULL.id) {
        super(ReadWorkspaceFetcher.buildURL(workspaceId), HTTPMethod.GET);
    }
}

export default ReadWorkspaceFetcher;
