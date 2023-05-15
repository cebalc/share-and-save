import JSONResponse from "./JSONResponse";

interface SignUpResponse {
    name: string,
    surname: string,
    email: string,
    pass: string,
    global: string
}

class SignUpResponse extends JSONResponse<SignUpResponse> {
    
    public constructor(success: boolean, name: string = "", surname: string = "", email: string = "", pass: string = "", global: string = "") {
        super(success, <SignUpResponse>{name, surname, email, pass, global});
    }
}

export default SignUpResponse;
