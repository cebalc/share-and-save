import Fetcher from "./Fetcher";

class SignInFetcher extends Fetcher {
    private static URL: string = "/users/login";

    public constructor(email: string, pass: string) {
        super(SignInFetcher.URL, "POST", JSON.stringify({
            email: email,
            pass: pass
        }));
    }
}

export default SignInFetcher;