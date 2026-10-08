import mongoose from "mongoose";
import Brokerage from "../models/brokerage.model.js";
import TallyIntegration from "../models/tally-integration.model.js";

function assertId(value, name) {
  if (!mongoose.isValidObjectId(value)) throw new Error(`INVALID_${name.toUpperCase()}_ID`);
}

async function assertBrokerage(brokerageId) {
  assertId(brokerageId, "brokerage");
  if (!await Brokerage.exists({ _id: brokerageId })) throw new Error("BROKERAGE_NOT_FOUND");
}

function safeIntegration(integration) {
  return {
    id: integration._id.toString(),
    formId: integration.formId,
    brokerageId: integration.brokerageId.toString(),
    active: integration.active,
    createdAt: integration.createdAt,
    updatedAt: integration.updatedAt,
  };
}

export async function listTallyIntegrations(brokerageId) {
  await assertBrokerage(brokerageId);
  const integrations = await TallyIntegration.find({ brokerageId }).sort({ createdAt: -1 });
  return integrations.map(safeIntegration);
}

export async function createTallyIntegration(brokerageId, formId) {
  await assertBrokerage(brokerageId);
  const integration = await TallyIntegration.create({ brokerageId, formId: formId.trim(), active: true });
  return safeIntegration(integration);
}

export async function updateTallyIntegration(brokerageId, integrationId, data) {
  await assertBrokerage(brokerageId);
  assertId(integrationId, "integration");
  const integration = await TallyIntegration.findOne({ _id: integrationId, brokerageId });
  if (!integration) return null;
  if (data.formId !== undefined) integration.formId = data.formId.trim();
  if (data.active !== undefined) integration.active = data.active;
  await integration.save();
  return safeIntegration(integration);
}

export async function deactivateTallyIntegration(brokerageId, integrationId) {
  return updateTallyIntegration(brokerageId, integrationId, { active: false });
}
