import mongoose from "mongoose";
import Brokerage from "../models/brokerage.model.js";
import EmailTemplate from "../models/email-template.model.js";
import { LEAD_STATUSES } from "../models/lead.model.js";

function assertId(value, name) { if (!mongoose.isValidObjectId(value)) throw new Error(`INVALID_${name.toUpperCase()}_ID`); }
async function authorize(actor, brokerageId) {
  assertId(brokerageId, "brokerage");
  if (actor.role !== "platformAdmin" && actor.brokerageId?.toString() !== brokerageId) throw new Error("BROKERAGE_FORBIDDEN");
  if (!await Brokerage.exists({ _id: brokerageId })) throw new Error("BROKERAGE_NOT_FOUND");
}
export function validateTemplate(data, partial = false) {
  if ((!partial || data.name !== undefined) && (typeof data.name !== "string" || !data.name.trim() || data.name.trim().length > 120)) throw new Error("INVALID_NAME");
  if ((!partial || data.subject !== undefined) && (typeof data.subject !== "string" || !data.subject.trim())) throw new Error("INVALID_SUBJECT");
  if ((!partial || data.body !== undefined) && (typeof data.body !== "string" || !data.body.trim())) throw new Error("INVALID_BODY");
  if ((!partial || data.stage !== undefined) && !LEAD_STATUSES.includes(data.stage)) throw new Error("INVALID_STAGE");
}
export async function createTemplate(actor, brokerageId, data) { await authorize(actor, brokerageId); return EmailTemplate.create({ brokerageId, ...data }); }
export async function listTemplates(actor, brokerageId) { await authorize(actor, brokerageId); return EmailTemplate.find({ brokerageId }).sort({ stage: 1, name: 1 }); }
export async function getTemplate(actor, brokerageId, templateId) { await authorize(actor, brokerageId); assertId(templateId, "template"); const template = await EmailTemplate.findOne({ _id: templateId, brokerageId }); if (!template) throw new Error("TEMPLATE_NOT_FOUND"); return template; }
export async function updateTemplate(actor, brokerageId, templateId, data) { await authorize(actor, brokerageId); assertId(templateId, "template"); const template = await EmailTemplate.findOneAndUpdate({ _id: templateId, brokerageId }, { $set: data }, { new: true, runValidators: true }); if (!template) throw new Error("TEMPLATE_NOT_FOUND"); return template; }
export async function deleteTemplate(actor, brokerageId, templateId) { await authorize(actor, brokerageId); assertId(templateId, "template"); const template = await EmailTemplate.findOneAndDelete({ _id: templateId, brokerageId }); if (!template) throw new Error("TEMPLATE_NOT_FOUND"); }
