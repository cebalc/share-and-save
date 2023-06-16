import JSONResponse from "../JSONResponse";

interface IPersistUserResponse {
    name: string,
    surname: string,
    email: string,
    oldPass: string,
    pass: string,
    global: string
}

class PersistUserResponse extends JSONResponse<IPersistUserResponse> {

    public static readonly EMAIL_EXISTS: PersistUserResponse = new PersistUserResponse(false, "", "",
        "El email introducido ya existe. Escoge otro");
    public static readonly OLD_PASSWORD_MISSING: PersistUserResponse = new PersistUserResponse(false, "", "",
        "","Debes introducir tu contraseña actual")
    public static readonly NEW_PASSWORD_MISSING: PersistUserResponse = new PersistUserResponse(false, "", "",
        "", "","Debes introducir una contraseña");
    public static readonly USER_NOT_CREATED: PersistUserResponse = new PersistUserResponse(false, "", "", "",
        "", "", "El usuario no ha podido crearse");
    public static readonly DATA_NOT_UPDATED: PersistUserResponse = new PersistUserResponse(false, "", "",
        "", "", "", "Ha ocurrido un error actualizando los datos");
    public static readonly PASSWORD_NOT_UPDATED: PersistUserResponse = new PersistUserResponse(false, "", "",
        "", "", "", "Ha ocurrido un error al actualizar tu contraseña y no ha cambiado");
    public static readonly SUCCESS: PersistUserResponse = new PersistUserResponse(true);
    
    public constructor(success: boolean, name: string = "", surname: string = "", email: string = "", oldPass: string = "",
                       pass: string = "", global: string = "") {
        super(success, <IPersistUserResponse>{name, surname, email, oldPass, pass, global});
    }
}

export default PersistUserResponse;
