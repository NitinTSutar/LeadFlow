import { processTallyWebhook, verifyTallySignature } from "../services/tally.service.js";

export async function receiveTallyWebhook(req, res) {
  if (!verifyTallySignature(req.body, req.get("Tally-Signature"))) {
    return res.status(401).json({ message: "Invalid webhook signature." });
  }

  try {
    const result = await processTallyWebhook(req.body);
    if (result.outcome === "ignored") return res.status(200).json({ received: true, ignored: true });
    return res.status(200).json({ received: true, ...result });
  } catch (error) {
    if (error.code === "MALFORMED_TALLY_PAYLOAD") return res.status(400).json({ message: error.message });
    if (error.code === "TALLY_FORM_NOT_MAPPED") return res.status(400).json({ message: "Tally form is not mapped to an active brokerage." });
    throw error;
  }
}
