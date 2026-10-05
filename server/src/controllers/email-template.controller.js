import { createTemplate, deleteTemplate, getTemplate, listTemplates, updateTemplate, validateTemplate } from "../services/email-template.service.js";

function handle(error, res) {
  if (["INVALID_BROKERAGE_ID", "INVALID_TEMPLATE_ID"].includes(error.message)) return res.status(400).json({ message: "Invalid ID." });
  if (error.message === "BROKERAGE_FORBIDDEN") return res.status(403).json({ message: "Brokerage access denied." });
  if (["BROKERAGE_NOT_FOUND", "TEMPLATE_NOT_FOUND"].includes(error.message)) return res.status(404).json({ message: "Resource not found." });
  if (error.code === 11000) return res.status(409).json({ message: "An active template already exists for that stage." });
  if (["INVALID_NAME", "INVALID_SUBJECT", "INVALID_BODY", "INVALID_STAGE"].includes(error.message) || error.name === "ValidationError") return res.status(400).json({ message: "Invalid email template." });
  throw error;
}
export async function create(req, res) { try { const data = req.body || {}; validateTemplate(data); return res.status(201).json({ template: await createTemplate(req.user, req.params.id, data) }); } catch (error) { return handle(error, res); } }
export async function list(req, res) { try { return res.json({ templates: await listTemplates(req.user, req.params.id) }); } catch (error) { return handle(error, res); } }
export async function detail(req, res) { try { return res.json({ template: await getTemplate(req.user, req.params.id, req.params.templateId) }); } catch (error) { return handle(error, res); } }
export async function update(req, res) { try { const data = req.body || {}; validateTemplate(data, true); return res.json({ template: await updateTemplate(req.user, req.params.id, req.params.templateId, data) }); } catch (error) { return handle(error, res); } }
export async function remove(req, res) { try { await deleteTemplate(req.user, req.params.id, req.params.templateId); return res.status(204).send(); } catch (error) { return handle(error, res); } }
