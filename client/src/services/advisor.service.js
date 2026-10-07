import api from "./api.js";

export async function listAvailableAdvisors(brokerageId) {
  return (await api.get(`/brokerages/${brokerageId}/advisors/available`)).data.advisors;
}
