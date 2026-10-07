import api from "./api.js";

const path = (brokerageId) => `/brokerages/${brokerageId}/task-triggers`;
export async function listTaskTriggers(brokerageId) { return (await api.get(path(brokerageId))).data.triggers; }
export async function createTaskTrigger({ brokerageId, data }) { return (await api.post(path(brokerageId), data)).data.trigger; }
export async function updateTaskTrigger({ brokerageId, triggerId, data }) { return (await api.patch(`${path(brokerageId)}/${triggerId}`, data)).data.trigger; }
export async function deleteTaskTrigger({ brokerageId, triggerId }) { await api.delete(`${path(brokerageId)}/${triggerId}`); }
