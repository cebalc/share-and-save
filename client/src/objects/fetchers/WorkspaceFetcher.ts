import Fetcher from "./Fetcher";

class WorkspaceFetcher extends Fetcher {

    private static readonly URL_ALL: string = "/users/workspaces";
    private static readonly URL_ONE: string = "/workspace";
    private static readonly NO_ID: number = 0;

    public constructor(workspaceId: number = WorkspaceFetcher.NO_ID) {
        super(
            workspaceId > WorkspaceFetcher.NO_ID ? 
                `${WorkspaceFetcher.URL_ONE}?id=${workspaceId}`
                :
                WorkspaceFetcher.URL_ALL,
            "GET");
    }
}

export default WorkspaceFetcher;