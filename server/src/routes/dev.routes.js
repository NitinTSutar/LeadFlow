import { Router } from "express";
import { createPlatformAdminController } from "../controllers/dev.controller.js";

const router = Router();

router.post("/create-platform-admin", createPlatformAdminController);

export default router;
