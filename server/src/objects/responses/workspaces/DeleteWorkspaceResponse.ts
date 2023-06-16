import AlterWorkspaceResponse from "./AlterWorkspaceResponse";

class DeleteWorkspaceResponse extends AlterWorkspaceResponse<string> {

    public static readonly NOT_DELETED: DeleteWorkspaceResponse = new DeleteWorkspaceResponse(
        false, "El espacio de trabajo no existe o no ha podido borrarse.");
    public static readonly SUCCESS: DeleteWorkspaceResponse = new DeleteWorkspaceResponse(true);

    public constructor(success: boolean, deleteError: string = "") {
        super(success, deleteError);
    }
}

export default DeleteWorkspaceResponse;
