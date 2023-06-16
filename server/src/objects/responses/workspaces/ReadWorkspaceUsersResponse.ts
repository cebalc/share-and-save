import JSONResponse from "../JSONResponse";
import {FrontEndUser} from "../../entities/User";

class ReadWorkspaceUsersResponse extends JSONResponse<FrontEndUser[]> {

    public static readonly ERRORS: ReadWorkspaceUsersResponse = new ReadWorkspaceUsersResponse(false);

    public constructor(success: boolean, workspaceUsers: FrontEndUser[] = []) {
        super(success, workspaceUsers);
    }
}

export default ReadWorkspaceUsersResponse;
