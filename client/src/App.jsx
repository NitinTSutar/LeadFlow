import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store.js";
import LoadingState from "./components/LoadingState.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => { initialize(); }, [initialize]);

  if (!isInitialized) return <LoadingState label="Checking your session…" />;
  return <AppRoutes />;
}
