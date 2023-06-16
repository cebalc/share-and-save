import AlterWorkspaceResponse from "./AlterWorkspaceResponse";

class UnlinkWorkspaceUserResponse extends AlterWorkspaceResponse<string> {

    public static readonly NOT_UNLINKED: UnlinkWorkspaceUserResponse = new UnlinkWorkspaceUserResponse(
        false, "El espacio o el usuario no existen o no se ha podido desvincular.");
    public static readonly SUCCESS: UnlinkWorkspaceUserResponse = new UnlinkWorkspaceUserResponse(true);

    public constructor(success: boolean, unlinkError: string = "") {
        super(success, unlinkError);
    }
}

export default UnlinkWorkspaceUserResponse;
