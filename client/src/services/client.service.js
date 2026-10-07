import api from "./api.js";

export async function getClientCase() { return (await api.get("/client/case")).data.case; }
