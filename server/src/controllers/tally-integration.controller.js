import { createTallyIntegration, deactivateTallyIntegration, listTallyIntegrations, updateTallyIntegration } from "../services/tally-integration.service.js";

function validFormId(formId) { return typeof formId === "string" && formId.trim().length > 0; }

function handleError(error, res) {
  if (["INVALID_BROKERAGE_ID", "INVALID_INTEGRATION_ID"].includes(error.message)) return res.status(400).json({ message: "Invalid ID." });
  if (error.message === "BROKERAGE_NOT_FOUND") return res.status(404).json({ message: "Brokerage not found." });
  if (error.code === 11000) return res.status(409).json({ message: "That Tally form is already mapped to a brokerage." });
  if (error.name === "ValidationError") return res.status(400).json({ message: "Tally integration validation failed." });
  throw error;
}

export async function list(req, res) { try { return res.json({ integrations: await listTallyIntegrations(req.params.id) }); } catch (error) { return handleError(error, res); } }
export async function create(req, res) { const { formId } = req.body || {}; if (!validFormId(formId)) return res.status(400).json({ message: "formId is required." }); try { return res.status(201).json({ integration: await createTallyIntegration(req.params.id, formId) }); } catch (error) { return handleError(error, res); } }
export async function update(req, res) { const { formId, active } = req.body || {}; if (formId !== undefined && !validFormId(formId)) return res.status(400).json({ message: "formId must not be empty." }); if (active !== undefined && typeof active !== "boolean") return res.status(400).json({ message: "active must be boolean." }); try { const integration = await updateTallyIntegration(req.params.id, req.params.integrationId, { formId, active }); if (!integration) return res.status(404).json({ message: "Tally integration not found." }); return res.json({ integration }); } catch (error) { return handleError(error, res); } }
export async function remove(req, res) { try { const integration = await deactivateTallyIntegration(req.params.id, req.params.integrationId); if (!integration) return res.status(404).json({ message: "Tally integration not found." }); return res.status(204).send(); } catch (error) { return handleError(error, res); } }
