import { Router } from "express";
import { requireRole } from "../middleware/role.middleware.js";
import { create, list, remove, update } from "../controllers/tally-integration.controller.js";

const router = Router({ mergeParams: true });
router.use(requireRole("platformAdmin"));
router.get("/", list);
router.post("/", create);
router.patch("/:integrationId", update);
router.delete("/:integrationId", remove);
export default router;
