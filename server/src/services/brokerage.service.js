import mongoose from "mongoose";
import Brokerage from "../models/brokerage.model.js";
import User from "../models/user.model.js";
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
