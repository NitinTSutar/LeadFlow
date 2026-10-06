import mongoose from "mongoose";
import { normalizeLeadEmail, normalizeLeadPhone } from "../utils/lead-identity.js";

export const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "APPLICATION", "WON", "LOST"];

const leadSchema = new mongoose.Schema(
  {
    brokerageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brokerage",
      required: true,
      index: true,
    },
    firstName: { type: String, required: true, trim: true, maxlength: 100 },
    lastName: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
    },
    normalizedEmail: { type: String, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true, maxlength: 40 },
    normalizedPhone: { type: String, trim: true, index: true },
    source: { type: String, trim: true, lowercase: true, default: "manual", maxlength: 80 },
    status: { type: String, enum: LEAD_STATUSES, default: "NEW", index: true },
    version: { type: Number, required: true, default: 0, min: 0 },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, default: null },
    convertedAt: { type: Date, default: null },
    assignedAdvisorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    notes: { type: String, trim: true, maxlength: 5000 },
  },
  { timestamps: true },
);

leadSchema.pre("validate", function normalizeContactFields() {
  this.normalizedEmail = normalizeLeadEmail(this.email) || undefined;
  this.normalizedPhone = normalizeLeadPhone(this.phone) || undefined;
});

leadSchema.index({ brokerageId: 1, createdAt: -1 });
leadSchema.index({ brokerageId: 1, status: 1, createdAt: -1 });
leadSchema.index({ brokerageId: 1, assignedAdvisorId: 1, createdAt: -1 });
leadSchema.index({ brokerageId: 1, normalizedEmail: 1 });
leadSchema.index({ brokerageId: 1, normalizedPhone: 1 });

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
