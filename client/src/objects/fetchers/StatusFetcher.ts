import Fetcher from "./Fetcher";
import User from "../entities/User";

class StatusFetcher extends Fetcher<User> {

    private static URL: string = "/users/status"

    public constructor() {
        super(StatusFetcher.URL, "GET");
    }
}

export default StatusFetcher;
