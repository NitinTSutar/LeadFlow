import { io } from "socket.io-client";
import { backendOrigin } from "./api.js";

let socket;

function documentId(payload) { return payload?.document?._id || payload?.document?.id || payload?.documentId; }
function leadId(payload) { return payload?.lead?._id || payload?.lead?.id || payload?.leadId; }

export function connectRealtime(queryClient) {
  if (!socket) {
    socket = io(backendOrigin, { withCredentials: true, autoConnect: false });
    socket.on("lead:updated", (payload) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "pipeline"] });
      queryClient.invalidateQueries({ queryKey: ["platform", "dashboard"] });
      const id = leadId(payload);
      if (id) queryClient.invalidateQueries({ queryKey: ["lead", id] });
    });
    socket.on("document:updated", (payload) => {
      queryClient.invalidateQueries({ queryKey: ["client", "documents"] });
      const id = documentId(payload);
      if (id) queryClient.invalidateQueries({ queryKey: ["client", "document", id] });
      const leadId = payload?.document?.leadId || payload?.leadId;
      if (leadId) queryClient.invalidateQueries({ queryKey: ["lead", leadId, "documents"] });
    });
    socket.on("task:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });
    socket.on("connect", () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "pipeline"] });
      queryClient.invalidateQueries({ queryKey: ["client", "documents"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });
  }
  if (!socket.connected) socket.connect();
  return socket;
}

export function disconnectRealtime() {
  if (socket) socket.disconnect();
}

export function getRealtimeSocket() { return socket; }
