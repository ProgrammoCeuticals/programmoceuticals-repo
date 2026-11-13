import { create } from "zustand";
import {
  authApi,
  setTokens,
  clearTokens,
  hasSession,
  type CurrentUser,
  type AuthTokens,
} from "@/lib/api/client";

interface AuthState {
  user: CurrentUser | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",

  login: async (email, password) => {
    set({ status: "loading" });
    try {
      const tokens: AuthTokens = await authApi.login(email, password);
      setTokens(tokens);
      const user = await authApi.me();
      set({ user, status: "authenticated" });
    } catch (err) {
      set({ status: "unauthenticated" });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      clearTokens();
      set({ user: null, status: "unauthenticated" });
    }
  },

  restoreSession: async () => {
    if (!hasSession()) {
      set({ status: "unauthenticated" });
      return;
    }
    set({ status: "loading" });
    try {
      const user = await authApi.me();
      set({ user, status: "authenticated" });
    } catch {
      clearTokens();
      set({ user: null, status: "unauthenticated" });
    }
  },
}));
