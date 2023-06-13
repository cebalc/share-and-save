import JSONResponse from "../JSONResponse";
import Workspace from "../../entities/Workspace";

class ReadWorkspaceResponse extends JSONResponse<Workspace[]> {}

export default ReadWorkspaceResponse;
