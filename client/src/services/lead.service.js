import api from "./api.js";

export async function listLeads() { return (await api.get("/leads", { params: { limit: 100 } })).data; }
export async function getLead(id) { return (await api.get(`/leads/${id}`)).data.lead; }
export async function createLead(data) { return (await api.post("/leads", data)).data.lead; }
export async function updateLead(id, data) { return (await api.patch(`/leads/${id}`, data)).data.lead; }
export async function updateLeadStatus(id, status, version) { return (await api.patch(`/leads/${id}/status`, { status, version })).data; }
export async function convertLeadToClient(id, password) { return (await api.post(`/leads/${id}/convert-to-client`, { password })).data; }
