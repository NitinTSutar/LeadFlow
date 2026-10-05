import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { create, available, detail, list, update } from "../controllers/advisor.controller.js";

const router = Router({ mergeParams: true });
router.use(requireAuth, requireRole("brokerageAdmin", "platformAdmin"));
router.post("/", create);
router.get("/available", available);
router.get("/", list);
router.get("/:advisorId", detail);
router.patch("/:advisorId", update);

export default router;
