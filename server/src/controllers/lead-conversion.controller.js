import { convertLeadToClient } from "../services/client.service.js";

export async function convertToClient(req, res) {
  const { password } = req.body || {};
  if (typeof password !== "string" || !password) {
    return res.status(400).json({ message: "A temporary password is required." });
  }

  try {
    const result = await convertLeadToClient(req.user, req.params.id, password);
    return res.status(201).json({ lead: result.lead, user: result.user });
  } catch (error) {
    if (error.message === "INVALID_LEAD_ID") return res.status(400).json({ message: "Invalid lead ID." });
    if (error.message === "LEAD_NOT_FOUND") return res.status(404).json({ message: "Lead not found." });
    if (error.message === "LEAD_EMAIL_REQUIRED") return res.status(400).json({ message: "Lead email is required for client conversion." });
    if (error.message === "LEAD_ALREADY_CONVERTED") return res.status(409).json({ message: "Lead has already been converted to a client." });
    if (error.message === "CLIENT_ACCOUNT_CONFLICT") return res.status(409).json({ message: "An incompatible client account already exists." });
    if (error.name === "ValidationError") return res.status(400).json({ message: "Client validation failed." });
    throw error;
  }
}
