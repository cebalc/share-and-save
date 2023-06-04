import Workspace from "../entities/Workspace";
import Fetcher from "./Fetcher";

class ReadWorkspaceFetcher extends Fetcher<Workspace[]> {

    private static readonly NO_ID: number = 0;
    private static readonly URL_BASE: string = "/workspaces";

    private static buildURL(workspaceId: number): string {
        let fetchURL: string = this.URL_BASE;
        if(workspaceId > ReadWorkspaceFetcher.NO_ID) {
            fetchURL += `/${workspaceId}`;
        }
        return fetchURL;
    }

    public constructor(workspaceId: number = ReadWorkspaceFetcher.NO_ID) {
        super(ReadWorkspaceFetcher.buildURL(workspaceId), "GET");
    }
}

export default ReadWorkspaceFetcher;
