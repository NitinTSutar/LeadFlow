import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { create, createAdmin, detail, list, update } from "../controllers/brokerage.controller.js";
import advisorRoutes from "./advisor.routes.js";
import taskTriggerRoutes from "./task-trigger.routes.js";

const router = Router();
router.use(requireAuth, requireRole("platformAdmin"));
router.post("/", create);
router.get("/", list);
router.get("/:id", detail);
router.patch("/:id", update);
router.post("/:id/admins", createAdmin);
router.use("/:id/advisors", advisorRoutes);
router.use("/:id/task-triggers", taskTriggerRoutes);

export default router;
