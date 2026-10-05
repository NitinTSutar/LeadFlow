import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { create, detail, list, remove, update } from "../controllers/email-template.controller.js";

const router = Router();
router.use(requireAuth, requireRole("brokerageAdmin", "platformAdmin"));
router.post("/", create);
router.get("/", list);
router.get("/:templateId", detail);
router.patch("/:templateId", update);
router.delete("/:templateId", remove);
export default router;
