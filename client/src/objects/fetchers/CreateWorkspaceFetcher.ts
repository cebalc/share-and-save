import Fetcher from "./Fetcher";

interface CreateWorkspaceResponse {
    name: string,
    description: string,
    global: string,
    id: number
}

class CreateWorkspaceFetcher extends Fetcher<CreateWorkspaceResponse> {
    private static readonly URL: string = "/workspaces";

    public constructor(name: string, description: string) {
        super(CreateWorkspaceFetcher.URL, "POST", JSON.stringify({
            name: name,
            description: description
        }));
    }
}

export default CreateWorkspaceFetcher;
export type { CreateWorkspaceResponse };
