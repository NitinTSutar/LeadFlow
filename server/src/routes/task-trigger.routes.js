import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { create, list, remove, update } from "../controllers/task-trigger.controller.js";

const router = Router();
router.use(requireAuth, requireRole("brokerageAdmin", "platformAdmin"));
router.post("/", create);
router.get("/", list);
router.patch("/:triggerId", update);
router.delete("/:triggerId", remove);
export default router;
