import { updateLeadStatus } from "../services/lead.service.js";
import { emitLeadUpdated } from "../sockets/index.js";
import { createTasksForStage } from "../services/task.service.js";
import { sendStageEmail } from "../services/email-trigger.service.js";

export async function updateStatus(req, res) {
  const { status, version } = req.body || {};
  try {
    const result = await updateLeadStatus(req.user, req.params.id, status, version);
    if (result.outcome === "not_found") return res.status(404).json({ message: "Lead not found." });
    if (result.outcome === "conflict") return res.status(409).json({ message: "Lead was updated by another request.", lead: result.lead });
    if (result.outcome === "unchanged") return res.json({ lead: result.lead });

    emitLeadUpdated(result.lead.brokerageId, {
      lead: result.lead,
      previousStatus: result.previousStatus,
      newStatus: result.newStatus,
      version: result.lead.version,
    });
    createTasksForStage(result.lead).catch((error) => console.error("Task trigger execution failed:", error.message));
    sendStageEmail(result.lead).catch((error) => console.error("Pipeline email trigger failed:", error.message));
    return res.json({ lead: result.lead });
  } catch (error) {
    if (error.message === "INVALID_ID") return res.status(400).json({ message: "Invalid lead ID." });
    if (error.message === "INVALID_STATUS") return res.status(422).json({ message: "Invalid lead status." });
    if (error.message === "INVALID_VERSION") return res.status(400).json({ message: "A valid lead version is required." });
    if (error.name === "ValidationError") return res.status(422).json({ message: "Lead validation failed." });
    throw error;
  }
}
