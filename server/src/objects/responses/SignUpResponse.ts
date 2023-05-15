import JSONResponse from "./JSONResponse";

interface ISignUpResponse {
    name: string,
    surname: string,
    email: string,
    pass: string,
    global: string
}

class SignUpResponse extends JSONResponse<ISignUpResponse> {
    
    public constructor(success: boolean, name: string = "", surname: string = "", email: string = "", pass: string = "", global: string = "") {
        super(success, <ISignUpResponse>{name, surname, email, pass, global});
    }
}

export default SignUpResponse;
