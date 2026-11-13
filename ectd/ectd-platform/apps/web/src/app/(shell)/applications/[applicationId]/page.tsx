"use client";

import { use } from "react";
import { useApplication, useApplicationSubmissions } from "@/lib/api/queries";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingSkeleton, ErrorState } from "@/components/ui/States";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { Submission } from "@/lib/api/client";

export default function ApplicationOverviewPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = use(params);
  const { data: app, isLoading, isError } = useApplication(applicationId);
  const { data: submissions, isLoading: loadingSubs } = useApplicationSubmissions(applicationId);
  const router = useRouter();

  if (isLoading) return <LoadingSkeleton rows={5} />;
  if (isError || !app) return <ErrorState message="Could not load application." />;

  const latestSubmission = submissions?.[submissions.length - 1];

  return (
    <>
      <Breadcrumbs
        segments={[
          { label: "Applications", href: "/applications" },
          { label: app.applicationNumber ?? app.id },
        ]}
        className="mb-4"
      />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {app.applicationNumber ?? "Untitled Application"}
          </h1>
          {app.applicationType && (
            <p className="mt-0.5 text-sm text-gray-500">{app.applicationType}</p>
          )}
        </div>
        <StatusBadge status={app.status} />
      </div>

      {/* Summary stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Submissions" value={submissions?.length ?? "—"} />
        <StatCard label="Latest Sequence" value={latestSubmission ? latestSubmission.id.slice(0, 8) : "—"} />
        <StatCard label="Status" value={app.status} />
        <StatCard label="Application ID" value={app.uuid.slice(0, 8) + "…"} mono />
      </div>

      {/* Submission timeline */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Submission Timeline</h2>
        {loadingSubs ? (
          <LoadingSkeleton rows={1} />
        ) : submissions && submissions.length > 0 ? (
          <SubmissionTimeline
            submissions={submissions}
            onOpen={(s) =>
              router.push(`/applications/${applicationId}/submissions/${s.id}`)
            }
          />
        ) : (
          <p className="text-sm text-gray-500">No submissions yet.</p>
        )}
      </section>

      {/* Current submission CTA */}
      {latestSubmission && (
        <div className="mb-8 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
          <div className="space-y-1">
            <p className="font-medium text-gray-900">
              Latest Submission
            </p>
            <StatusBadge status={latestSubmission.status} />
          </div>
          <Button
            onClick={() =>
              router.push(
                `/applications/${applicationId}/submissions/${latestSubmission.id}`,
              )
            }
          >
            Continue Working
          </Button>
        </div>
      )}

      {/* Application metadata */}
      <details className="rounded-lg border border-gray-200 bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Application Information
        </summary>
        <div className="space-y-2 border-t border-gray-100 px-4 py-3 text-sm">
          <MetaRow label="Application Number" value={app.applicationNumber} />
          <MetaRow label="Application Type" value={app.applicationType} />
          <MetaRow label="UUID" value={app.uuid} mono />
          <MetaRow label="eCTD Standard" value={app.ectdStandardId} mono />
          <MetaRow label="Regional Spec" value={app.regionalSpecificationId} mono />
          <MetaRow label="Created" value={new Date(app.createdAt).toLocaleString()} />
          <MetaRow label="Updated" value={new Date(app.updatedAt).toLocaleString()} />
        </div>
      </details>
    </>
  );
}

function StatCard({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | number;
  mono?: boolean | undefined;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 font-semibold text-gray-900 ${mono ? "font-mono text-sm" : "text-lg"}`}>
        {value}
      </p>
    </div>
  );
}

function SubmissionTimeline({
  submissions,
  onOpen,
}: {
  submissions: Submission[];
  onOpen: (s: Submission) => void;
}) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-2">
      {submissions.map((sub, i) => (
        <div key={sub.id} className="flex items-center">
          <button
            onClick={() => onOpen(sub)}
            className="flex flex-col items-center gap-1 rounded-md px-3 py-2 text-center hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <span className="h-3 w-3 rounded-full bg-brand-600" aria-hidden="true" />
            <span className="font-mono text-xs font-medium text-gray-700">
              {String(i).padStart(4, "0")}
            </span>
            <StatusBadge status={sub.status} />
          </button>
          {i < submissions.length - 1 && (
            <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}

function MetaRow({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null | undefined;
  mono?: boolean | undefined;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium text-gray-900 ${mono ? "font-mono text-xs" : ""}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}
