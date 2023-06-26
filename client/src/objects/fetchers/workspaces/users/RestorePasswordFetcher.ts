import Fetcher from "../../Fetcher";
import HTTPMethod from "../../../enums/HTTPMethod";

interface RestorePasswordResponse {
    email: string,
    global: string
}

class RestorePasswordFetcher extends Fetcher<RestorePasswordResponse> {

    private static readonly URL: string = "/users/password/restore"

    public constructor(email: string) {
        super(RestorePasswordFetcher.URL, HTTPMethod.POST, JSON.stringify({email: email}));
    }
}

export default RestorePasswordFetcher;
export type {RestorePasswordResponse};