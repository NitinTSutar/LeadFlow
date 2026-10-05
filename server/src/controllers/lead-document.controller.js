import { listLeadDocuments } from "../services/document.service.js";

export async function listForLead(req, res) {
  try {
    const documents = await listLeadDocuments(req.user, req.params.leadId);
    return res.json({ documents });
  } catch (error) {
    if (error.message === "INVALID_LEAD_ID") return res.status(400).json({ message: "Invalid lead ID." });
    throw error;
  }
}
