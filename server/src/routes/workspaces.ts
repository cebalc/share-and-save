import { Router } from "express";
import WorkspaceController from "../controllers/WorkspaceController";

const router: Router = Router();
const workspaceController: WorkspaceController = new WorkspaceController();

router.get("/", workspaceController.requireAuth, async (request, response, next) =>
    await workspaceController.getWorkspaces(request, response, next)
);

router.get("/:id(\\d+)", workspaceController.requireAuth, async (request, response, next) =>
    await workspaceController.getWorkspaceDetails(request, response, next)
);

router.post("/", workspaceController.requireAuth, async (request, response, next) =>
    await workspaceController.createWorkspace(request, response, next)
);

export default router;
