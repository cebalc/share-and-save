import { Request, Response, NextFunction } from "express";
import ServerController from "./ServerController";
import {Result, ValidationChain, ValidationError, validationResult} from "express-validator";
import FilterFactory from "../objects/filters/FilterFactory";
import UpgradeSubscriptionResponse from "../objects/responses/users/subscriptions/UpgradeSubscriptionResponse";
import UserLevel from "../objects/enums/UserLevel";
import SubscriptionModel from "../models/SubscriptionModel";

class SubscriptionController extends ServerController<SubscriptionModel> {

    private getUserId(response: Response): number {
        return response.locals["userId"];
    }

    public upgradeSubscriptionFilters(): ValidationChain[] {
        return [
            FilterFactory.cardName(),
            FilterFactory.cardNumber(),
            FilterFactory.cardMonth(),
            FilterFactory.cardYear(),
            FilterFactory.cardCVV()
        ];
    }

    public async upgradeSubscription(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let errors: Result<ValidationError> = validationResult(request);
            if(!errors.isEmpty()) {
                let errorsObject: Record<string, ValidationError> = errors.mapped();
                response.json(new UpgradeSubscriptionResponse(false,
                    errorsObject.cardName !== undefined ? errorsObject.cardName.msg : "",
                    errorsObject.cardNumber !== undefined ? errorsObject.cardNumber.msg : "",
                    errorsObject.month !== undefined ? errorsObject.month.msg : "",
                    errorsObject.year !== undefined ? errorsObject.year.msg : "",
                    errorsObject.cvv !== undefined ? errorsObject.cvv.msg : ""
                ));
                return;
            }

            let userId: number = this.getUserId(response);
            this.model = new SubscriptionModel();
            let upgraded: boolean = await this.model.updateUserSubscription(userId, UserLevel.PREMIUM);
            if(!upgraded) {
                this.model.delete();
                response.json(UpgradeSubscriptionResponse.FAILURE);
                return;
            }

            this.setSessionUser(request, await this.model.getUserById(userId));
            this.model.delete();

            response.json(UpgradeSubscriptionResponse.SUCCESS);
        } catch (error) {
            next(error);
        }
    }
}

export default SubscriptionController;
