import mongoose from "mongoose";
import TaskTrigger from "../models/task-trigger.model.js";
import Brokerage from "../models/brokerage.model.js";
import { LEAD_STATUSES } from "../models/lead.model.js";

function assertId(value, name) {
  if (!mongoose.isValidObjectId(value)) throw new Error(`INVALID_${name.toUpperCase()}_ID`);
}

async function authorize(actor, brokerageId) {
  assertId(brokerageId, "brokerage");
  if (actor.role !== "platformAdmin" && actor.brokerageId?.toString() !== brokerageId) throw new Error("BROKERAGE_FORBIDDEN");
  if (!await Brokerage.exists({ _id: brokerageId })) throw new Error("BROKERAGE_NOT_FOUND");
}

export async function createTrigger(actor, brokerageId, data) {
  await authorize(actor, brokerageId);
  const normalized = normalizeTriggerData(data);
  if (await TaskTrigger.exists({ brokerageId, ...normalized, isActive: true })) throw new Error("DUPLICATE_TRIGGER");
  return TaskTrigger.create({ brokerageId, ...normalized });
}

export async function listTriggers(actor, brokerageId) {
  await authorize(actor, brokerageId);
  return TaskTrigger.find({ brokerageId }).sort({ stage: 1, title: 1 });
}

export async function updateTrigger(actor, brokerageId, triggerId, data) {
  await authorize(actor, brokerageId);
  assertId(triggerId, "trigger");
  const current = await TaskTrigger.findOne({ _id: triggerId, brokerageId });
  if (!current) throw new Error("TRIGGER_NOT_FOUND");
  const normalized = normalizeTriggerData({ ...current.toObject(), ...data });
  if (normalized.isActive && await TaskTrigger.exists({ _id: { $ne: triggerId }, brokerageId, ...normalized, isActive: true })) throw new Error("DUPLICATE_TRIGGER");
  const trigger = await TaskTrigger.findOneAndUpdate({ _id: triggerId, brokerageId }, { $set: normalized }, { new: true, runValidators: true });
  if (!trigger) throw new Error("TRIGGER_NOT_FOUND");
  return trigger;
}

function normalizeTriggerData(data) {
  return {
    stage: data.stage,
    title: data.title.trim(),
    description: data.description?.trim() || "",
    dueInMinutes: data.dueInMinutes,
    isActive: data.isActive !== false,
  };
}

export async function deleteTrigger(actor, brokerageId, triggerId) {
  await authorize(actor, brokerageId);
  assertId(triggerId, "trigger");
  const trigger = await TaskTrigger.findOneAndDelete({ _id: triggerId, brokerageId });
  if (!trigger) throw new Error("TRIGGER_NOT_FOUND");
}

export function validateTriggerData(data, partial = false) {
  if ((!partial || data.stage !== undefined) && !LEAD_STATUSES.includes(data.stage)) throw new Error("INVALID_STAGE");
  if ((!partial || data.title !== undefined) && (typeof data.title !== "string" || data.title.trim().length < 1 || data.title.trim().length > 160)) throw new Error("INVALID_TITLE");
  if ((!partial || data.dueInMinutes !== undefined) && (!Number.isFinite(data.dueInMinutes) || data.dueInMinutes <= 0)) throw new Error("INVALID_DUE_TIME");
}
