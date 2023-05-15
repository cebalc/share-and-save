import Fetcher from "./Fetcher";

interface SignUpResponse {
    name: string,
    surname: string,
    email: string,
    pass: string,
    global: string
}

class SignUpFetcher extends Fetcher<SignUpResponse> {
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
export type { SignUpResponse };
