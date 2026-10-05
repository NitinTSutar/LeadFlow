import mongoose from "mongoose";
import Lead from "../models/lead.model.js";
import User from "../models/user.model.js";
import { hashPassword, normalizeEmail, toSafeUser } from "./auth.service.js";
import { brokerageFilter } from "../middleware/tenant.middleware.js";

function assertLeadId(id) {
  if (!mongoose.isValidObjectId(id)) throw new Error("INVALID_LEAD_ID");
}

export async function convertLeadToClient(user, leadId, password) {
  assertLeadId(leadId);
  const scope = { _id: leadId, ...brokerageFilter(user) };
  const lead = await Lead.findOne(scope);
  if (!lead) throw new Error("LEAD_NOT_FOUND");
  if (lead.clientId) throw new Error("LEAD_ALREADY_CONVERTED");
  if (!lead.email) throw new Error("LEAD_EMAIL_REQUIRED");

  const email = normalizeEmail(lead.email);
  let client = await User.findOne({ email }).select("+passwordHash");

  if (client) {
    if (client.role !== "client" || client.brokerageId?.toString() !== lead.brokerageId.toString()) {
      throw new Error("CLIENT_ACCOUNT_CONFLICT");
    }

    const linkedCase = await Lead.exists({
      brokerageId: lead.brokerageId,
      clientId: client._id,
      _id: { $ne: lead._id },
    });
    if (linkedCase) throw new Error("CLIENT_ACCOUNT_CONFLICT");
  } else {
    try {
      client = await User.create({
        name: `${lead.firstName} ${lead.lastName}`.trim(),
        email,
        passwordHash: await hashPassword(password),
        role: "client",
        brokerageId: lead.brokerageId,
      });
    } catch (error) {
      if (error.code !== 11000) throw error;
      client = await User.findOne({ email });
      if (!client || client.role !== "client" || client.brokerageId?.toString() !== lead.brokerageId.toString()) {
        throw new Error("CLIENT_ACCOUNT_CONFLICT");
      }
    }
  }

  const convertedLead = await Lead.findOneAndUpdate(
    { ...scope, clientId: null },
    {
      $set: { clientId: client._id, convertedAt: new Date(), status: "APPLICATION" },
      $inc: { version: 1 },
    },
    { new: true, runValidators: true },
  );

  if (!convertedLead) {
    throw new Error("LEAD_ALREADY_CONVERTED");
  }

  return { lead: convertedLead, user: toSafeUser(client) };
}

export async function getClientCase(userId, brokerageId) {
  return Lead.findOne({ clientId: userId, brokerageId })
    .populate("brokerageId", "name")
    .select("firstName lastName email phone status convertedAt brokerageId clientId");
}
