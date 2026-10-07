import api from "./api.js";

export async function getPipelineCounts(brokerageId) {
  return (await api.get("/dashboard/pipeline", { params: brokerageId ? { brokerageId } : undefined })).data;
}
