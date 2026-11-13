"use client";

import { useValidationRun, useValidationResults } from "@/lib/api/queries";
import { ValidationBadge } from "@/components/ui/ValidationBadge";
import { ValidationResultRow } from "./ValidationResultRow";
import { LoadingSkeleton, ErrorState } from "@/components/ui/States";
import type { ValidationResultWithRule } from "@/lib/api/client";

interface ValidationRunPanelProps {
  runId: string;
}

const SEVERITY_ORDER = ["ERROR", "WARNING", "INFO", "PASS"] as const;

export function ValidationRunPanel({ runId }: ValidationRunPanelProps) {
  const { data: run, isLoading: loadingRun } = useValidationRun(runId);
  const {
    data: results,
    isLoading: loadingResults,
    isError,
    refetch,
  } = useValidationResults(runId);

  if (loadingRun || loadingResults) return <LoadingSkeleton rows={5} />;
  if (isError) {
    return (
      <ErrorState
        message="Could not load validation results."
        onRetry={() => void refetch()}
      />
    );
  }

  const isRunning = run?.status === "RUNNING" || run?.status === "PENDING";

  // Group by severity
  const grouped = SEVERITY_ORDER.reduce<
    Record<string, ValidationResultWithRule[]>
  >((acc, sev) => {
    acc[sev] = (results ?? []).filter((r) => r.severity === sev);
    return acc;
  }, {} as Record<string, ValidationResultWithRule[]>);

  const errorCount = grouped["ERROR"]?.length ?? 0;
  const warningCount = grouped["WARNING"]?.length ?? 0;
  const infoCount = grouped["INFO"]?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Run header */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <ValidationBadge state={run?.status ?? "NOT_RUN"} />
        </div>

        {isRunning && (
          <span className="flex items-center gap-1.5 text-sm text-blue-600">
            <span
              className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
              aria-hidden="true"
            />
            Running…
          </span>
        )}

        <div className="ml-auto flex items-center gap-4 text-sm">
          {errorCount > 0 && (
            <span className="font-medium text-red-700">
              {errorCount} error{errorCount !== 1 ? "s" : ""}
            </span>
          )}
          {warningCount > 0 && (
            <span className="font-medium text-amber-700">
              {warningCount} warning{warningCount !== 1 ? "s" : ""}
            </span>
          )}
          {infoCount > 0 && (
            <span className="text-blue-600">
              {infoCount} info
            </span>
          )}
          {!isRunning && errorCount === 0 && warningCount === 0 && (
            <span className="text-green-700 font-medium">No issues found</span>
          )}
        </div>

        {run?.engineVersion && (
          <span className="text-xs text-gray-400">
            Engine {run.engineVersion}
            {run.profileVersion ? ` · Profile ${run.profileVersion}` : ""}
          </span>
        )}
      </div>

      {/* Results grouped by severity */}
      {!isRunning && (results ?? []).length === 0 && (
        <p className="text-sm text-gray-500">
          No findings — validation passed with no issues.
        </p>
      )}

      {SEVERITY_ORDER.map((sev) => {
        const group = grouped[sev] ?? [];
        if (group.length === 0) return null;
        return (
          <section key={sev} aria-labelledby={`sev-${sev}`}>
            <h3
              id={`sev-${sev}`}
              className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              {sev} ({group.length})
            </h3>
            <ul className="space-y-2">
              {group.map((r) => (
                <ValidationResultRow key={r.id} result={r} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
