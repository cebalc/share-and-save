import JSONResponse from "../JSONResponse";
import { FrontEndUser } from "../../entities/User";

class StatusResponse extends JSONResponse<FrontEndUser> {}

export default StatusResponse;
