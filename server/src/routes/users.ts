import { Router } from "express";
import UserController from "../controllers/UserController";
import {createDefaultRoutes} from "../modules/routing";

const router = Router();
const userController: UserController = new UserController();

router.get("/status", userController.checkStatus);

router.get("/signout", userController.logout);

router.post("/create", userController.createUserFilters(), async (request, response, next) =>
    await userController.createUser(request, response, next)
);

router.post("/validateEmail", userController.validateEmail);

router.post("/login", userController.loginFilters(), async (request, response, next) =>
    await userController.login(request, response, next)
);

createDefaultRoutes(router, userController);

// router.get("*", userController.redirectToClientRouter);
//
// router.post("*", userController.redirectToClientRouter);

export default router;