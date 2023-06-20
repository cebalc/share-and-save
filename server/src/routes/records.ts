import { Router } from "express";
import {createDefaultRoutes} from "../modules/routing";
import RecordDependenciesController from "../controllers/RecordDependenciesController";

const router: Router = Router();
const controller: RecordDependenciesController = new RecordDependenciesController();

// Base path: /records

router.post("/places",
    controller.requireAuth,
    controller.addPlaceFilters(),
    async (request, response, next) => {
        await controller.addPlace(request, response, next);
    }
);

createDefaultRoutes(router, controller);

export default router;
