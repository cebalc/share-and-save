import JSONResponse from "../../JSONResponse";

interface IUpgradeSubscriptionResponse {
    cardName: string,
    cardNumber: string,
    month: string,
    year: string,
    cvv: string,
    global: string
}

class UpgradeSubscriptionResponse extends JSONResponse<IUpgradeSubscriptionResponse> {

    public static readonly FAILURE: UpgradeSubscriptionResponse = new UpgradeSubscriptionResponse(false,
        "", "", "", "", "", "La actualización no ha sido posible. Inténtalo de nuevo");
    public static readonly SUCCESS: UpgradeSubscriptionResponse = new UpgradeSubscriptionResponse(true);

    public constructor(success: boolean, cardName: string = "", cardNumber: string = "", month: string = "",
                       year: string = "", cvv: string = "", global: string = "") {
        super(success, <IUpgradeSubscriptionResponse>{cardName, cardNumber, month, year, cvv, global});
    }
}

export default UpgradeSubscriptionResponse;
