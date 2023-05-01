import Fetcher from "./Fetcher";

class SignUpFetcher extends Fetcher {
    private static URL = "/users/create";
    public constructor(name: string, surname: string, email: string, pass: string) {
        super(SignUpFetcher.URL, "POST", JSON.stringify({
            name: name,
            surname: surname,
            email: email,
            pass: pass
        }));
    }
}

export default SignUpFetcher;
