import Fetcher from "../../Fetcher";
import HTTPMethod from "../../../enums/HTTPMethod";

class DowngradeSubscriptionFetcher extends Fetcher<string> {

    private static buildURL(userId: number): string {
        return `/users/${userId}/subscription/downgrade`;
    }

    public constructor(userId: number) {
        super(
            DowngradeSubscriptionFetcher.buildURL(userId),
            HTTPMethod.GET
        );
    }
}

export default DowngradeSubscriptionFetcher;
