import { getLeadDocumentUrl, listLeadDocuments } from "../services/document.service.js";

export async function listForLead(req, res) {
  try {
    const documents = await listLeadDocuments(req.user, req.params.leadId);
    return res.json({ documents });
  } catch (error) {
    if (error.message === "INVALID_LEAD_ID") return res.status(400).json({ message: "Invalid lead ID." });
    throw error;
  }
}

export async function viewForLead(req, res) {
  try {
    const result = await getLeadDocumentUrl(req.user, req.params.leadId, req.params.documentId);
    if (!result) return res.status(404).json({ message: "Document not found." });
    return res.json({ document: result });
  } catch (error) {
    if (["INVALID_LEAD_ID", "INVALID_DOCUMENT_ID"].includes(error.message)) return res.status(400).json({ message: "Invalid ID." });
    throw error;
  }
}
