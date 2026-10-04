import { Router } from "express";
import { receiveTallyWebhook } from "../controllers/tally.controller.js";

const router = Router();
router.post("/tally", receiveTallyWebhook);

export default router;
