import { Router } from "express";
import ServerController from "../controllers/ServerController";

export function createDefaultRoutes(router: Router, controller: ServerController<any>): void {
    router.get("*", controller.redirectToClientRouter);
    router.post("*", controller.redirectToClientRouter);
}
