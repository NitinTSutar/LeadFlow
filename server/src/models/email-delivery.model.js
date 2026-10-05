import mongoose from "mongoose";

const emailDeliverySchema = new mongoose.Schema(
  {
    brokerageId: { type: mongoose.Schema.Types.ObjectId, ref: "Brokerage", required: true, index: true },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "EmailTemplate", required: true, index: true },
    stage: { type: String, required: true, index: true },
    leadVersion: { type: Number, required: true },
    recipient: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "SENT", "FAILED"], default: "PENDING", index: true },
    sentAt: { type: Date },
    failureReason: { type: String, maxlength: 500 },
  },
  { timestamps: true },
);

emailDeliverySchema.index({ leadId: 1, templateId: 1, leadVersion: 1 }, { unique: true });
emailDeliverySchema.index({ brokerageId: 1, createdAt: -1 });

const EmailDelivery = mongoose.model("EmailDelivery", emailDeliverySchema);

export default EmailDelivery;
