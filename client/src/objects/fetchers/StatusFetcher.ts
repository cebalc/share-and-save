import Fetcher from "./Fetcher";
import { AppState } from "../../App";

class StatusFetcher extends Fetcher<AppState> {

    private static URL: string = "/users/status"

    public constructor() {
        super(StatusFetcher.URL, "GET");
    }
}

export default StatusFetcher;
