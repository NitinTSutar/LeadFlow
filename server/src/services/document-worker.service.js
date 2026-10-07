import Document from "../models/document.model.js";
import { emitDocumentUpdated } from "../sockets/index.js";

export function startDocumentCheck(documentId) {
  setImmediate(() => processDocument(documentId).catch(async (error) => {
    console.error("Document check failed:", error.message);
    const failed = await Document.findByIdAndUpdate(
      documentId,
      { $set: { status: "FAILED", checkedAt: new Date(), failureReason: "Document check failed." } },
      { new: true },
    ).catch(() => null);
    if (failed) emitDocumentUpdated(failed.brokerageId, { document: failed, status: "FAILED" });
  }));
}

async function processDocument(documentId) {
  const document = await Document.findOneAndUpdate(
    { _id: documentId, status: "UPLOADED" },
    { $set: { status: "PROCESSING" } },
    { new: true },
  );
  if (!document) return;
  emitDocumentUpdated(document.brokerageId, { document, status: "PROCESSING" });

  const processingSeconds = Math.max(1, Math.ceil(document.size / (1024 * 1024)));
  await new Promise((resolve) => setTimeout(resolve, processingSeconds * 1000));
  const failed = Math.random() < 0.1;
  const status = failed ? "FAILED" : "APPROVED";
  const failureReason = failed ? "Simulated document check failure." : undefined;
  const updated = await Document.findOneAndUpdate(
    { _id: documentId, status: "PROCESSING" },
    { $set: { status, checkedAt: new Date(), failureReason } },
    { new: true },
  );
  if (updated) emitDocumentUpdated(updated.brokerageId, { document: updated, status });
}
