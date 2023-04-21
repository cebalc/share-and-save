import { Router } from "express";
import ServerController from "../controllers/ServerController";

const router = Router();

router.get("*", (request, response) =>
    new ServerController(request, response).redirectToClientRouter()
);

router.post("*", (request, response) =>
    new ServerController(request, response).redirectToClientRouter()
);

export default router;