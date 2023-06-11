import Fetcher from "./Fetcher";
import HTTPMethod from "../enums/HTTPMethod";

interface PersistWorkspaceResponse {
    name: string,
    description: string,
    global: string,
    id: number
}

class PersistWorkspaceFetcher extends Fetcher<PersistWorkspaceResponse> {

    private static readonly URL: string = "/workspaces";

    public constructor(id: number, name: string, description: string) {
        super(
            PersistWorkspaceFetcher.URL,
            HTTPMethod.POST,
            JSON.stringify({
                id: id,
                name: name,
                description: description
            })
        );
    }
}

export default PersistWorkspaceFetcher;
export type { PersistWorkspaceResponse };
