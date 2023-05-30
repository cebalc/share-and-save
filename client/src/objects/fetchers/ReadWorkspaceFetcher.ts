import WorkspaceData from "../WorkspaceData";
import Fetcher from "./Fetcher";

class ReadWorkspaceFetcher extends Fetcher<WorkspaceData[]> {

    private static readonly URL_ALL: string = "/users/workspaces";
    private static readonly URL_ONE: string = "/workspace";
    private static readonly NO_ID: number = 0;

    public constructor(workspaceId: number = ReadWorkspaceFetcher.NO_ID) {
        super(
            workspaceId > ReadWorkspaceFetcher.NO_ID ?
                `${ReadWorkspaceFetcher.URL_ONE}?id=${workspaceId}`
                :
                ReadWorkspaceFetcher.URL_ALL,
            "GET");
    }
}

export default ReadWorkspaceFetcher;
