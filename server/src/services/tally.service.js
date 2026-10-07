import crypto from "node:crypto";
import TallyIntegration from "../models/tally-integration.model.js";
import ProcessedWebhookEvent from "../models/processed-webhook-event.model.js";
import Lead from "../models/lead.model.js";
import { config } from "../config/env.js";
import { hasLeadContactMethod, normalizeLeadEmail, normalizeLeadPhone } from "../utils/lead-identity.js";
import { queueStageEmail } from "./email-trigger.service.js";

export function verifyTallySignature(payload, signature) {
  if (!config.tallyWebhookSecret || typeof signature !== "string") return false;
  const expected = crypto.createHmac("sha256", config.tallyWebhookSecret)
    .update(JSON.stringify(payload))
    .digest("base64");
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return receivedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
}

function normalizeLabel(label) {
  return String(label || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function valueAsString(value) {
  if (Array.isArray(value)) return value.map(valueAsString).filter(Boolean).join(", ");
  if (value && typeof value === "object") return value.text || value.name || "";
  return value == null ? "" : String(value).trim();
}

export function mapTallyFields(fields) {
  const mapped = {};
  for (const field of Array.isArray(fields) ? fields : []) {
    const label = normalizeLabel(field.label || field.key);
    const value = valueAsString(field.value);
    if (!value) continue;
    if (["firstname", "givenname", "first"].includes(label)) mapped.firstName = value;
    else if (["lastname", "familyname", "last"].includes(label)) mapped.lastName = value;
    else if (["email", "emailaddress"].includes(label)) mapped.email = value;
    else if (["phone", "phonenumber", "mobile", "mobilenumber"].includes(label)) mapped.phone = value;
    else if (["notes", "note", "message", "comments", "comment"].includes(label)) mapped.notes = value;
  }
  return mapped;
}

function malformed(message) {
  const error = new Error(message);
  error.code = "MALFORMED_TALLY_PAYLOAD";
  return error;
}

async function markProcessed(event) {
  try {
    await ProcessedWebhookEvent.create(event);
  } catch (error) {
    if (error.code !== 11000) throw error;
  }
}

export async function processTallyWebhook(payload) {
  if (!payload || typeof payload !== "object") throw malformed("Payload must be an object.");
  if (payload.eventType !== "FORM_RESPONSE") return { outcome: "ignored" };

  const eventId = payload.eventId;
  const formId = payload.data?.formId;
  const submissionId = payload.data?.submissionId;
  if (!eventId || !formId || !submissionId) throw malformed("Required Tally event fields are missing.");

  const existingEvent = await ProcessedWebhookEvent.exists({ eventId });
  if (existingEvent) return { outcome: "duplicate_event" };

  const integration = await TallyIntegration.findOne({ formId, active: true }).select("brokerageId");
  if (!integration) {
    const error = new Error("TALLY_FORM_NOT_MAPPED");
    error.statusCode = 400;
    throw error;
  }

  const mapped = mapTallyFields(payload.data.fields);
  if (!mapped.firstName || !mapped.lastName) throw malformed("Required lead fields are missing.");
  if (!hasLeadContactMethod(mapped.email, mapped.phone)) throw malformed("Email or phone is required.");

  const normalizedEmail = normalizeLeadEmail(mapped.email);
  const normalizedPhone = normalizeLeadPhone(mapped.phone);
  const duplicateConditions = [];
  if (normalizedEmail) duplicateConditions.push({ normalizedEmail });
  if (normalizedPhone) duplicateConditions.push({ normalizedPhone });
  const duplicate = await Lead.findOne({ brokerageId: integration.brokerageId, $or: duplicateConditions });

  if (duplicate) {
    await markProcessed({ eventId, eventType: payload.eventType, formId, processedAt: new Date() });
    return { outcome: "existing_lead", leadId: duplicate._id };
  }

  const lead = await Lead.create({
    brokerageId: integration.brokerageId,
    firstName: mapped.firstName,
    lastName: mapped.lastName,
    email: normalizedEmail || undefined,
    normalizedEmail,
    phone: normalizedPhone || undefined,
    normalizedPhone,
    source: "tally",
    status: "NEW",
    notes: mapped.notes,
  });

  queueStageEmail(lead);
  await markProcessed({ eventId, eventType: payload.eventType, formId, processedAt: new Date() });
  return { outcome: "created", leadId: lead._id };
}
