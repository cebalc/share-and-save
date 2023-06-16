import JSONResponse from "../JSONResponse";

class SignInResponse extends JSONResponse<string[]> {

    public static readonly LOGIN_INCORRECT: SignInResponse = new SignInResponse(
        false, ["Usuario o contraseña incorrectos"]);
    public static readonly LOGIN_OK: SignInResponse = new SignInResponse(true);
    
    public constructor(success: boolean, data: string[] = []) {
        super(success, data);
    }
}

export default SignInResponse;
