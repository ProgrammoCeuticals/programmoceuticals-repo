"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AuditEvent } from "@/lib/api/client";

// Colour-code event categories
const EVENT_STYLES: Record<string, string> = {
  CREATE: "bg-green-100 text-green-800",
  UPDATE: "bg-blue-100 text-blue-800",
  UPLOAD: "bg-blue-100 text-blue-800",
  FREEZE: "bg-purple-100 text-purple-800",
  SUSPEND: "bg-amber-100 text-amber-800",
  REPLACE: "bg-amber-100 text-amber-800",
  REUSE: "bg-sky-100 text-sky-800",
  RUN: "bg-indigo-100 text-indigo-800",
  GENERATE: "bg-indigo-100 text-indigo-800",
  PUBLISH: "bg-brand-100 text-brand-800",
  INVALIDATE: "bg-red-100 text-red-800",
  IMPORT: "bg-teal-100 text-teal-800",
  ACTIVATE: "bg-teal-100 text-teal-800",
  LOGIN: "bg-gray-100 text-gray-700",
  LOGOUT: "bg-gray-100 text-gray-700",
};

function eventStyle(eventType: string): string {
  const prefix = eventType.split("_")[0] ?? "";
  return EVENT_STYLES[prefix] ?? "bg-gray-100 text-gray-600";
}

interface AuditEventRowProps {
  event: AuditEvent;
}

export function AuditEventRow({ event }: AuditEventRowProps) {
  const [expanded, setExpanded] = useState(false);
  const hasDetail =
    event.oldValue !== null ||
    event.newValue !== null ||
    event.correlationId !== null;

  return (
    <>
      <tr
        className={cn(
          "border-b border-gray-100 text-sm",
          hasDetail ? "cursor-pointer hover:bg-gray-50" : "hover:bg-gray-50",
        )}
        onClick={() => hasDetail && setExpanded((v) => !v)}
        aria-expanded={hasDetail ? expanded : undefined}
      >
        {/* Expand toggle */}
        <td className="w-8 px-2 py-3 text-gray-400">
          {hasDetail ? (
            expanded ? (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            )
          ) : null}
        </td>

        {/* Timestamp */}
        <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
          {new Date(event.timestamp).toLocaleString()}
        </td>

        {/* Event type */}
        <td className="px-4 py-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              eventStyle(event.eventType),
            )}
          >
            {event.eventType}
          </span>
        </td>

        {/* Entity */}
        <td className="px-4 py-3 text-gray-600">
          <span className="font-medium">{event.entityType}</span>
          <span className="ml-1 font-mono text-xs text-gray-400">
            {event.entityId.slice(0, 8)}…
          </span>
        </td>

        {/* Actor */}
        <td className="px-4 py-3 text-gray-500">
          {event.userId ? (
            <span className="font-mono text-xs">{event.userId.slice(0, 8)}…</span>
          ) : (
            <span className="italic text-gray-400">System</span>
          )}
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && hasDetail && (
        <tr className="border-b border-gray-100 bg-gray-50">
          <td colSpan={5} className="px-6 py-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {event.oldValue !== null && event.oldValue !== undefined && (
                <ValueBlock label="Before" value={event.oldValue} />
              )}
              {event.newValue !== null && event.newValue !== undefined && (
                <ValueBlock label="After" value={event.newValue} />
              )}
              {event.correlationId && (
                <div className="sm:col-span-2 text-xs text-gray-500">
                  Correlation ID:{" "}
                  <span className="font-mono">{event.correlationId}</span>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function ValueBlock({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <pre className="overflow-x-auto rounded-md border border-gray-200 bg-white p-2 font-mono text-xs text-gray-700 whitespace-pre-wrap">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}
