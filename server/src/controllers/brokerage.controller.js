import {
  createBrokerage,
  createBrokerageAdmin,
  deleteBrokerage,
  deleteBrokerageAdmin,
  getBrokerage,
  listBrokerageAdmins,
  listBrokerages,
  updateBrokerageAdmin,
  updateBrokerage,
} from "../services/brokerage.service.js";

function validateName(name) {
  return typeof name === "string" && name.trim().length >= 2 && name.trim().length <= 120;
}

function handleError(error, res) {
  if (error.message === "INVALID_BROKERAGE_ID") return res.status(400).json({ message: "Invalid brokerage ID." });
  if (error.message === "BROKERAGE_NOT_FOUND") return res.status(404).json({ message: "Brokerage not found." });
  if (error.message === "BROKERAGE_HAS_DATA") return res.status(409).json({ message: "This brokerage cannot be deleted while it has associated users or leads." });
  if (error.message === "BROKERAGE_NAME_EXISTS" || error.code === 11000) {
    return res.status(409).json({ message: "A brokerage with that name already exists." });
  }
  if (error.name === "ValidationError") return res.status(400).json({ message: "Brokerage validation failed." });
  throw error;
}

export async function create(req, res) {
  const { name } = req.body || {};
  if (!validateName(name)) return res.status(400).json({ message: "Name must be between 2 and 120 characters." });
  try {
    return res.status(201).json({ brokerage: await createBrokerage(name) });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function list(req, res) {
  return res.json({ brokerages: await listBrokerages() });
}

export async function detail(req, res) {
  try {
    const brokerage = await getBrokerage(req.params.id);
    if (!brokerage) return res.status(404).json({ message: "Brokerage not found." });
    return res.json({ brokerage });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function update(req, res) {
  const { name } = req.body || {};
  if (!validateName(name)) return res.status(400).json({ message: "Name must be between 2 and 120 characters." });
  try {
    const brokerage = await updateBrokerage(req.params.id, name);
    if (!brokerage) return res.status(404).json({ message: "Brokerage not found." });
    return res.json({ brokerage });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function createAdmin(req, res) {
  const { name, email, password } = req.body || {};
  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof password !== "string" || !password
  ) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  try {
    const user = await createBrokerageAdmin(req.params.id, { name, email, password });
    return res.status(201).json({ user });
  } catch (error) {
    if (error.message === "BROKERAGE_NOT_FOUND") return res.status(404).json({ message: "Brokerage not found." });
    if (error.message === "INVALID_BROKERAGE_ID") return res.status(400).json({ message: "Invalid brokerage ID." });
    if (error.code === 11000) return res.status(409).json({ message: "A user with that email already exists." });
    if (error.name === "ValidationError") return res.status(400).json({ message: "User validation failed." });
    throw error;
  }
}

export async function listAdmins(req, res) {
  try { return res.json({ admins: await listBrokerageAdmins(req.params.id) }); }
  catch (error) {
    if (error.message === "INVALID_BROKERAGE_ID") return res.status(400).json({ message: "Invalid brokerage ID." });
    if (error.message === "BROKERAGE_NOT_FOUND") return res.status(404).json({ message: "Brokerage not found." });
    throw error;
  }
}

export async function updateAdmin(req, res) {
  const { name, email, password, isActive } = req.body || {};
  if (name !== undefined && (!validateName(name))) return res.status(400).json({ message: "Name must be between 2 and 120 characters." });
  if (email !== undefined && (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim()))) return res.status(400).json({ message: "A valid email is required." });
  if (password !== undefined && (typeof password !== "string" || password.length < 8)) return res.status(400).json({ message: "Password must be at least 8 characters." });
  if (isActive !== undefined && typeof isActive !== "boolean") return res.status(400).json({ message: "isActive must be boolean." });
  try { return res.json({ user: await updateBrokerageAdmin(req.params.id, req.params.adminId, { name, email, password, isActive }) }); }
  catch (error) {
    if (["INVALID_BROKERAGE_ID", "INVALID_ADMIN_ID"].includes(error.message)) return res.status(400).json({ message: "Invalid ID." });
    if (error.message === "BROKERAGE_NOT_FOUND" || error.message === "ADMIN_NOT_FOUND") return res.status(404).json({ message: "Resource not found." });
    if (error.code === 11000) return res.status(409).json({ message: "A user with that email already exists." });
    if (error.name === "ValidationError") return res.status(400).json({ message: "User validation failed." });
    throw error;
  }
}

export async function removeAdmin(req, res) {
  try { await deleteBrokerageAdmin(req.params.id, req.params.adminId); return res.status(204).send(); }
  catch (error) {
    if (["INVALID_BROKERAGE_ID", "INVALID_ADMIN_ID"].includes(error.message)) return res.status(400).json({ message: "Invalid ID." });
    if (error.message === "BROKERAGE_NOT_FOUND" || error.message === "ADMIN_NOT_FOUND") return res.status(404).json({ message: "Resource not found." });
    throw error;
  }
}

export async function remove(req, res) {
  try { const brokerage = await deleteBrokerage(req.params.id); if (!brokerage) return res.status(404).json({ message: "Brokerage not found." }); return res.status(204).send(); }
  catch (error) { return handleError(error, res); }
}
