import mongoose from "mongoose";
import Brokerage from "../models/brokerage.model.js";
import User from "../models/user.model.js";
import Lead from "../models/lead.model.js";
import { hashPassword, normalizeEmail, toSafeUser } from "./auth.service.js";

function assertBrokerageId(id) {
  if (!mongoose.isValidObjectId(id)) throw new Error("INVALID_BROKERAGE_ID");
}

export async function createBrokerage(name) {
  const trimmedName = name.trim();
  const existing = await Brokerage.findOne({ name: trimmedName }).collation({ locale: "en", strength: 2 });
  if (existing) throw new Error("BROKERAGE_NAME_EXISTS");
  return Brokerage.create({ name: trimmedName });
}

export function listBrokerages() {
  return Brokerage.find().sort({ name: 1 });
}

export async function getBrokerage(id) {
  assertBrokerageId(id);
  return Brokerage.findById(id);
}

export async function updateBrokerage(id, name) {
  assertBrokerageId(id);
  const brokerage = await Brokerage.findById(id);
  if (!brokerage) return null;

  const trimmedName = name.trim();
  const existing = await Brokerage.findOne({ _id: { $ne: id }, name: trimmedName }).collation({ locale: "en", strength: 2 });
  if (existing) throw new Error("BROKERAGE_NAME_EXISTS");

  brokerage.name = trimmedName;
  return brokerage.save();
}

export async function createBrokerageAdmin(brokerageId, { name, email, password }) {
  assertBrokerageId(brokerageId);
  const brokerage = await Brokerage.findById(brokerageId).select("_id");
  if (!brokerage) throw new Error("BROKERAGE_NOT_FOUND");

  const normalizedEmail = normalizeEmail(email);
  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "brokerageAdmin",
    brokerageId: brokerage._id,
  });

  return toSafeUser(user);
}

export async function listBrokerageAdmins(brokerageId) {
  assertBrokerageId(brokerageId);
  if (!await Brokerage.exists({ _id: brokerageId })) throw new Error("BROKERAGE_NOT_FOUND");
  const users = await User.find({ brokerageId, role: "brokerageAdmin" }).sort({ name: 1 });
  return users.map(toSafeUser);
}

export async function updateBrokerageAdmin(brokerageId, adminId, data) {
  assertBrokerageId(brokerageId);
  if (!await Brokerage.exists({ _id: brokerageId })) throw new Error("BROKERAGE_NOT_FOUND");
  if (!mongoose.isValidObjectId(adminId)) throw new Error("INVALID_ADMIN_ID");
  const admin = await User.findOne({ _id: adminId, brokerageId, role: "brokerageAdmin" }).select("+passwordHash");
  if (!admin) throw new Error("ADMIN_NOT_FOUND");
  if (data.name !== undefined) admin.name = data.name.trim();
  if (data.email !== undefined) admin.email = normalizeEmail(data.email);
  if (data.password !== undefined) admin.passwordHash = await hashPassword(data.password);
  if (data.isActive !== undefined) admin.isActive = data.isActive;
  await admin.save();
  return toSafeUser(admin);
}

export async function deleteBrokerageAdmin(brokerageId, adminId) {
  assertBrokerageId(brokerageId);
  if (!await Brokerage.exists({ _id: brokerageId })) throw new Error("BROKERAGE_NOT_FOUND");
  if (!mongoose.isValidObjectId(adminId)) throw new Error("INVALID_ADMIN_ID");
  const admin = await User.findOneAndDelete({ _id: adminId, brokerageId, role: "brokerageAdmin" });
  if (!admin) throw new Error("ADMIN_NOT_FOUND");
}

export async function deleteBrokerage(id) {
  assertBrokerageId(id);
  const brokerage = await Brokerage.findById(id);
  if (!brokerage) return null;
  const [hasUsers, hasLeads] = await Promise.all([
    User.exists({ brokerageId: id }),
    Lead.exists({ brokerageId: id }),
  ]);
  if (hasUsers || hasLeads) throw new Error("BROKERAGE_HAS_DATA");
  await brokerage.deleteOne();
  return brokerage;
}
