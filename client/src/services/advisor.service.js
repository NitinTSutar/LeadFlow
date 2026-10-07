import api from "./api.js";

const path = (brokerageId) => `/brokerages/${brokerageId}/advisors`;
export async function listAdvisors(brokerageId) { return (await api.get(path(brokerageId))).data.advisors; }
export async function createAdvisor({ brokerageId, data }) { return (await api.post(path(brokerageId), data)).data.advisor; }
export async function updateAdvisor({ brokerageId, advisorId, data }) { return (await api.patch(`${path(brokerageId)}/${advisorId}`, data)).data.advisor; }
export async function listAvailableAdvisors(brokerageId) {
  return (await api.get(`${path(brokerageId)}/available`)).data.advisors;
}
