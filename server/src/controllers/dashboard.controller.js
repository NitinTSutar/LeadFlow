import { getPipelineCounts, resolveDashboardBrokerage } from "../services/dashboard.service.js";

export async function pipeline(req, res) {
  try {
    const brokerageId = await resolveDashboardBrokerage(req.user, req.query.brokerageId);
    return res.json(await getPipelineCounts(brokerageId));
  } catch (error) {
    if (error.message === "INVALID_BROKERAGE_ID") return res.status(400).json({ message: "A valid brokerageId is required." });
    if (error.message === "BROKERAGE_NOT_FOUND") return res.status(404).json({ message: "Brokerage not found." });
    throw error;
  }
}
