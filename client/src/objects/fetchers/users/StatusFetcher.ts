import Fetcher from "../Fetcher";
import User from "../../entities/User";
import HTTPMethod from "../../enums/HTTPMethod";

class StatusFetcher extends Fetcher<User> {

    private static URL: string = "/users/status"

    public constructor() {
        super(StatusFetcher.URL, HTTPMethod.GET);
    }
}

export default StatusFetcher;
