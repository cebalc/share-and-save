import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();
const userController = new UserController();

router.post("/create", (request, response) =>
    userController.createUser(request, response)
);

router.post("/validateEmail", userController.validateEmail);

router.post("/login", (request, response) =>
    userController.login(request, response)
);

router.get("*", userController.redirectToClientRouter);

router.post("*", userController.redirectToClientRouter);

export default router;