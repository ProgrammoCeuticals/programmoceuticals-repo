"use client";

import { useState } from "react";
import { useApplications } from "@/lib/api/queries";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { NewApplicationModal } from "@/components/domain/applications/NewApplicationModal";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { RegulatoryApplication } from "@/lib/api/client";

export default function ApplicationsPage() {
  const { data, isLoading, isError, refetch } = useApplications();
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const router = useRouter();

  const filtered = (data?.data ?? []).filter((app) => {
    const q = search.toLowerCase();
    return (
      !q ||
      app.applicationNumber?.toLowerCase().includes(q) ||
      app.applicationType?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <Breadcrumbs segments={[{ label: "Applications" }]} className="mb-4" />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Applications</h1>
        <Button onClick={() => setShowNew(true)}>+ New Application</Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search applications…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          aria-label="Search applications"
        />
      </div>

      {isLoading && <LoadingSkeleton rows={4} />}

      {isError && (
        <ErrorState
          message="Could not load applications."
          onRetry={() => void refetch()}
        />
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState
          title="No applications yet"
          description="Create your first regulatory application to begin."
          action={{ label: "Create Application", onClick: () => setShowNew(true) }}
        />
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              onOpen={() => router.push(`/applications/${app.id}`)}
            />
          ))}
        </div>
      )}

      <NewApplicationModal
        open={showNew}
        onClose={() => setShowNew(false)}
        onCreated={(id) => router.push(`/applications/${id}`)}
      />
    </>
  );
}

function ApplicationCard({
  app,
  onOpen,
}: {
  app: RegulatoryApplication;
  onOpen: () => void;
}) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-gray-900 leading-snug">
            {app.applicationNumber ?? "—"}
          </p>
          <StatusBadge status={app.status} />
        </div>
        {app.applicationType && (
          <p className="text-xs text-gray-500">{app.applicationType}</p>
        )}
        <p className="text-xs text-gray-400">ID: {app.uuid}</p>
      </div>
      <Button variant="secondary" size="sm" onClick={onOpen} className="w-full">
        Open Application
      </Button>
    </div>
  );
}
