import Fetcher from "./Fetcher";
import HTTPMethod from "../enums/HTTPMethod";

class SignOutFetcher extends Fetcher<string> {
    private static URL: string = "/users/signout";

    public constructor() {
        super(SignOutFetcher.URL, HTTPMethod.GET);
    }
}

export default SignOutFetcher;
