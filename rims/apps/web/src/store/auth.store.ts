import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ScopeAssignment } from "@rims/shared-types";

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  permissions: string[];
  scopes: ScopeAssignment[];
  setAuth: (
    user: AuthUser,
    token: string,
    permissions: string[],
    scopes?: ScopeAssignment[],
  ) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
  hasPermission: (code: string) => boolean;
  // Computed scope helpers
  isInstitutionWide: boolean;
  departmentIds: string[];
  teamIds: string[];
  projectIds: string[];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      permissions: [],
      scopes: [],
      isAuthenticated: false,
      get isInstitutionWide() {
        return get().scopes.some((s) => s.scopeType === "INSTITUTION");
      },
      get departmentIds() {
        return get()
          .scopes.filter((s) => s.scopeType === "DEPARTMENT" && s.scopeId)
          .map((s) => s.scopeId!);
      },
      get teamIds() {
        return get()
          .scopes.filter((s) => s.scopeType === "TEAM" && s.scopeId)
          .map((s) => s.scopeId!);
      },
      get projectIds() {
        return get()
          .scopes.filter((s) => s.scopeType === "PROJECT" && s.scopeId)
          .map((s) => s.scopeId!);
      },
      setAuth: (user, accessToken, permissions, scopes = []) =>
        set({ user, accessToken, permissions, scopes, isAuthenticated: true }),
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          permissions: [],
          scopes: [],
          isAuthenticated: false,
        }),
      hasPermission: (code: string) => get().permissions.includes(code),
    }),
    { name: "rims-auth" },
  ),
);
