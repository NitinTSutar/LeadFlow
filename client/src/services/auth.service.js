import api from "./api.js";

export async function login(credentials) { return (await api.post("/auth/login", credentials)).data.user; }
export async function logout() { await api.post("/auth/logout"); }
export async function getCurrentUser() { return (await api.get("/auth/me")).data.user; }
