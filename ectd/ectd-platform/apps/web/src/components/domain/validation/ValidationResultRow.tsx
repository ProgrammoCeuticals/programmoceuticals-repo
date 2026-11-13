"use client";

import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ValidationResultWithRule } from "@/lib/api/client";

const SEVERITY_CONFIG: Record<
  string,
  { icon: React.ElementType; iconClass: string; rowClass: string; label: string }
> = {
  ERROR: {
    icon: AlertCircle,
    iconClass: "text-red-500",
    rowClass: "border-red-100 bg-red-50",
    label: "Error",
  },
  WARNING: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    rowClass: "border-amber-100 bg-amber-50",
    label: "Warning",
  },
  INFO: {
    icon: Info,
    iconClass: "text-blue-400",
    rowClass: "border-blue-100 bg-blue-50",
    label: "Info",
  },
  PASS: {
    icon: CheckCircle,
    iconClass: "text-green-500",
    rowClass: "border-green-100 bg-green-50",
    label: "Pass",
  },
};

interface ValidationResultRowProps {
  result: ValidationResultWithRule;
}

export function ValidationResultRow({ result }: ValidationResultRowProps) {
  const cfg = SEVERITY_CONFIG[result.severity] ?? SEVERITY_CONFIG["INFO"]!;
  const Icon = cfg.icon;

  return (
    <li
      className={cn(
        "rounded-md border px-4 py-3 text-sm",
        cfg.rowClass,
      )}
      aria-label={`${cfg.label}: ${result.message}`}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn("mt-0.5 h-4 w-4 shrink-0", cfg.iconClass)}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {result.rule && (
              <span className="font-mono text-xs font-medium text-gray-600">
                {result.rule.ruleCode}
              </span>
            )}
            {result.rule?.source && (
              <span className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-xs text-gray-500">
                {result.rule.source}
              </span>
            )}
          </div>
          <p className="text-gray-900">{result.message}</p>
          {result.location && (
            <p className="font-mono text-xs text-gray-500">
              Location: {result.location}
            </p>
          )}
          {result.entityType && result.entityId && (
            <p className="text-xs text-gray-500">
              {result.entityType}:{" "}
              <span className="font-mono">{result.entityId.slice(0, 12)}…</span>
            </p>
          )}
          {result.remediation && (
            <p className="mt-1 rounded bg-white/60 px-2 py-1 text-xs text-gray-700">
              <span className="font-medium">Remediation:</span>{" "}
              {result.remediation}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}
