import JSONResponse from "./JSONResponse";

class SignInResponse extends JSONResponse<string[]> {
    
    public constructor(success: boolean, data: string[] = []) {
        super(success, data);
    }
}

export default SignInResponse;
