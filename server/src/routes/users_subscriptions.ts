import { Router } from "express";
import {createDefaultRoutes} from "../modules/routing";
import SubscriptionController from "../controllers/SubscriptionController";

const router: Router = Router();
const controller: SubscriptionController = new SubscriptionController();

router.post("/upgrade",
    controller.requireAuth,
    controller.upgradeSubscriptionFilters(),
    async (request, response, next) => {
        await controller.upgradeSubscription(request, response, next);
    }
);

createDefaultRoutes(router, controller);

export default router;
