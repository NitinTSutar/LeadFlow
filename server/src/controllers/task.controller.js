import { completeTask, getTask, listTasks, updateTask } from "../services/task.service.js";

function handle(error, res) {
  if (["INVALID_TASK_ID", "INVALID_ADVISOR_ID"].includes(error.message)) return res.status(400).json({ message: "Invalid ID." });
  if (["INVALID_TASK_STATUS"].includes(error.message)) return res.status(400).json({ message: "Invalid task status." });
  if (["TASK_STATUS_FORBIDDEN", "TASK_REASSIGN_FORBIDDEN", "INVALID_ADVISOR"].includes(error.message)) return res.status(403).json({ message: "Task operation is not permitted." });
  if (error.name === "ValidationError") return res.status(400).json({ message: "Task validation failed." });
  throw error;
}
export async function list(req, res) { return res.json({ tasks: await listTasks(req.user, req.query) }); }
export async function detail(req, res) { try { const task = await getTask(req.user, req.params.id); if (!task) return res.status(404).json({ message: "Task not found." }); return res.json({ task }); } catch (error) { return handle(error, res); } }
export async function update(req, res) { try { const task = await updateTask(req.user, req.params.id, req.body || {}); if (!task) return res.status(404).json({ message: "Task not found." }); return res.json({ task }); } catch (error) { return handle(error, res); } }
export async function complete(req, res) { try { const task = await completeTask(req.user, req.params.id); if (!task) return res.status(404).json({ message: "Task not found or already completed." }); return res.json({ task }); } catch (error) { return handle(error, res); } }
