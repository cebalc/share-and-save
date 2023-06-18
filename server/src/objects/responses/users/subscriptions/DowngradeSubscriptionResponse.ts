import JSONResponse from "../../JSONResponse";

class DowngradeSubscriptionResponse extends JSONResponse<string> {

    public static readonly FAILURE: DowngradeSubscriptionResponse = new DowngradeSubscriptionResponse(
        false, "Ha ocurrido un error actualizando la suscripción"
    );
    public static readonly SUCCESS: DowngradeSubscriptionResponse = new DowngradeSubscriptionResponse(true);

    public constructor(success: boolean, downgradeError: string = "") {
        super(success, downgradeError);
    }
}

export default DowngradeSubscriptionResponse;
