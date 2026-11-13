"use client";

import { use, useState } from "react";
import {
  useApplication,
  useSubmission,
  useSubmissionUnits,
  useContextsOfUse,
  useCouLifecycle,
  useValidationRun,
  useReviewFindings,
  useReviewDecision,
  useSetReviewDecision,
} from "@/lib/api/queries";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ValidationBadge } from "@/components/ui/ValidationBadge";
import { LoadingSkeleton, ErrorState } from "@/components/ui/States";
import { ReviewChangeRow } from "@/components/domain/review/ReviewChangeRow";
import { ReviewFindingRow } from "@/components/domain/review/ReviewFindingRow";
import { ReviewDecisionPanel } from "@/components/domain/review/ReviewDecisionPanel";
import { cn } from "@/lib/cn";
import type { ReviewStatus, ContextOfUse, LifecycleOperation } from "@/lib/api/client";

type Tab = "changes" | "findings" | "decision";

export default function ReviewPage({
  params,
}: {
  params: Promise<{ applicationId: string; submissionId: string }>;
}) {
  const { applicationId, submissionId } = use(params);
  const { data: app } = useApplication(applicationId);
  const { data: submission, isLoading, isError } = useSubmission(submissionId);
  const { data: units } = useSubmissionUnits(submissionId);

  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("changes");

  const unitId = selectedUnitId ?? units?.[0]?.id ?? "";

  const { data: cous, isLoading: loadingCous } = useContextsOfUse(unitId);
  const { data: findings, isError: findingsGap } = useReviewFindings(unitId);
  const { data: decision, isError: decisionGap } = useReviewDecision(unitId);
  const setDecision = useSetReviewDecision();

  const isGap = findingsGap || decisionGap;
  const currentStatus: ReviewStatus = decision?.status ?? "NOT_REVIEWED";
  const blockingFindings =
    findings?.filter((f) => f.severity === "BLOCKING" && f.status === "OPEN")
      .length ?? 0;

  if (isLoading) return <LoadingSkeleton rows={4} />;
  if (isError || !submission) return <ErrorState message="Could not load submission." />;

  const tabs: { id: Tab; label: string }[] = [
    { id: "changes", label: "Changes" },
    { id: "findings", label: `Findings${findings ? ` (${findings.length})` : ""}` },
    { id: "decision", label: "Decision" },
  ];

  return (
    <>
      <Breadcrumbs
        segments={[
          { label: "Applications", href: "/applications" },
          { label: app?.applicationNumber ?? applicationId, href: `/applications/${applicationId}` },
          {
            label: submission.submissionType ?? submission.id.slice(0, 8),
            href: `/applications/${applicationId}/submissions/${submissionId}`,
          },
          { label: "Review" },
        ]}
        className="mb-4"
      />

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Review Workspace</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Human review — distinct from machine validation
          </p>
        </div>
        <StatusBadge status={submission.status} />
      </div>

      {/* REVIEW_GAP banner */}
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm font-semibold text-amber-800">
          ⓘ REVIEW_GAP — Review backend endpoints not yet implemented
        </p>
        <p className="mt-0.5 text-xs text-amber-700">
          Change-set and lifecycle data are read from existing endpoints. Review
          findings and decisions require backend implementation before they can
          be persisted. This workspace is currently read-only for findings and
          decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Unit selector */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Submission Units
              </p>
            </div>
            <ul>
              {(units ?? []).map((unit) => (
                <li key={unit.id}>
                  <button
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={cn(
                      "w-full border-b border-gray-100 px-3 py-2.5 text-left text-sm transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500",
                      unitId === unit.id ? "bg-brand-50" : "hover:bg-gray-50",
                    )}
                    aria-pressed={unitId === unit.id}
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

          {/* Validation state summary */}
          <ValidationSummaryCard unitId={unitId} />
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="mb-4 border-b border-gray-200">
            <nav className="-mb-px flex gap-6" aria-label="Review tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "border-b-2 pb-3 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "border-brand-600 text-brand-700"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === "changes" && (
            <ChangesTab
              unitId={unitId}
              cous={cous ?? []}
              isLoading={loadingCous}
            />
          )}

          {activeTab === "findings" && (
            <FindingsTab findings={findings ?? []} isGap={isGap} />
          )}

          {activeTab === "decision" && (
            <ReviewDecisionPanel
              currentStatus={currentStatus}
              blockingFindings={blockingFindings}
              onDecide={(status) =>
                void setDecision.mutate({ submissionUnitId: unitId, status })
              }
              isPending={setDecision.isPending}
              isGap={isGap}
            />
          )}
        </div>
      </div>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ValidationSummaryCard({ unitId }: { unitId: string }) {
  // We don't have a direct "latest run" endpoint — show a placeholder
  // that links to the validation page. A real implementation would
  // fetch the latest run ID from the unit's metadata.
  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-white px-3 py-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Validation State
      </p>
      {unitId ? (
        <p className="text-xs text-gray-500">
          Run validation before completing review. Validation state is shown on
          the Validation page.
        </p>
      ) : (
        <p className="text-xs text-gray-400">Select a unit to see state.</p>
      )}
    </div>
  );
}

function ChangesTab({
  unitId,
  cous,
  isLoading,
}: {
  unitId: string;
  cous: ContextOfUse[];
  isLoading: boolean;
}) {
  if (!unitId) {
    return <p className="text-sm text-gray-400">Select a submission unit.</p>;
  }
  if (isLoading) return <LoadingSkeleton rows={4} />;
  if (cous.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center">
        <p className="text-sm text-gray-500">
          No Contexts of Use found for this unit.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            <th className="w-8 px-2 py-2" />
            <th className="px-4 py-2">Operation</th>
            <th className="px-4 py-2">Context of Use</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {cous.map((cou) => (
            <CouChangeRowWrapper key={cou.id} cou={cou} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CouChangeRowWrapper({ cou }: { cou: ContextOfUse }) {
  const { data: lifecycle } = useCouLifecycle(cou.id);
  const ops: LifecycleOperation[] = lifecycle ?? [];
  return <ReviewChangeRow cou={cou} operations={ops} />;
}

function FindingsTab({
  findings,
  isGap,
}: {
  findings: import("@/lib/api/client").ReviewFinding[];
  isGap: boolean;
}) {
  if (isGap) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4">
        <p className="text-sm font-semibold text-amber-800">
          ⓘ REVIEW_GAP — Findings endpoint not available
        </p>
        <p className="mt-1 text-xs text-amber-700">
          Review findings require backend implementation. No findings can be
          loaded or created until the review module is deployed.
        </p>
      </div>
    );
  }

  if (findings.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center">
        <p className="text-sm text-gray-500">No review findings recorded.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {findings.map((f) => (
        <ReviewFindingRow key={f.id} finding={f} />
      ))}
    </ul>
  );
}
