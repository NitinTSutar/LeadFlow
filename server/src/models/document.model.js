import mongoose from "mongoose";

export const DOCUMENT_STATUSES = ["UPLOADED", "PROCESSING", "APPROVED", "FAILED"];

const documentSchema = new mongoose.Schema(
  {
    brokerageId: { type: mongoose.Schema.Types.ObjectId, ref: "Brokerage", required: true, index: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalName: { type: String, required: true, trim: true, maxlength: 255 },
    storageKey: { type: String, required: true, unique: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 1 },
    status: { type: String, enum: DOCUMENT_STATUSES, default: "UPLOADED", index: true },
    failureReason: { type: String, trim: true, maxlength: 500 },
    checkedAt: { type: Date },
  },
  { timestamps: true },
);

documentSchema.index({ brokerageId: 1, clientId: 1, createdAt: -1 });
documentSchema.index({ brokerageId: 1, leadId: 1, createdAt: -1 });

const Document = mongoose.model("Document", documentSchema);

export default Document;
