import Fetcher from "../Fetcher";
import HTTPMethod from "../../enums/HTTPMethod";
import Place from "../../entities/Place";

class ReadPlacesFetcher extends Fetcher<Place[]> {

    private static readonly URL: string = "/records/places";

    public constructor() {
        super(ReadPlacesFetcher.URL, HTTPMethod.GET);
    }
}

export default ReadPlacesFetcher;
