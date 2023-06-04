import { Router } from "express";
import WorkspaceController from "../controllers/WorkspaceController";

const router: Router = Router();
const workspaceController: WorkspaceController = new WorkspaceController();

router.get("/:id(\\d+)", async (request, response, next) => {
    await workspaceController.getWorkspaceDetails(request, response, next);
});

router.post("/", async (request, response, next) =>
    await workspaceController.createWorkspace(request, response, next)
);

export default router;
