import JSONResponse from "./JSONResponse";

interface ICreateWorkspaceResponse {
    name: string,
    description: string,
    global: string,
    id: number
}

class CreateWorkspaceResponse extends JSONResponse<ICreateWorkspaceResponse> {
    public constructor(success: boolean, name: string = "", description: string = "", global: string = "", id: number = 0) {
        super(success, <ICreateWorkspaceResponse>{name, description, global, id});
    }
}

export default CreateWorkspaceResponse;
