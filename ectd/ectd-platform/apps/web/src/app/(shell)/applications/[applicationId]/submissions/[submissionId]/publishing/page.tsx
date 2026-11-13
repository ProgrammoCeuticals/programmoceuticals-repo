"use client";

import { use, useState } from "react";
import {
  useSubmission,
  useSubmissionUnits,
  useApplication,
  useSubmissionPackages,
  useFreezeUnit,
  usePublishUnit,
} from "@/lib/api/queries";
import { PublishGatePanel } from "@/components/domain/publishing/PublishGatePanel";
import { SubmissionPackageCard } from "@/components/domain/publishing/SubmissionPackageCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/components/ui/States";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { ApiClientError, type PreparePublicationResult } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import { Lock, FileCode, Send, CheckCircle } from "lucide-react";

export default function PublishingPage({
  params,
}: {
  params: Promise<{ applicationId: string; submissionId: string }>;
}) {
  const { applicationId, submissionId } = use(params);
  const { data: app } = useApplication(applicationId);
  const { data: submission, isLoading, isError } = useSubmission(submissionId);
  const { data: units } = useSubmissionUnits(submissionId);

  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [gateResult, setGateResult] = useState<PreparePublicationResult | null>(null);
  const [publishReason, setPublishReason] = useState("");

  const activeUnitId = selectedUnitId ?? units?.[0]?.id ?? null;

  const { data: packages, isLoading: loadingPkgs } = useSubmissionPackages(
    activeUnitId ?? "",
  );
  const { mutateAsync: freeze, isPending: freezing } = useFreezeUnit();
  const { mutateAsync: publish, isPending: publishing } = usePublishUnit();

  const handleFreeze = async () => {
    if (!activeUnitId) return;
    try {
      await freeze(activeUnitId);
      toast.success("Snapshot frozen. Unit is ready for validation and XML generation.");
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : "Freeze failed.";
      toast.error(msg);
    }
  };

  const handlePublish = async () => {
    if (!activeUnitId || !gateResult?.ready) return;
    try {
      await publish({
        submissionUnitId: activeUnitId,
        ...(publishReason ? { reason: publishReason } : {}),
      });
      toast.success("Publish job enqueued.");
      setGateResult(null);
      setPublishReason("");
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : "Publish failed.";
      toast.error(msg);
    }
  };

  if (isLoading) return <LoadingSkeleton rows={4} />;
  if (isError || !submission) return <ErrorState message="Could not load submission." />;

  return (
    <>
      <Breadcrumbs
        segments={[
          { label: "Applications", href: "/applications" },
          {
            label: app?.applicationNumber ?? applicationId,
            href: `/applications/${applicationId}`,
          },
          {
            label: "Submissions",
            href: `/applications/${applicationId}/submissions`,
          },
          {
            label: submission.submissionType ?? submission.id.slice(0, 8),
            href: `/applications/${applicationId}/submissions/${submissionId}`,
          },
          { label: "Publishing" },
        ]}
        className="mb-4"
      />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Publishing Pipeline</h1>
        <StatusBadge status={submission.status} />
      </div>

      <div className="flex gap-6">
        {/* Unit selector */}
        <div className="w-44 shrink-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Units
          </p>
          <ul className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            {(units ?? []).length === 0 && (
              <li className="p-3 text-xs text-gray-400">No units.</li>
            )}
            {(units ?? []).map((unit) => (
              <li key={unit.id} className="border-b border-gray-100 last:border-0">
                <button
                  onClick={() => {
                    setSelectedUnitId(unit.id);
                    setGateResult(null);
                  }}
                  className={cn(
                    "w-full px-3 py-2.5 text-left text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500",
                    activeUnitId === unit.id ? "bg-brand-50" : "hover:bg-gray-50",
                  )}
                  aria-pressed={activeUnitId === unit.id}
                >
                  <p className="font-mono text-xs font-medium text-gray-700">
                    Seq {String(unit.sequenceNumber).padStart(4, "0")}
                  </p>
                  <StatusBadge status={unit.status} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Pipeline + packages */}
        <div className="flex-1 space-y-6">
          {/* Pipeline steps */}
          <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
            {/* Step 1 — Freeze */}
            <PipelineStep
              icon={Lock}
              label="1. Freeze Snapshot"
              description="Creates an immutable snapshot of the current submission unit state. Required before validation and XML generation."
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={() => void handleFreeze()}
                loading={freezing}
                disabled={!activeUnitId}
              >
                Freeze
              </Button>
            </PipelineStep>

            {/* Step 2 — Generate XML */}
            <PipelineStep
              icon={FileCode}
              label="2. Generate XML"
              description="Enqueues XML generation from the frozen snapshot. Requires a valid frozen snapshot."
            >
              <Button
                variant="secondary"
                size="sm"
                disabled={!activeUnitId}
                onClick={() =>
                  toast.info("XML generation is handled by the publishing worker. Check package history below.")
                }
              >
                Generate XML
              </Button>
            </PipelineStep>

            {/* Step 3 — Publish gate */}
            <PipelineStep
              icon={CheckCircle}
              label="3. Publish Gate Check"
              description="Runs pre-publish readiness checks. All blocking issues must be resolved before publishing."
            >
              {activeUnitId && (
                <PublishGatePanel
                  submissionUnitId={activeUnitId}
                  onReady={setGateResult}
                />
              )}
            </PipelineStep>

            {/* Step 4 — Publish */}
            <PipelineStep
              icon={Send}
              label="4. Publish"
              description="Runs the full publication pipeline. Requires gate check to pass. This is not a status change — it invokes the publishing engine."
            >
              <div className="space-y-2">
                <input
                  type="text"
                  value={publishReason}
                  onChange={(e) => setPublishReason(e.target.value)}
                  placeholder="Reason / notes (optional)"
                  className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <Button
                  onClick={() => void handlePublish()}
                  loading={publishing}
                  disabled={!activeUnitId || !gateResult?.ready}
                >
                  Publish
                </Button>
                {gateResult && !gateResult.ready && (
                  <p className="text-xs text-red-600">
                    Resolve all blocking issues before publishing.
                  </p>
                )}
              </div>
            </PipelineStep>
          </div>

          {/* Package history */}
          <section aria-labelledby="packages-heading">
            <h2
              id="packages-heading"
              className="mb-3 text-sm font-semibold text-gray-700"
            >
              Package History
            </h2>
            {loadingPkgs && <LoadingSkeleton rows={2} />}
            {!loadingPkgs && (!packages?.data || packages.data.length === 0) && (
              <EmptyState
                title="No packages yet"
                description="Packages appear here after a successful publish run."
              />
            )}
            {!loadingPkgs && packages?.data && packages.data.length > 0 && (
              <div className="space-y-3">
                {packages.data.map((pkg) => (
                  <SubmissionPackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function PipelineStep({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 px-4 py-4">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-4 w-4 text-gray-500" aria-hidden="true" />
      </div>
      <div className="flex-1 space-y-2">
        <div>
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
