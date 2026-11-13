"use client";

import { use, useEffect, useState } from "react";
import {
  useSubmission,
  useSubmissionUnits,
  useApplication,
  useSubmissionUnit,
  useCtdSectionTree,
} from "@/lib/api/queries";
import { useWorkspaceStore } from "@/lib/store/workspace";
import { CtdTree } from "@/components/domain/ctd/CtdTree";
import { CouDetailPanel } from "@/components/domain/ctd/CouDetailPanel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingSkeleton, ErrorState } from "@/components/ui/States";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import type { CtdSection } from "@/lib/api/client";

export default function SubmissionWorkspacePage({
  params,
}: {
  params: Promise<{ applicationId: string; submissionId: string }>;
}) {
  const { applicationId, submissionId } = use(params);
  const { data: app } = useApplication(applicationId);
  const { data: submission, isLoading, isError } = useSubmission(submissionId);
  const { data: units } = useSubmissionUnits(submissionId);

  const { selectedUnitId, setSelectedUnit } = useWorkspaceStore();

  const [sections, setSections] = useState<CtdSection[]>([]);

  const router = useRouter();

  // Auto-select first unit
  useEffect(() => {
    if (!selectedUnitId && units && units.length > 0) {
      setSelectedUnit(units[0]!.id);
    }
  }, [units, selectedUnitId, setSelectedUnit]);

  if (isLoading) return <LoadingSkeleton rows={4} />;
  if (isError || !submission) return <ErrorState message="Could not load submission." />;

  return (
    <>
      <Breadcrumbs
        segments={[
          { label: "Applications", href: "/applications" },
          { label: app?.applicationNumber ?? applicationId, href: `/applications/${applicationId}` },
          { label: "Submissions", href: `/applications/${applicationId}/submissions` },
          { label: submission.submissionType ?? submission.id.slice(0, 8) },
        ]}
        className="mb-4"
      />

      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Submission Workspace</h1>
          <p className="mt-0.5 text-sm text-gray-500">{submission.submissionType ?? "—"}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={submission.status} />
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              router.push(
                `/applications/${applicationId}/submissions/${submissionId}/review`,
              )
            }
          >
            Review
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              router.push(
                `/applications/${applicationId}/submissions/${submissionId}/validation`,
              )
            }
          >
            Validate
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              router.push(
                `/applications/${applicationId}/submissions/${submissionId}/publishing`,
              )
            }
          >
            Publish
          </Button>
        </div>
      </div>

      {/* Three-pane workspace */}
      <div className="flex h-[calc(100vh-220px)] overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Pane 1 — Submission Units */}
        <SubmissionUnitPane
          units={units ?? []}
          selectedUnitId={selectedUnitId}
          onSelect={setSelectedUnit}
        />

        {/* Pane 2 — CTD Tree */}
        <div className="flex w-72 shrink-0 flex-col border-r border-gray-200">
          <div className="border-b border-gray-100 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              CTD Structure
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <CtdTreePane
              submissionUnitId={selectedUnitId}
              onSectionsLoaded={setSections}
            />
          </div>
        </div>

        {/* Pane 3 — CoU Details */}
        <div className="flex flex-1 flex-col">
          <div className="border-b border-gray-100 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Details
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <CouDetailPaneWrapper
              submissionUnitId={selectedUnitId}
              applicationId={applicationId}
              sections={sections}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SubmissionUnitPane({
  units,
  selectedUnitId,
  onSelect,
}: {
  units: Array<{ id: string; sequenceNumber: number; status: string }>;
  selectedUnitId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex w-44 shrink-0 flex-col border-r border-gray-200">
      <div className="border-b border-gray-100 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Units
        </p>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {units.length === 0 && (
          <li className="p-3 text-xs text-gray-400">No units yet.</li>
        )}
        {units.map((unit) => (
          <li key={unit.id}>
            <button
              onClick={() => onSelect(unit.id)}
              className={cn(
                "w-full border-b border-gray-100 px-3 py-2.5 text-left text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500",
                selectedUnitId === unit.id
                  ? "bg-brand-50"
                  : "hover:bg-gray-50",
              )}
              aria-pressed={selectedUnitId === unit.id}
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
  );
}

function CtdTreePane({
  submissionUnitId,
  onSectionsLoaded,
}: {
  submissionUnitId: string | null;
  onSectionsLoaded?: (sections: CtdSection[]) => void;
}) {
  const { data: unit } = useSubmissionUnit(submissionUnitId ?? "");
  const { data: tree } = useCtdSectionTree(unit?.ctdStructurePackageId);

  // Propagate sections up once loaded
  useEffect(() => {
    if (tree && onSectionsLoaded) onSectionsLoaded(tree);
  }, [tree, onSectionsLoaded]);

  return (
    <CtdTree
      ctdStructurePackageId={unit?.ctdStructurePackageId}
      submissionUnitId={submissionUnitId}
    />
  );
}

function CouDetailPaneWrapper({
  submissionUnitId,
  applicationId,
  sections,
}: {
  submissionUnitId: string | null;
  applicationId: string;
  sections: CtdSection[];
}) {
  const { data: unit } = useSubmissionUnit(submissionUnitId ?? "");

  return (
    <CouDetailPanel
      submissionUnitId={submissionUnitId}
      ctdPackageId={unit?.ctdStructurePackageId}
      applicationId={applicationId}
      sections={sections}
    />
  );
}
