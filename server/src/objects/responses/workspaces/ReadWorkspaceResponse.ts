import JSONResponse from "../JSONResponse";
import Workspace from "../../entities/Workspace";

class ReadWorkspaceResponse extends JSONResponse<Workspace[]> {

    public static readonly NONE: ReadWorkspaceResponse = new ReadWorkspaceResponse(false, []);

}

export default ReadWorkspaceResponse;
