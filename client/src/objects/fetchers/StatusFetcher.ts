import Fetcher from "./Fetcher";

class StatusFetcher extends Fetcher {

    private static URL: string = "/users/status"

    public constructor() {
        super(StatusFetcher.URL, "GET");
    }
}

export default StatusFetcher;
