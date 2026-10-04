import mongoose from "mongoose";
import Lead from "../models/lead.model.js";
import User from "../models/user.model.js";
import { brokerageFilter } from "../middleware/tenant.middleware.js";

const writableFields = ["firstName", "lastName", "email", "phone", "source", "status", "assignedAdvisorId", "notes"];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertObjectId(value, field = "id") {
  if (!mongoose.isValidObjectId(value)) throw new Error(`INVALID_${field.toUpperCase()}`);
}

async function validateAdvisor(assignedAdvisorId, brokerageId) {
  if (assignedAdvisorId == null || assignedAdvisorId === "") return null;
  assertObjectId(assignedAdvisorId, "advisor");
  const advisor = await User.findOne({ _id: assignedAdvisorId, brokerageId, role: "advisor" }).select("_id");
  if (!advisor) throw new Error("INVALID_ADVISOR");
  return advisor._id;
}

function tenantQuery(user) {
  return brokerageFilter(user);
}

export async function listLeads(user, { page = 1, limit = 20, status, assignedAdvisorId, source, search }) {
  const safePage = Math.max(Number.parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 20, 1), 100);
  const query = { ...tenantQuery(user) };

  if (status) query.status = status;
  if (source) query.source = source.trim().toLowerCase();
  if (assignedAdvisorId) {
    assertObjectId(assignedAdvisorId, "advisor");
    query.assignedAdvisorId = assignedAdvisorId;
  }
  if (search?.trim()) {
    const expression = new RegExp(escapeRegex(search.trim()), "i");
    query.$or = [{ firstName: expression }, { lastName: expression }, { email: expression }, { phone: expression }];
  }

  const [leads, total] = await Promise.all([
    Lead.find(query).sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit),
    Lead.countDocuments(query),
  ]);
  return { leads, pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) } };
}

export async function getLead(user, leadId) {
  assertObjectId(leadId);
  return Lead.findOne({ _id: leadId, ...tenantQuery(user) });
}

export async function createLead(user, data) {
  if (!user.brokerageId) throw new Error("BROKERAGE_CONTEXT_REQUIRED");
  const assignedAdvisorId = await validateAdvisor(data.assignedAdvisorId, user.brokerageId);
  const lead = new Lead({
    brokerageId: user.brokerageId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    source: data.source ?? "manual",
    status: data.status ?? "NEW",
    assignedAdvisorId,
    notes: data.notes,
  });
  return lead.save();
}

export async function updateLead(user, leadId, data) {
  assertObjectId(leadId);
  const lead = await Lead.findOne({ _id: leadId, ...tenantQuery(user) });
  if (!lead) return null;

  const updates = Object.fromEntries(Object.entries(data).filter(([key]) => writableFields.includes(key)));
  if (Object.hasOwn(updates, "assignedAdvisorId")) {
    updates.assignedAdvisorId = await validateAdvisor(updates.assignedAdvisorId, lead.brokerageId);
  }
  Object.assign(lead, updates);
  return lead.save();
}

export async function deleteLead(user, leadId) {
  assertObjectId(leadId);
  return Lead.findOneAndDelete({ _id: leadId, ...tenantQuery(user) });
}
