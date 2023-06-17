import {Router} from "express";
import {createDefaultRoutes} from "../modules/routing";
import WorkspaceUsersController from "../controllers/WorkspaceUsersController";

const router: Router = Router();
const controller: WorkspaceUsersController = new WorkspaceUsersController();

// Base mapping: /workspaces/:workspace/users

router.get("/",
    controller.requireAuth,
    async (request, response, next) => {
        await controller.getWorkspaceUsers(request, response, next);
    }
);

router.post("/",
    controller.requireAuth,
    controller.addWorkspaceUserFilters(),
    async (request, response, next) => {
        await controller.addWorkspaceUser(request, response, next);
    }
);

router.delete("/:user(\\d+)",
    controller.requireAuth,
    async(request, response, next) => {
        await controller.unlinkWorkspaceUser(request, response, next);
    }
);

createDefaultRoutes(router, controller);

export default router;
