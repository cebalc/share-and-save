type HTTPMethod = "GET" | "POST";

abstract class Fetcher {
    private url: string;
    private requestInit: RequestInit;
    private jsonResponse: any;

    protected constructor(url: string, method: HTTPMethod, requestBody: string = "") {
        this.url = url;
        this.requestInit = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: "include"
        };
        if(method === "POST") {
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
            this.jsonResponse = await fetchResponse.json();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public success(): boolean {
        return this.jsonResponse && this.jsonResponse.success;
    }

    public getResponseData(): any {
        return this.jsonResponse.data;
    }
}

export default Fetcher;