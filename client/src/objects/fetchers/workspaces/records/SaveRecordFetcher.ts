import Fetcher from "../../Fetcher";
import HTTPMethod from "../../../enums/HTTPMethod";

interface SaveRecordResponse {
    date: string,
    description: string,
    amount: string,
    reference: string,
    global: string,
    id: number
}

class SaveRecordFetcher extends Fetcher<SaveRecordResponse> {

    private static buildURL(workspaceId: number): string {
        return `/workspaces/${workspaceId}/records`;
    }

    public constructor(workspaceId: number, type: number, date: string, description: string, amount: number,
                       user: number, shared: boolean, category: number, place: number, reference: string) {
        super(
            SaveRecordFetcher.buildURL(workspaceId),
            HTTPMethod.POST,
            JSON.stringify({
                type: type,
                date: date,
                description: description,
                amount: amount,
                user: user,
                shared: shared,
                category: category,
                place: place,
                reference: reference
            })
        );
    }
}

export default SaveRecordFetcher;
export type { SaveRecordResponse };
