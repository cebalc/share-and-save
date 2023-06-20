import { Router } from "express";
import RecordController from "../controllers/RecordController";

const router: Router = Router();
const controller: RecordController = new RecordController();

// Base path: /workspaces/:workspace/records

router.post("/",
    controller.requireAuth,
    controller.createRecordFilters(),
    async (request, response, next) => {
        await controller.createRecord(request, response, next);
    }
);

export default router;
