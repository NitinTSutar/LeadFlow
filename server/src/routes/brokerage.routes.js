import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { create, createAdmin, detail, list, update } from "../controllers/brokerage.controller.js";
import advisorRoutes from "./advisor.routes.js";
import taskTriggerRoutes from "./task-trigger.routes.js";
import emailTemplateRoutes from "./email-template.routes.js";

const router = Router();
router.use(requireAuth);
router.post("/", requireRole("platformAdmin"), create);
router.get("/", requireRole("platformAdmin"), list);
router.get("/:id", requireRole("platformAdmin"), detail);
router.patch("/:id", requireRole("platformAdmin"), update);
router.post("/:id/admins", requireRole("platformAdmin"), createAdmin);
router.use("/:id/advisors", advisorRoutes);
router.use("/:id/task-triggers", taskTriggerRoutes);
router.use("/:id/email-templates", emailTemplateRoutes);

export default router;
