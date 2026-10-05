import mongoose from "mongoose";

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
    assignedAdvisorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    notes: { type: String, trim: true, maxlength: 5000 },
  },
  { timestamps: true },
);

leadSchema.pre("validate", function normalizeContactFields() {
  this.normalizedEmail = this.email?.trim().toLowerCase() || undefined;
  this.normalizedPhone = this.phone?.replace(/[^\d+]/g, "") || undefined;
});

leadSchema.index({ brokerageId: 1, createdAt: -1 });
leadSchema.index({ brokerageId: 1, status: 1, createdAt: -1 });
leadSchema.index({ brokerageId: 1, assignedAdvisorId: 1, createdAt: -1 });

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
