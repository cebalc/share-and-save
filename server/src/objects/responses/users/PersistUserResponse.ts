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
    
    public constructor(success: boolean, name: string = "", surname: string = "", email: string = "", oldPass: string = "",
                       pass: string = "", global: string = "") {
        super(success, <IPersistUserResponse>{name, surname, email, oldPass, pass, global});
    }
}

export default PersistUserResponse;
