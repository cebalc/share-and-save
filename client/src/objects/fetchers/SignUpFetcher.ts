import Fetcher from "./Fetcher";
import HTTPMethod from "../enums/HTTPMethod";

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
        super(SignUpFetcher.URL, HTTPMethod.POST, JSON.stringify({
            name: name,
            surname: surname,
            email: email,
            pass: pass
        }));
    }
}

export default SignUpFetcher;
export type { SignUpResponse };
