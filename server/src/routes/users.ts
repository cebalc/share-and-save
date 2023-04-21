import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();

router.post("/create", (request, response) =>
    new UserController(request, response).createUser()
);

router.post("/validateEmail", (request, response) =>
    new UserController(request, response).validateEmail()
);

router.post("/login", (request, response) =>
    new UserController(request, response).login()
);

router.get("*", (request, response) =>
    new UserController(request, response).redirectToClientRouter()
);

router.post("*", (request, response) =>
    new UserController(request, response).redirectToClientRouter()
);

export default router;