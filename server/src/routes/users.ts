import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();

router.post("/create", (request, response) =>
    new UserController(request, response).createUser()
);

router.post("/validateEmail", (request, response) =>
    new UserController(request, response).validateEmail()
);

export default router;