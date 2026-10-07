import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store.js";
import LoadingState from "./components/LoadingState.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { connectRealtime, disconnectRealtime } from "./services/realtime.service.js";
import { useQueryClient } from "@tanstack/react-query";

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const queryClient = useQueryClient();

  useEffect(() => { initialize(); }, [initialize]);

  useEffect(() => {
    if (!isInitialized || !isAuthenticated) {
      disconnectRealtime();
      return undefined;
    }
    connectRealtime(queryClient);
    return disconnectRealtime;
  }, [isAuthenticated, isInitialized, queryClient]);

  if (!isInitialized) return <LoadingState label="Checking your session…" />;
  return <AppRoutes />;
}
