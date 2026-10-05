import mongoose from "mongoose";
import Lead from "../models/lead.model.js";
import Brokerage from "../models/brokerage.model.js";
import User from "../models/user.model.js";
import { hashPassword, normalizeEmail } from "./auth.service.js";

const CLOSED_STATUSES = ["WON", "LOST"];

function assertId(value, name) {
  if (!mongoose.isValidObjectId(value)) throw new Error(`INVALID_${name.toUpperCase()}_ID`);
}

async function authorizeBrokerage(actor, brokerageId) {
  assertId(brokerageId, "brokerage");
  if (actor.role !== "platformAdmin" && actor.brokerageId?.toString() !== brokerageId) {
    throw new Error("BROKERAGE_FORBIDDEN");
  }
  const brokerage = await Brokerage.findById(brokerageId).select("_id");
  if (!brokerage) throw new Error("BROKERAGE_NOT_FOUND");
}

async function activeCaseCounts(advisors, brokerageId) {
  const ids = advisors.map((advisor) => advisor._id);
  if (!ids.length) return new Map();
  const rows = await Lead.aggregate([
    { $match: { brokerageId: new mongoose.Types.ObjectId(brokerageId), assignedAdvisorId: { $in: ids }, status: { $nin: CLOSED_STATUSES } } },
    { $group: { _id: "$assignedAdvisorId", count: { $sum: 1 } } },
  ]);
  return new Map(rows.map((row) => [row._id.toString(), row.count]));
}

function safeAdvisor(advisor, counts) {
  return {
    id: advisor._id.toString(),
    name: advisor.name,
    email: advisor.email,
    role: advisor.role,
    brokerageId: advisor.brokerageId.toString(),
    isActive: advisor.isActive !== false,
    activeCaseCount: counts.get(advisor._id.toString()) || 0,
  };
}

export async function createAdvisor(actor, brokerageId, data) {
  await authorizeBrokerage(actor, brokerageId);
  const user = await User.create({
    name: data.name.trim(),
    email: normalizeEmail(data.email),
    passwordHash: await hashPassword(data.password),
    role: "advisor",
    brokerageId,
  });
  return safeAdvisor(user, new Map());
}

export async function listAdvisors(actor, brokerageId, availableOnly = false) {
  await authorizeBrokerage(actor, brokerageId);
  const query = { brokerageId, role: "advisor" };
  if (availableOnly) query.$or = [{ isActive: true }, { isActive: { $exists: false } }];
  const advisors = await User.find(query).select("name email role brokerageId isActive").sort({ name: 1 });
  const counts = await activeCaseCounts(advisors, brokerageId);
  return advisors.map((advisor) => safeAdvisor(advisor, counts));
}

export async function getAdvisor(actor, brokerageId, advisorId) {
  await authorizeBrokerage(actor, brokerageId);
  assertId(advisorId, "advisor");
  const advisor = await User.findOne({ _id: advisorId, brokerageId, role: "advisor" }).select("name email role brokerageId isActive");
  if (!advisor) throw new Error("ADVISOR_NOT_FOUND");
  const counts = await activeCaseCounts([advisor], brokerageId);
  return safeAdvisor(advisor, counts);
}

export async function updateAdvisor(actor, brokerageId, advisorId, data) {
  await authorizeBrokerage(actor, brokerageId);
  assertId(advisorId, "advisor");
  const advisor = await User.findOne({ _id: advisorId, brokerageId, role: "advisor" }).select("+passwordHash");
  if (!advisor) throw new Error("ADVISOR_NOT_FOUND");
  if (data.name !== undefined) advisor.name = data.name.trim();
  if (data.email !== undefined) advisor.email = normalizeEmail(data.email);
  if (data.password !== undefined) advisor.passwordHash = await hashPassword(data.password);
  if (data.isActive !== undefined) advisor.isActive = data.isActive;
  await advisor.save();
  const counts = await activeCaseCounts([advisor], brokerageId);
  return safeAdvisor(advisor, counts);
}
