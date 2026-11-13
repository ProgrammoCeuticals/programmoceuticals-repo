"use client";

import { cn } from "@/lib/cn";
import type { ReviewStatus } from "@/lib/api/client";

const STATUS_CONFIG: Record<
  ReviewStatus,
  { label: string; color: string; description: string }
> = {
  NOT_REVIEWED: {
    label: "Not Reviewed",
    color: "bg-gray-100 text-gray-700 ring-gray-200",
    description: "Review has not been started.",
  },
  IN_REVIEW: {
    label: "In Review",
    color: "bg-blue-100 text-blue-800 ring-blue-200",
    description: "Review is in progress.",
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-100 text-green-800 ring-green-200",
    description: "Review complete — approved for publishing.",
  },
  REQUIRES_ACTION: {
    label: "Requires Action",
    color: "bg-red-100 text-red-800 ring-red-200",
    description: "Review identified issues that must be resolved.",
  },
};

interface ReviewDecisionPanelProps {
  currentStatus: ReviewStatus;
  blockingFindings: number;
  onDecide: (status: ReviewStatus, comment?: string) => void;
  isPending: boolean;
  isGap: boolean;
}

export function ReviewDecisionPanel({
  currentStatus,
  blockingFindings,
  onDecide,
  isPending,
  isGap,
}: ReviewDecisionPanelProps) {
  const cfg = STATUS_CONFIG[currentStatus];

  if (isGap) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm font-semibold text-amber-800">
          ⓘ REVIEW_GAP — Review decision endpoints not yet implemented
        </p>
        <p className="mt-1 text-xs text-amber-700">
          The backend does not yet expose review decision endpoints. Review
          decisions cannot be persisted until the review module is implemented.
          This workspace is read-only.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">
          Review Decision
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
            cfg.color,
          )}
        >
          {cfg.label}
        </span>
      </div>
      <p className="mb-4 text-xs text-gray-500">{cfg.description}</p>

      {blockingFindings > 0 && (
        <p className="mb-3 text-xs font-medium text-red-700">
          {blockingFindings} blocking finding
          {blockingFindings !== 1 ? "s" : ""} must be resolved before approval.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {currentStatus === "NOT_REVIEWED" && (
          <button
            onClick={() => onDecide("IN_REVIEW")}
            disabled={isPending}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Start Review
          </button>
        )}
        {currentStatus === "IN_REVIEW" && (
          <>
            <button
              onClick={() => onDecide("APPROVED")}
              disabled={isPending || blockingFindings > 0}
              className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => onDecide("REQUIRES_ACTION")}
              disabled={isPending}
              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              Requires Action
            </button>
          </>
        )}
        {(currentStatus === "APPROVED" ||
          currentStatus === "REQUIRES_ACTION") && (
          <button
            onClick={() => onDecide("IN_REVIEW")}
            disabled={isPending}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Reopen Review
          </button>
        )}
      </div>
    </div>
  );
}
