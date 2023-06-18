import UserLevel from "../objects/enums/UserLevel";
import UserModel from "./UserModel";

class SubscriptionModel extends UserModel {

    public async updateUserSubscription(userId: number, newLevel: UserLevel): Promise<boolean> {
        let sqlQuery: string = `UPDATE users SET level = :newLevel WHERE id = :userId`;
        return await super.updateSingleRecord(sqlQuery, {
            "newLevel": newLevel,
            "userId": userId
        });
    }
}

export default SubscriptionModel;
