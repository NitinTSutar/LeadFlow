import crypto from "node:crypto";
import mongoose from "mongoose";
import Document from "../models/document.model.js";
import Lead from "../models/lead.model.js";
import { deleteFromR2, uploadToR2 } from "./r2.service.js";
import { startDocumentCheck } from "./document-worker.service.js";
import { brokerageFilter } from "../middleware/tenant.middleware.js";
import { emitDocumentUpdated } from "../sockets/index.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);

function assertId(value, name) {
  if (!mongoose.isValidObjectId(value)) throw new Error(`INVALID_${name.toUpperCase()}_ID`);
}

function validateFile(file) {
  if (!file) throw new Error("FILE_REQUIRED");
  if (!ALLOWED_TYPES.has(file.mimetype)) throw new Error("UNSUPPORTED_FILE_TYPE");
  if (file.size > MAX_FILE_SIZE) throw new Error("FILE_TOO_LARGE");
  const signature = file.buffer.subarray(0, 8);
  const valid = file.mimetype === "application/pdf" && signature.toString().startsWith("%PDF-")
    || file.mimetype === "image/jpeg" && signature[0] === 0xff && signature[1] === 0xd8
    || file.mimetype === "image/png" && signature.equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (!valid) throw new Error("INVALID_FILE_CONTENT");
}

async function clientCase(user) {
  const lead = await Lead.findOne({ clientId: user._id, brokerageId: user.brokerageId }).select("_id brokerageId clientId");
  if (!lead) throw new Error("CLIENT_CASE_NOT_FOUND");
  return lead;
}

export async function uploadClientDocument(user, file) {
  const lead = await clientCase(user);
  validateFile(file);
  const storageKey = `brokerages/${lead.brokerageId}/clients/${user._id}/${crypto.randomUUID()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  await uploadToR2({ key: storageKey, body: file.buffer, contentType: file.mimetype });

  let document;
  try {
    document = await Document.create({
      brokerageId: lead.brokerageId,
      clientId: user._id,
      leadId: lead._id,
      uploadedBy: user._id,
      originalName: file.originalname,
      storageKey,
      mimeType: file.mimetype,
      size: file.size,
      status: "UPLOADED",
    });
  } catch (error) {
    await deleteFromR2(storageKey).catch(() => {});
    throw error;
  }

  emitDocumentUpdated(document.brokerageId, { document, status: document.status });
  startDocumentCheck(document._id);
  return document;
}

export function listClientDocuments(user) {
  return Document.find({ clientId: user._id, brokerageId: user.brokerageId }).sort({ createdAt: -1 });
}

export async function getClientDocument(user, documentId) {
  assertId(documentId, "document");
  return Document.findOne({ _id: documentId, clientId: user._id, brokerageId: user.brokerageId });
}

export async function listLeadDocuments(user, leadId) {
  assertId(leadId, "lead");
  return Document.find({ leadId, ...brokerageFilter(user) }).sort({ createdAt: -1 });
}
