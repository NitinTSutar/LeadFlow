import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { complete, detail, list, update } from "../controllers/task.controller.js";

const router = Router();
router.use(requireAuth, requireRole("advisor", "brokerageAdmin", "platformAdmin"));
router.get("/", list);
router.get("/:id", detail);
router.patch("/:id/complete", complete);
router.patch("/:id", update);
export default router;
