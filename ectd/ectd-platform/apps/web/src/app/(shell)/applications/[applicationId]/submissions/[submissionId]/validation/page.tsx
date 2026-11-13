"use client";

import { use, useState } from "react";
import {
  useSubmission,
  useSubmissionUnits,
  useApplication,
  useValidationProfiles,
  useTriggerValidation,
} from "@/lib/api/queries";
import { ValidationRunPanel } from "@/components/domain/validation/ValidationRunPanel";
import { ValidationBadge } from "@/components/ui/ValidationBadge";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/components/ui/States";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { ApiClientError } from "@/lib/api/client";
import { cn } from "@/lib/cn";

export default function ValidationPage({
  params,
}: {
  params: Promise<{ applicationId: string; submissionId: string }>;
}) {
  const { applicationId, submissionId } = use(params);
  const { data: app } = useApplication(applicationId);
  const { data: submission, isLoading, isError } = useSubmission(submissionId);
  const { data: units } = useSubmissionUnits(submissionId);
  const { data: profiles } = useValidationProfiles();

  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  // Map unitId → latest runId so we can show results per unit
  const [runIds, setRunIds] = useState<Record<string, string>>({});

  const { mutateAsync: triggerRun, isPending } = useTriggerValidation();

  const activeUnitId = selectedUnitId ?? units?.[0]?.id ?? null;
  const activeRunId = activeUnitId ? (runIds[activeUnitId] ?? null) : null;

  const handleTrigger = async () => {
    if (!activeUnitId || !selectedProfileId) return;
    try {
      const result = await triggerRun({
        submissionUnitId: activeUnitId,
        validationProfileId: selectedProfileId,
      });
      setRunIds((prev) => ({ ...prev, [activeUnitId]: result.validationRunId }));
      toast.success("Validation started.");
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : "Failed to start validation.";
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
          { label: "Validation" },
        ]}
        className="mb-4"
      />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Validation</h1>
      </div>

      <div className="flex gap-6">
        {/* Left: unit selector */}
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
                  onClick={() => setSelectedUnitId(unit.id)}
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
                  <ValidationBadge
                    state={runIds[unit.id] ? "RUNNING" : "NOT_RUN"}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: controls + results */}
        <div className="flex-1 space-y-4">
          {/* Trigger bar */}
          <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
            <div className="flex-1 min-w-48">
              <label
                htmlFor="validation-profile"
                className="mb-1 block text-xs font-medium text-gray-700"
              >
                Validation Profile
              </label>
              <select
                id="validation-profile"
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">Select a profile…</option>
                {(profiles ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} v{p.version}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={() => void handleTrigger()}
              disabled={!activeUnitId || !selectedProfileId}
              loading={isPending}
            >
              Run Validation
            </Button>
          </div>

          {/* Results */}
          {!activeRunId && (
            <EmptyState
              title="No validation run yet"
              description="Select a profile and run validation to see results."
            />
          )}
          {activeRunId && <ValidationRunPanel runId={activeRunId} />}
        </div>
      </div>
    </>
  );
}
