import { Router } from "express";
import RecordController from "../controllers/RecordController";
import {createDefaultRoutes} from "../modules/routing";

const router: Router = Router();
const controller: RecordController = new RecordController();

// Base path: /workspaces/:workspace/records

router.post("/",
    controller.requireAuth,
    controller.saveRecordFilters(),
    async (request, response, next) => {
        await controller.saveRecord(request, response, next);
    }
);

router.get("/",
    controller.requireAuth,
    async (request, response, next) => {
        await controller.readRecords(request, response, next);
    }
);

router.get("/:id",
    controller.requireAuth,
    async (request, response, next) => {
        await controller.readRecords(request, response, next);
    }
);

router.delete("/:id",
    controller.requireAuth,
    async (request, response, next) => {
        await controller.deleteRecord(request, response, next);
    }
);

router.post("/filter",
    controller.requireAuth,
    controller.getSummaryFilters(),
    async (request, response, next) => {
        await controller.getRecordsFilteredList(request, response, next);
    }
);

router.post("/summarize",
    controller.requireAuth,
    controller.getSummaryFilters(),
    async (request, response, next) => {
        await controller.getSummary(request, response, next);
    }
);

createDefaultRoutes(router, controller);

export default router;
