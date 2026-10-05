import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { requireBrokerageContext } from "../middleware/tenant.middleware.js";
import { getCase } from "../controllers/client.controller.js";
import { detailMine, listMine, upload } from "../controllers/document.controller.js";
import multer from "multer";

const router = Router();
router.use(requireAuth, requireRole("client"), requireBrokerageContext);
router.get("/case", getCase);
router.post("/documents", multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }).single("file"), upload);
router.get("/documents", listMine);
router.get("/documents/:id", detailMine);

export default router;
