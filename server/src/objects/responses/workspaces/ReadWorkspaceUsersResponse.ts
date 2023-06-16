import JSONResponse from "../JSONResponse";
import {FrontEndUser} from "../../entities/User";

class ReadWorkspaceUsersResponse extends JSONResponse<FrontEndUser[]> {}

export default ReadWorkspaceUsersResponse;
