import { io } from "socket.io-client";

let socket;

function getSocketOrigin() {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (!configured) return window.location.origin;
  if (configured.startsWith("/")) return window.location.origin;
  return configured.replace(/\/api\/?$/, "");
}

function documentId(payload) { return payload?.document?._id || payload?.document?.id || payload?.documentId; }
function leadId(payload) { return payload?.lead?._id || payload?.lead?.id || payload?.leadId; }

export function connectRealtime(queryClient) {
  if (!socket) {
    socket = io(getSocketOrigin(), { withCredentials: true, autoConnect: false });
    socket.on("lead:updated", (payload) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "pipeline"] });
      const id = leadId(payload);
      if (id) queryClient.invalidateQueries({ queryKey: ["lead", id] });
    });
    socket.on("document:updated", (payload) => {
      queryClient.invalidateQueries({ queryKey: ["client", "documents"] });
      const id = documentId(payload);
      if (id) queryClient.invalidateQueries({ queryKey: ["client", "document", id] });
    });
    socket.on("connect", () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "pipeline"] });
      queryClient.invalidateQueries({ queryKey: ["client", "documents"] });
    });
  }
  if (!socket.connected) socket.connect();
  return socket;
}

export function disconnectRealtime() {
  if (socket) socket.disconnect();
}

export function getRealtimeSocket() { return socket; }
