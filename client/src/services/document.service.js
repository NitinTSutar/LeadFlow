import api from "./api.js";

export async function listClientDocuments() { return (await api.get("/client/documents")).data.documents; }
export async function listLeadDocuments(leadId) { return (await api.get(`/leads/${leadId}/documents`)).data.documents; }
export async function getClientDocument(id) { return (await api.get(`/client/documents/${id}`)).data.document; }
export async function uploadClientDocument(file) { const form = new FormData(); form.append("file", file); return (await api.post("/client/documents", form)).data.document; }
