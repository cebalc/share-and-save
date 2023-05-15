import Fetcher from "./Fetcher";

class SignOutFetcher extends Fetcher<string> {
    private static URL: string = "/users/signout";

    public constructor() {
        super(SignOutFetcher.URL, "GET");
    }
}

export default SignOutFetcher;
