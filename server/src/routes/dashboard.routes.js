import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { pipeline } from "../controllers/dashboard.controller.js";

const router = Router();
router.get("/pipeline", requireAuth, requireRole("platformAdmin", "brokerageAdmin", "advisor"), pipeline);

export default router;
