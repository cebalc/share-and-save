import WorkspaceResponse from "./WorkspaceResponse";

class DeleteWorkspaceResponse extends WorkspaceResponse<string> {
    public constructor(success: boolean, deleteError: string = "") {
        super(success, deleteError);
    }
}

export default DeleteWorkspaceResponse;
