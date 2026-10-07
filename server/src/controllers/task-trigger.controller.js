import { createTrigger, deleteTrigger, listTriggers, updateTrigger, validateTriggerData } from "../services/task-trigger.service.js";

function handle(error, res) {
  if (["INVALID_BROKERAGE_ID", "INVALID_TRIGGER_ID"].includes(error.message)) return res.status(400).json({ message: "Invalid ID." });
  if (error.message === "BROKERAGE_FORBIDDEN") return res.status(403).json({ message: "Brokerage access denied." });
  if (error.message === "DUPLICATE_TRIGGER" || error.code === 11000) return res.status(409).json({ message: "An identical active task trigger already exists for this brokerage and stage." });
  if (["BROKERAGE_NOT_FOUND", "TRIGGER_NOT_FOUND"].includes(error.message)) return res.status(404).json({ message: "Resource not found." });
  if (["INVALID_STAGE", "INVALID_TITLE", "INVALID_DUE_TIME"].includes(error.message) || error.name === "ValidationError") return res.status(400).json({ message: "Invalid task trigger." });
  throw error;
}

function bodyData(body, partial = false) {
  const data = {};
  for (const key of ["stage", "title", "description", "isActive"]) if (body[key] !== undefined) data[key] = body[key];
  if (body.dueInMinutes !== undefined) data.dueInMinutes = Number(body.dueInMinutes);
  if (!partial && data.isActive === undefined) data.isActive = true;
  return data;
}

export async function create(req, res) {
  try { const data = bodyData(req.body || {}); validateTriggerData(data); return res.status(201).json({ trigger: await createTrigger(req.user, req.params.id, data) }); } catch (error) { return handle(error, res); }
}
export async function list(req, res) { try { return res.json({ triggers: await listTriggers(req.user, req.params.id) }); } catch (error) { return handle(error, res); } }
export async function update(req, res) {
  try { const data = bodyData(req.body || {}, true); validateTriggerData(data, true); return res.json({ trigger: await updateTrigger(req.user, req.params.id, req.params.triggerId, data) }); } catch (error) { return handle(error, res); }
}
export async function remove(req, res) { try { await deleteTrigger(req.user, req.params.id, req.params.triggerId); return res.status(204).send(); } catch (error) { return handle(error, res); } }
