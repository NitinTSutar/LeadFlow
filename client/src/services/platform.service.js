import api from "./api.js";

const brokeragePath = (id) => `/brokerages/${id}`;
export async function getPlatformDashboard() { return (await api.get("/platform/dashboard")).data; }
export async function listBrokerages() { return (await api.get("/brokerages")).data.brokerages; }
export async function createBrokerage(name) { return (await api.post("/brokerages", { name })).data.brokerage; }
export async function updateBrokerage({ id, name }) { return (await api.patch(brokeragePath(id), { name })).data.brokerage; }
export async function deleteBrokerage(id) { await api.delete(brokeragePath(id)); }
export async function listBrokerageAdmins(id) { return (await api.get(`${brokeragePath(id)}/admins`)).data.admins; }
export async function createBrokerageAdmin({ brokerageId, data }) { return (await api.post(`${brokeragePath(brokerageId)}/admins`, data)).data.user; }
export async function updateBrokerageAdmin({ brokerageId, adminId, data }) { return (await api.patch(`${brokeragePath(brokerageId)}/admins/${adminId}`, data)).data.user; }
export async function deleteBrokerageAdmin({ brokerageId, adminId }) { await api.delete(`${brokeragePath(brokerageId)}/admins/${adminId}`); }
