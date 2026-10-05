import mongoose from "mongoose";
import { LEAD_STATUSES } from "./lead.model.js";

const taskTriggerSchema = new mongoose.Schema(
  {
    brokerageId: { type: mongoose.Schema.Types.ObjectId, ref: "Brokerage", required: true, index: true },
    stage: { type: String, enum: LEAD_STATUSES, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 2000 },
    dueInMinutes: { type: Number, required: true, min: 1 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

taskTriggerSchema.index({ brokerageId: 1, stage: 1, isActive: 1 });

const TaskTrigger = mongoose.model("TaskTrigger", taskTriggerSchema);

export default TaskTrigger;
