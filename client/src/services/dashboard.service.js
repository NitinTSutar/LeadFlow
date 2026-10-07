import api from "./api.js";

export async function getPipelineCounts() { return (await api.get("/dashboard/pipeline")).data; }
