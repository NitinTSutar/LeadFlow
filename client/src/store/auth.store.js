import { create } from "zustand";
import { getCurrentUser, login, logout } from "../services/auth.service.js";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  initialize: async () => {
    set({ isLoading: true });
    try { const user = await getCurrentUser(); set({ user, isAuthenticated: true }); }
    catch { set({ user: null, isAuthenticated: false }); }
    finally { set({ isLoading: false, isInitialized: true }); }
  },
  signIn: async (credentials) => { const user = await login(credentials); set({ user, isAuthenticated: true }); return user; },
  signOut: async () => { try { await logout(); } finally { set({ user: null, isAuthenticated: false }); } },
}));
