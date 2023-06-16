import Workspace from "../../entities/Workspace";
import AlterWorkspaceResponse from "./AlterWorkspaceResponse";

interface IPersistWorkspaceResponse {
    name: string,
    description: string,
    global: string,
    id: number
}

class PersistWorkspaceResponse extends AlterWorkspaceResponse<IPersistWorkspaceResponse> {

    public static readonly NAME_EXISTS: PersistWorkspaceResponse = new PersistWorkspaceResponse(
        false, "Ya tienes un espacio de trabajo con ese nombre. Usa otro.");
    public static readonly NOT_CREATED: PersistWorkspaceResponse = new PersistWorkspaceResponse(
        false, "", "", "El espacio de trabajo no ha podido crearse.");
    public static readonly NOT_UPDATED: PersistWorkspaceResponse = new PersistWorkspaceResponse(
        false, "", "", "El espacio de trabajo no existe o no ha podido actualizarse.")

    public static success(workspaceId: number): PersistWorkspaceResponse {
        return new PersistWorkspaceResponse(true, "", "", "", workspaceId);
    }

    public constructor(success: boolean, name: string = "", description: string = "", global: string = "", id: number = Workspace.NULL.id) {
        super(success, <IPersistWorkspaceResponse>{name, description, global, id});
    }
}

export default PersistWorkspaceResponse;
