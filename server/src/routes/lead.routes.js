import { Router } from "express";
import { create, detail, list, remove, update } from "../controllers/lead.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { requireBrokerageContext } from "../middleware/tenant.middleware.js";
import { updateStatus } from "../controllers/lead-status.controller.js";
import { convertToClient } from "../controllers/lead-conversion.controller.js";
import { listForLead, viewForLead } from "../controllers/lead-document.controller.js";

const router = Router();
router.use(requireAuth, requireBrokerageContext);
router.get("/", list);
router.get("/:leadId/documents", requireRole("advisor", "brokerageAdmin", "platformAdmin"), listForLead);
router.get("/:leadId/documents/:documentId/view", requireRole("advisor", "brokerageAdmin", "platformAdmin"), viewForLead);
router.get("/:id", detail);
router.post("/", create);
router.patch("/:id/status", requireRole("brokerageAdmin", "advisor", "platformAdmin"), updateStatus);
router.post("/:id/convert-to-client", requireRole("advisor", "brokerageAdmin", "platformAdmin"), convertToClient);
router.patch("/:id", update);
router.delete("/:id", requireRole("brokerageAdmin", "platformAdmin"), remove);

export default router;
