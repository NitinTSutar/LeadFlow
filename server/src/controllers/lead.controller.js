import { createLead, deleteLead, getLead, listLeads, updateLead } from "../services/lead.service.js";

function handleServiceError(error, res) {
  if (error.message === "DUPLICATE_LEAD") return res.status(409).json({ message: "Duplicate lead detected.", duplicateLeadId: error.duplicateLeadId });
  if (error.message === "CONTACT_METHOD_REQUIRED") return res.status(400).json({ message: "Email or phone is required." });
  if (error.message === "INVALID_ID") return res.status(400).json({ message: "Invalid lead ID." });
  if (error.message === "INVALID_ADVISOR" || error.message === "INVALID_ADVISOR_ID") {
    return res.status(422).json({ message: "Invalid advisor assignment." });
  }
  if (error.message === "BROKERAGE_CONTEXT_REQUIRED") return res.status(403).json({ message: "Brokerage context is required." });
  if (error.name === "ValidationError") {
    return res.status(422).json({ message: "Lead validation failed." });
  }
  throw error;
}

export async function list(req, res) {
  try {
    const result = await listLeads(req.user, req.query);
    return res.json(result);
  } catch (error) {
    return handleServiceError(error, res);
  }
}

export async function detail(req, res) {
  try {
    const lead = await getLead(req.user, req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found." });
    return res.json({ lead });
  } catch (error) {
    return handleServiceError(error, res);
  }
}

export async function create(req, res) {
  try {
    const lead = await createLead(req.user, req.body || {});
    return res.status(201).json({ lead });
  } catch (error) {
    return handleServiceError(error, res);
  }
}

export async function update(req, res) {
  try {
    const lead = await updateLead(req.user, req.params.id, req.body || {});
    if (!lead) return res.status(404).json({ message: "Lead not found." });
    return res.json({ lead });
  } catch (error) {
    return handleServiceError(error, res);
  }
}

export async function remove(req, res) {
  try {
    const lead = await deleteLead(req.user, req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found." });
    return res.status(204).send();
  } catch (error) {
    return handleServiceError(error, res);
  }
}
