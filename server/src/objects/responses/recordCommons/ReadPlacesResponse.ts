import JSONResponse from "../JSONResponse";
import Place from "../../entities/Place";

class ReadPlacesResponse extends JSONResponse<Place[]> {

    public static NONE: ReadPlacesResponse = new ReadPlacesResponse(false, []);

    public constructor(success: boolean, places: Place[] = []) {
        super(success, places);
    }
}

export default ReadPlacesResponse;
