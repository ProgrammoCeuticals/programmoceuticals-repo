"use client";

import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { ToastContainer } from "@/components/ui/Toast";

interface AppShellProps {
  children: React.ReactNode;
  applicationId?: string | undefined;
  applicationName?: string | undefined;
}

export function AppShell({ children, applicationId, applicationName }: AppShellProps) {
  return (
    <>
      <TopBar />
      <Sidebar
        applicationId={applicationId ?? undefined}
        applicationName={applicationName ?? undefined}
      />
      <main
        className="min-h-screen pt-14"
        style={{ paddingLeft: "var(--sidebar-width)" }}
      >
        <div className="p-6">{children}</div>
      </main>
      <ToastContainer />
    </>
  );
}
