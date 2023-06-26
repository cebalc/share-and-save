import JSONResponse from "../JSONResponse";

interface IRestorePasswordResponse {
    email: string,
    global: string
}

class RestorePasswordResponse extends JSONResponse<IRestorePasswordResponse> {

    public static readonly SUCCESS: RestorePasswordResponse = new RestorePasswordResponse(true);

    public constructor(success: boolean, email: string = "", global: string = "") {
        super(success, <IRestorePasswordResponse>{email, global});
    }
}

export default RestorePasswordResponse;
