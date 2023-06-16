import AlterWorkspaceResponse from "./AlterWorkspaceResponse";

interface IAlterWorkspaceResponse {
    email: string,
    global: string
}

class AddWorkspaceUserResponse extends AlterWorkspaceResponse<IAlterWorkspaceResponse> {

    public static readonly USER_NOT_FOUND: AddWorkspaceUserResponse = new AddWorkspaceUserResponse(
        false, "", "No hay usuarios con ese email");
    public static readonly USER_LINKED: AddWorkspaceUserResponse = new AddWorkspaceUserResponse(
        false, "", "El usuario ya está vinculado");
    public static readonly USER_NOT_ADDED: AddWorkspaceUserResponse = new AddWorkspaceUserResponse(
        false, "", "No se ha podido añadir el usuario");
    public static readonly SUCCESS: AddWorkspaceUserResponse = new AddWorkspaceUserResponse(true);

    public constructor(success: boolean, email: string = "", global: string = "") {
        super(success, <IAlterWorkspaceResponse>{email, global});
    }
}

export default AddWorkspaceUserResponse;
