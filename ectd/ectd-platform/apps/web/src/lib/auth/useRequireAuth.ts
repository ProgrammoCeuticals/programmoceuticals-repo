"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./store";

/**
 * Call at the top of any protected page/layout.
 * Redirects to /login if the session cannot be restored.
 */
export function useRequireAuth() {
  const { status, user, restoreSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (status === "idle") {
      void restoreSession();
    }
  }, [status, restoreSession]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  return { user, isLoading: status === "idle" || status === "loading" };
}
