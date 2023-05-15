import JSONResponse from "./JSONResponse";
import { UserPublicInfo } from "../User";

class StatusResponse extends JSONResponse<UserPublicInfo> {}

export default StatusResponse;
