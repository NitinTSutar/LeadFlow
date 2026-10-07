import api from "./api.js";

const path = (brokerageId) => `/brokerages/${brokerageId}/email-templates`;
export async function listEmailTemplates(brokerageId) { return (await api.get(path(brokerageId))).data.templates; }
export async function createEmailTemplate({ brokerageId, data }) { return (await api.post(path(brokerageId), data)).data.template; }
export async function updateEmailTemplate({ brokerageId, templateId, data }) { return (await api.patch(`${path(brokerageId)}/${templateId}`, data)).data.template; }
export async function deleteEmailTemplate({ brokerageId, templateId }) { await api.delete(`${path(brokerageId)}/${templateId}`); }
