import {Router} from "express";
const router = Router();

router.get("/", (request, response) => {
    response.json({message: "Backend Node.js funcionando"});
});

export default router;