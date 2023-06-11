import HTTPMethod from "../enums/HTTPMethod";

interface JSONResponse<T> {
    success: boolean,
    data: T
}

abstract class Fetcher<T> {
    private url: string;
    private requestInit: RequestInit;
    private jsonResponse: JSONResponse<T> | null;

    protected constructor(url: string, method: HTTPMethod, requestBody: string = "") {
        this.url = url;
        this.requestInit = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: "include" //required for express sessions
        };
        if(method === HTTPMethod.POST || method === HTTPMethod.PUT) {
            this.requestInit.body = requestBody;
        };
        this.jsonResponse = null;
    }

    public async retrieveData(): Promise<boolean> {
        try {
            let fetchResponse: Response = await fetch(this.url, this.requestInit);
            if(!fetchResponse.ok) {
                throw new Error(`Error HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`);
            }
            this.jsonResponse = await fetchResponse.json() as JSONResponse<T>;
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public success(): boolean {
        return this.jsonResponse != null && this.jsonResponse.success;
    }

    public getResponseData(): T {
        return (this.jsonResponse as JSONResponse<T>).data;
    }
}

export default Fetcher;
