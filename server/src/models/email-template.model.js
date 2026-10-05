import mongoose from "mongoose";
import { LEAD_STATUSES } from "./lead.model.js";

const emailTemplateSchema = new mongoose.Schema(
  {
    brokerageId: { type: mongoose.Schema.Types.ObjectId, ref: "Brokerage", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true, maxlength: 10000 },
    stage: { type: String, enum: LEAD_STATUSES, required: true, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

emailTemplateSchema.index({ brokerageId: 1, stage: 1, isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

const EmailTemplate = mongoose.model("EmailTemplate", emailTemplateSchema);

export default EmailTemplate;
