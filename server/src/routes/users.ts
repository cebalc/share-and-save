import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();
const userController = new UserController();

router.post("/create", userController.createUserFilters(), async (request, response, next) =>
    await userController.createUser(request, response, next)
);

router.post("/validateEmail", userController.validateEmail);

router.post("/login", userController.loginFilters(), async (request, response, next) =>
    await userController.login(request, response, next)
);

router.get("*", userController.redirectToClientRouter);

router.post("*", userController.redirectToClientRouter);

export default router;