import api from "./api.js";

export async function listTasks(status) { return (await api.get("/tasks", { params: status ? { status } : undefined })).data.tasks; }
export async function getTask(id) { return (await api.get(`/tasks/${id}`)).data.task; }
export async function updateTask(id, data) { return (await api.patch(`/tasks/${id}`, data)).data.task; }
export async function completeTask(id) { return (await api.patch(`/tasks/${id}/complete`)).data.task; }
