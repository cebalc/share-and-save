import Fetcher from "../Fetcher";
import HTTPMethod from "../../enums/HTTPMethod";

interface PersistUserResponse {
    name: string,
    surname: string,
    email: string,
    oldPass: string
    pass: string,
    global: string
}

class PersistUserFetcher extends Fetcher<PersistUserResponse> {

    private static readonly URL: string = "/users";

    public constructor(userId: number, name: string, surname: string, email: string, pass: string, oldPass: string) {
        super(PersistUserFetcher.URL, HTTPMethod.POST, JSON.stringify({
            id: userId,
            name: name,
            surname: surname,
            email: email,
            pass: pass,
            oldPass: oldPass
        }));
    }
}

export default PersistUserFetcher;
export type { PersistUserResponse };
