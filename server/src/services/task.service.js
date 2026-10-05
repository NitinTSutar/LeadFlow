import mongoose from "mongoose";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import TaskTrigger from "../models/task-trigger.model.js";
import { emitTaskUpdated } from "../sockets/index.js";

function assertId(value, name = "task") {
  if (!mongoose.isValidObjectId(value)) throw new Error(`INVALID_${name.toUpperCase()}_ID`);
}

function taskScope(user) {
  if (user.role === "platformAdmin") return {};
  if (user.role === "advisor") return { brokerageId: user.brokerageId, advisorId: user._id };
  return { brokerageId: user.brokerageId };
}

function withOverdue(task) {
  const value = task.toObject ? task.toObject() : task;
  return { ...value, overdue: value.status === "TODO" && new Date(value.dueAt) < new Date() };
}

export async function listTasks(user, filters = {}) {
  const query = { ...taskScope(user) };
  if (filters.status) query.status = filters.status;
  const tasks = await Task.find(query).sort({ dueAt: 1, createdAt: -1 });
  return tasks.map(withOverdue);
}

export async function getTask(user, taskId) {
  assertId(taskId);
  const task = await Task.findOne({ _id: taskId, ...taskScope(user) });
  return task ? withOverdue(task) : null;
}

async function validateAdvisor(advisorId, brokerageId) {
  assertId(advisorId, "advisor");
  const advisor = await User.findOne({ _id: advisorId, brokerageId, role: "advisor", $or: [{ isActive: true }, { isActive: { $exists: false } }] }).select("_id");
  if (!advisor) throw new Error("INVALID_ADVISOR");
  return advisor._id;
}

export async function updateTask(user, taskId, data) {
  assertId(taskId);
  const task = await Task.findOne({ _id: taskId, ...taskScope(user) });
  if (!task) return null;
  const updates = {};
  if (data.title !== undefined) updates.title = data.title;
  if (data.description !== undefined) updates.description = data.description;
  if (data.dueAt !== undefined) updates.dueAt = data.dueAt;
  if (data.status !== undefined) {
    if (user.role === "advisor") throw new Error("TASK_STATUS_FORBIDDEN");
    if (!["TODO", "CANCELLED"].includes(data.status)) throw new Error("INVALID_TASK_STATUS");
    updates.status = data.status;
  }
  if (data.advisorId !== undefined) {
    if (!['brokerageAdmin', 'platformAdmin'].includes(user.role)) throw new Error("TASK_REASSIGN_FORBIDDEN");
    updates.advisorId = await validateAdvisor(data.advisorId, task.brokerageId);
  }
  Object.assign(task, updates);
  if (updates.status === "TODO") task.completedAt = undefined;
  await task.save();
  const result = withOverdue(task);
  emitTaskUpdated(task.brokerageId, { task: result });
  return result;
}

export async function completeTask(user, taskId) {
  assertId(taskId);
  const task = await Task.findOneAndUpdate(
    { _id: taskId, ...taskScope(user), status: "TODO" },
    { $set: { status: "COMPLETED", completedAt: new Date() } },
    { new: true },
  );
  if (!task) return null;
  const result = withOverdue(task);
  emitTaskUpdated(task.brokerageId, { task: result });
  return result;
}

export async function createTasksForStage(lead) {
  if (!lead.assignedAdvisorId) return;
  const triggers = await TaskTrigger.find({ brokerageId: lead.brokerageId, stage: lead.status, isActive: true });
  for (const trigger of triggers) {
    try {
      const task = await Task.create({
        brokerageId: lead.brokerageId,
        leadId: lead._id,
        advisorId: lead.assignedAdvisorId,
        triggerId: trigger._id,
        title: trigger.title,
        description: trigger.description,
        status: "TODO",
        dueAt: new Date(Date.now() + trigger.dueInMinutes * 60 * 1000),
        sourceStage: lead.status,
      });
      emitTaskUpdated(task.brokerageId, { task: withOverdue(task) });
    } catch (error) {
      if (error.code !== 11000) console.error("Task trigger creation failed:", error.message);
    }
  }
}
