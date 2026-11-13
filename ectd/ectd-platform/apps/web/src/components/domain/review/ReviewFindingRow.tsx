"use client";

import { cn } from "@/lib/cn";
import type { ReviewFinding } from "@/lib/api/client";

const SEVERITY_STYLES: Record<string, string> = {
  BLOCKING: "bg-red-100 text-red-800",
  MAJOR: "bg-amber-100 text-amber-800",
  MINOR: "bg-yellow-100 text-yellow-800",
  COMMENT: "bg-blue-100 text-blue-800",
};

const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-orange-100 text-orange-700",
  RESOLVED: "bg-green-100 text-green-700",
};

interface ReviewFindingRowProps {
  finding: ReviewFinding;
}

export function ReviewFindingRow({ finding }: ReviewFindingRowProps) {
  return (
    <li className="rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className="flex flex-wrap items-start gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            SEVERITY_STYLES[finding.severity] ?? "bg-gray-100 text-gray-600",
          )}
        >
          {finding.severity}
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            STATUS_STYLES[finding.status] ?? "bg-gray-100 text-gray-600",
          )}
        >
          {finding.status}
        </span>
        <span className="ml-auto font-mono text-xs text-gray-400">
          {finding.entityType} · {finding.entityId.slice(0, 8)}…
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-700">{finding.comment}</p>
      <p className="mt-1 text-xs text-gray-400">
        {new Date(finding.createdAt).toLocaleString()}
        {finding.resolvedAt && (
          <> · Resolved {new Date(finding.resolvedAt).toLocaleString()}</>
        )}
      </p>
    </li>
  );
}
