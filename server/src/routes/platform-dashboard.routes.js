import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { summary } from "../controllers/platform-dashboard.controller.js";

const router = Router();
router.get("/dashboard", requireAuth, requireRole("platformAdmin"), summary);

export default router;
