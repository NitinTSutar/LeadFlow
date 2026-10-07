import axios from "axios";

const configuredBackendUrl = import.meta.env.VITE_API_BASE_URL?.trim();
if (!configuredBackendUrl) {
  throw new Error("VITE_API_BASE_URL is required. Set it to the backend origin.");
}

export const backendOrigin = configuredBackendUrl.replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${backendOrigin}/api`,
  withCredentials: true,
});

export function getApiError(error) {
  if (error.response) return { status: error.response.status, message: error.response.data?.message || "Something went wrong." };
  return { status: 0, message: "Unable to reach the server. Check your connection and try again." };
}

export default api;
