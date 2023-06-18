import Fetcher from "../../Fetcher";
import HTTPMethod from "../../../enums/HTTPMethod";

interface UpgradeSubscriptionResponse {
    cardName: string,
    cardNumber: string,
    month: string,
    year: string,
    cvv: string,
    global: string
}

class UpgradeSubscriptionFetcher extends Fetcher<UpgradeSubscriptionResponse> {

    private static buildURL(userId: number): string {
        return `/users/${userId}/subscription/upgrade`;
    }

    public constructor(userId: number, cardName: string, cardNumber: string, month: string, year: string, cvv: string) {
        super(
            UpgradeSubscriptionFetcher.buildURL(userId),
            HTTPMethod.POST,
            JSON.stringify({
                cardName: cardName,
                cardNumber: cardNumber,
                month: month,
                year: year,
                cvv: cvv
            })
        );
    }
}

export default UpgradeSubscriptionFetcher;
export type { UpgradeSubscriptionResponse };