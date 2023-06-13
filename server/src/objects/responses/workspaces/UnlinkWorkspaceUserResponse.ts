import AlterWorkspaceResponse from "./AlterWorkspaceResponse";

class UnlinkWorkspaceUserResponse extends AlterWorkspaceResponse<string> {
    public constructor(success: boolean, unlinkError: string = "") {
        super(success, unlinkError);
    }
}

export default UnlinkWorkspaceUserResponse;
