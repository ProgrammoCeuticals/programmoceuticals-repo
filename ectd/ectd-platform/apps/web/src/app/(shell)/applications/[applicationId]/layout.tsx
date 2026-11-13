"use client";

import { use } from "react";
import { useApplication } from "@/lib/api/queries";
import { AppShell } from "@/components/shell/AppShell";
import { LoadingSkeleton } from "@/components/ui/States";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";

export default function ApplicationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = use(params);
  const { isLoading: authLoading } = useRequireAuth();
  const { data: app, isLoading: appLoading } = useApplication(applicationId);

  if (authLoading || appLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-64">
          <LoadingSkeleton rows={3} />
        </div>
      </div>
    );
  }

  return (
    <AppShell
      applicationId={applicationId}
      applicationName={app?.applicationNumber ?? undefined}
    >
      {children}
    </AppShell>
  );
}
