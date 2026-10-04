import mongoose from "mongoose";

const tallyIntegrationSchema = new mongoose.Schema(
  {
    formId: { type: String, required: true, trim: true },
    brokerageId: { type: mongoose.Schema.Types.ObjectId, ref: "Brokerage", required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

tallyIntegrationSchema.index({ formId: 1 }, { unique: true });
tallyIntegrationSchema.index({ brokerageId: 1, active: 1 });

const TallyIntegration = mongoose.model("TallyIntegration", tallyIntegrationSchema);

export default TallyIntegration;
