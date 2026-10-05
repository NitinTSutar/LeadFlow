import { getClientCase } from "../services/client.service.js";

export async function getCase(req, res) {
  const lead = await getClientCase(req.user._id, req.user.brokerageId);
  if (!lead) return res.status(404).json({ message: "Client case not found." });
  return res.json({ case: lead });
}
