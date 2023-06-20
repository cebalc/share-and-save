import Fetcher from "../../Fetcher";
import HTTPMethod from "../../../enums/HTTPMethod";

interface AddPlaceResponse {
    name: string,
    global: string,
    id: number
}

class AddPlaceFetcher extends Fetcher<AddPlaceResponse> {

    private static URL: string = "/records/places";

    public constructor(name: string) {
        super(
            AddPlaceFetcher.URL,
            HTTPMethod.POST,
            JSON.stringify({name: name})
        );
    }
}

export default AddPlaceFetcher;
export type { AddPlaceResponse };
