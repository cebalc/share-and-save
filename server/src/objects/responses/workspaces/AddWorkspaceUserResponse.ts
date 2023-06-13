import AlterWorkspaceResponse from "./AlterWorkspaceResponse";

interface IAlterWorkspaceResponse {
    email: string,
    global: string
}

class AddWorkspaceUserResponse extends AlterWorkspaceResponse<IAlterWorkspaceResponse> {
    public constructor(success: boolean, email: string = "", global: string = "") {
        super(success, <IAlterWorkspaceResponse>{email, global});
    }
}

export default AddWorkspaceUserResponse;
