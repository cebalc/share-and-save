import Fetcher from "./Fetcher";

class SignOutFetcher extends Fetcher {
    private static URL: string = "/users/signout";

    public constructor() {
        super(SignOutFetcher.URL, "GET");
    }
}

export default SignOutFetcher;
