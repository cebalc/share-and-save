import JSONResponse from "./JSONResponse";

class SignOutResponse extends JSONResponse<string> {

    public constructor(success: boolean, previousUserName: string = "") {
        super(success, previousUserName);
    }
}

export default SignOutResponse;
