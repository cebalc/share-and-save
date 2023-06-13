import JSONResponse from "../JSONResponse";
import {UserPublicInfo} from "../../entities/User";

class ReadWorkspaceUsersResponse extends JSONResponse<UserPublicInfo[]> {}

export default ReadWorkspaceUsersResponse;
