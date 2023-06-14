import Fetcher from "../Fetcher";
import HTTPMethod from "../../enums/HTTPMethod";

class SignInFetcher extends Fetcher<string[]> {
    private static readonly URL: string = "/users/login";

    public constructor(email: string, pass: string) {
        super(SignInFetcher.URL, HTTPMethod.POST, JSON.stringify({
            email: email,
            pass: pass
        }));
    }
}

export default SignInFetcher;