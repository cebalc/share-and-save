import { Router } from "express";
import UserController from "../controllers/UserController";
import {createDefaultRoutes} from "../modules/routing";

const router: Router = Router();
const userController: UserController = new UserController();

// Base path: /users

router.get("/status", userController.checkStatus);

router.post("/",
    userController.persistUserFilters(),
    async (request, response, next) => {
        await userController.persistUser(request, response, next);
    }
);

router.post("/login",
    userController.loginFilters(),
    async (request, response, next) => {
        await userController.login(request, response, next);
    }
);

router.get("/signout", userController.logout);

router.post("/password/restore",
    userController.restorePasswordFilters(),
    async (request, response, next) => {
        await userController.restorePassword(request, response, next);
    }
);

createDefaultRoutes(router, userController);

export default router;