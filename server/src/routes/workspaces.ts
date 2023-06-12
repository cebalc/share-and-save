import { Router } from "express";
import WorkspaceController from "../controllers/WorkspaceController";
import {createDefaultRoutes} from "../modules/routing";

const router: Router = Router();
const workspaceController: WorkspaceController = new WorkspaceController();

router.get("/",
    workspaceController.requireAuth,
    async (request, response, next) => {
        await workspaceController.getWorkspaces(request, response, next)
    }
);

router.get("/:id(\\d+)",
    workspaceController.requireAuth,
    async (request, response, next) => {
        await workspaceController.getWorkspaceDetails(request, response, next)
    }
);

router.post("/",
    workspaceController.requireAuth,
    workspaceController.persistWorkspaceFilters(),
    async (request, response, next) => {
        await workspaceController.persistWorkspace(request, response, next)
    }
);

createDefaultRoutes(router, workspaceController);

export default router;
