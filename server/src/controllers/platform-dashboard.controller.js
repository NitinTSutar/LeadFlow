import { getPlatformDashboard } from "../services/platform-dashboard.service.js";

export async function summary(req, res) {
  return res.json(await getPlatformDashboard());
}
