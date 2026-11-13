"use client";

import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { LoadingSkeleton } from "@/components/ui/States";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-64">
          <LoadingSkeleton rows={3} />
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
