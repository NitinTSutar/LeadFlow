import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export function getApiError(error) {
  if (error.response) return { status: error.response.status, message: error.response.data?.message || "Something went wrong." };
  return { status: 0, message: "Unable to reach the server. Check your connection and try again." };
}

export default api;
