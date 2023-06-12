import Workspace from "../entities/Workspace";
import WorkspaceResponse from "./WorkspaceResponse";

interface IPersistWorkspaceResponse {
    name: string,
    description: string,
    global: string,
    id: number
}

class PersistWorkspaceResponse extends WorkspaceResponse<IPersistWorkspaceResponse> {
    public constructor(success: boolean, name: string = "", description: string = "", global: string = "", id: number = Workspace.NULL.id) {
        super(success, <IPersistWorkspaceResponse>{name, description, global, id});
    }
}

export default PersistWorkspaceResponse;
