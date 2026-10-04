import mongoose from "mongoose";

const processedWebhookEventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true, trim: true },
    eventType: { type: String, required: true, trim: true },
    formId: { type: String, required: true, trim: true },
    processedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

const ProcessedWebhookEvent = mongoose.model("ProcessedWebhookEvent", processedWebhookEventSchema);

export default ProcessedWebhookEvent;
