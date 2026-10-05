import mongoose from "mongoose";

export const TASK_STATUSES = ["TODO", "COMPLETED", "CANCELLED"];

const taskSchema = new mongoose.Schema(
  {
    brokerageId: { type: mongoose.Schema.Types.ObjectId, ref: "Brokerage", required: true, index: true },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    advisorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    triggerId: { type: mongoose.Schema.Types.ObjectId, ref: "TaskTrigger" },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 2000 },
    status: { type: String, enum: TASK_STATUSES, default: "TODO", index: true },
    dueAt: { type: Date, required: true, index: true },
    completedAt: { type: Date },
    sourceStage: { type: String, required: true },
  },
  { timestamps: true },
);

taskSchema.index({ leadId: 1, triggerId: 1, sourceStage: 1 }, { unique: true, sparse: true });
taskSchema.index({ brokerageId: 1, advisorId: 1, status: 1, dueAt: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
