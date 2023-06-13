import AlterWorkspaceResponse from "./AlterWorkspaceResponse";

class DeleteWorkspaceResponse extends AlterWorkspaceResponse<string> {
    public constructor(success: boolean, deleteError: string = "") {
        super(success, deleteError);
    }
}

export default DeleteWorkspaceResponse;
