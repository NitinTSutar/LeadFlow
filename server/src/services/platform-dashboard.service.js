import Brokerage from "../models/brokerage.model.js";
import Lead, { LEAD_STATUSES } from "../models/lead.model.js";
import User from "../models/user.model.js";

export async function getPlatformDashboard() {
  const [brokerages, userCounts, leadCounts] = await Promise.all([
    Brokerage.find().select("_id name").sort({ name: 1 }).lean(),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    Lead.aggregate([{ $group: { _id: { brokerageId: "$brokerageId", status: "$status" }, count: { $sum: 1 } } }]),
  ]);

  const users = Object.fromEntries(userCounts.map((row) => [row._id, row.count]));
  const overall = Object.fromEntries(LEAD_STATUSES.map((status) => [status, 0]));
  const byBrokerage = new Map(brokerages.map((brokerage) => [brokerage._id.toString(), Object.fromEntries(LEAD_STATUSES.map((status) => [status, 0]))]));

  for (const row of leadCounts) {
    if (!Object.hasOwn(overall, row._id.status)) continue;
    overall[row._id.status] += row.count;
    const counts = byBrokerage.get(row._id.brokerageId.toString());
    if (counts) counts[row._id.status] = row.count;
  }

  return {
    summary: {
      brokerages: brokerages.length,
      brokerageAdmins: users.brokerageAdmin || 0,
      advisors: users.advisor || 0,
      clients: users.client || 0,
      leads: Object.values(overall).reduce((total, count) => total + count, 0),
    },
    pipeline: overall,
    brokerages: brokerages.map((brokerage) => ({
      brokerageId: brokerage._id.toString(),
      name: brokerage.name,
      pipeline: byBrokerage.get(brokerage._id.toString()),
    })),
  };
}
