import mongoose from "mongoose";
import Brokerage from "../models/brokerage.model.js";
import Lead, { LEAD_STATUSES } from "../models/lead.model.js";

export async function resolveDashboardBrokerage(user, requestedBrokerageId) {
  const brokerageId = user.role === "platformAdmin" ? requestedBrokerageId : user.brokerageId?.toString();
  if (!brokerageId || !mongoose.isValidObjectId(brokerageId)) throw new Error("INVALID_BROKERAGE_ID");
  if (!await Brokerage.exists({ _id: brokerageId })) throw new Error("BROKERAGE_NOT_FOUND");
  return new mongoose.Types.ObjectId(brokerageId);
}

export async function getPipelineCounts(brokerageId) {
  const rows = await Lead.aggregate([
    { $match: { brokerageId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const counts = Object.fromEntries(LEAD_STATUSES.map((status) => [status, 0]));
  for (const row of rows) if (Object.hasOwn(counts, row._id)) counts[row._id] = row.count;
  return counts;
}
