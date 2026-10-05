import { createAdvisor, getAdvisor, listAdvisors, updateAdvisor } from "../services/advisor.service.js";

function validName(value) { return typeof value === "string" && value.trim().length >= 2 && value.trim().length <= 120; }
function validEmail(value) { return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()); }
function handleError(error, res) {
  if (error.message === "INVALID_BROKERAGE_ID" || error.message === "INVALID_ADVISOR_ID") return res.status(400).json({ message: "Invalid ID." });
  if (error.message === "BROKERAGE_FORBIDDEN") return res.status(403).json({ message: "Brokerage access denied." });
  if (error.message === "BROKERAGE_NOT_FOUND" || error.message === "ADVISOR_NOT_FOUND") return res.status(404).json({ message: "Resource not found." });
  if (error.code === 11000) return res.status(409).json({ message: "A user with that email already exists." });
  if (error.name === "ValidationError") return res.status(400).json({ message: "Advisor validation failed." });
  throw error;
}

export async function create(req, res) {
  const { name, email, password } = req.body || {};
  if (!validName(name) || !validEmail(email) || typeof password !== "string" || password.length < 8) return res.status(400).json({ message: "Valid name, email, and password of at least 8 characters are required." });
  try { return res.status(201).json({ advisor: await createAdvisor(req.user, req.params.id, { name, email, password }) }); } catch (error) { return handleError(error, res); }
}

export async function list(req, res) {
  try { return res.json({ advisors: await listAdvisors(req.user, req.params.id) }); } catch (error) { return handleError(error, res); }
}

export async function available(req, res) {
  try { return res.json({ advisors: await listAdvisors(req.user, req.params.id, true) }); } catch (error) { return handleError(error, res); }
}

export async function detail(req, res) {
  try { return res.json({ advisor: await getAdvisor(req.user, req.params.id, req.params.advisorId) }); } catch (error) { return handleError(error, res); }
}

export async function update(req, res) {
  const { name, email, password, isActive } = req.body || {};
  if (name !== undefined && !validName(name)) return res.status(400).json({ message: "Name must be between 2 and 120 characters." });
  if (email !== undefined && !validEmail(email)) return res.status(400).json({ message: "A valid email is required." });
  if (password !== undefined && (typeof password !== "string" || password.length < 8)) return res.status(400).json({ message: "Password must be at least 8 characters." });
  if (isActive !== undefined && typeof isActive !== "boolean") return res.status(400).json({ message: "isActive must be boolean." });
  try { return res.json({ advisor: await updateAdvisor(req.user, req.params.id, req.params.advisorId, { name, email, password, isActive }) }); } catch (error) { return handleError(error, res); }
}
