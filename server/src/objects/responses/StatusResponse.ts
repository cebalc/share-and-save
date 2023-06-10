import JSONResponse from "./JSONResponse";
import { UserPublicInfo } from "../entities/User";

class StatusResponse extends JSONResponse<UserPublicInfo> {}

export default StatusResponse;
