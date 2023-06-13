import Workspace from "../../entities/Workspace";
import AlterWorkspaceResponse from "./AlterWorkspaceResponse";

interface IPersistWorkspaceResponse {
    name: string,
    description: string,
    global: string,
    id: number
}

class PersistWorkspaceResponse extends AlterWorkspaceResponse<IPersistWorkspaceResponse> {
    public constructor(success: boolean, name: string = "", description: string = "", global: string = "", id: number = Workspace.NULL.id) {
        super(success, <IPersistWorkspaceResponse>{name, description, global, id});
    }
}

export default PersistWorkspaceResponse;
