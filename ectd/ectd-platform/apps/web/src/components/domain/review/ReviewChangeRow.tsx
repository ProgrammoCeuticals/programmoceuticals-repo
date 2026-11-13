"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ContextOfUse, LifecycleOperation } from "@/lib/api/client";

const OP_STYLES: Record<string, string> = {
  NEW: "bg-green-100 text-green-800",
  REPLACE: "bg-amber-100 text-amber-800",
  REUSE: "bg-sky-100 text-sky-800",
  SUSPEND: "bg-red-100 text-red-800",
};

interface ReviewChangeRowProps {
  cou: ContextOfUse;
  operations: LifecycleOperation[];
}

export function ReviewChangeRow({ cou, operations }: ReviewChangeRowProps) {
  const [expanded, setExpanded] = useState(false);
  const latestOp = operations[operations.length - 1];
  const opType = latestOp?.operationType ?? "NEW";

  return (
    <>
      <tr
        className="cursor-pointer border-b border-gray-100 text-sm hover:bg-gray-50"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <td className="w-8 px-2 py-3 text-gray-400">
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </td>

        <td className="px-4 py-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              OP_STYLES[opType] ?? "bg-gray-100 text-gray-600",
            )}
          >
            {opType}
          </span>
        </td>

        <td className="px-4 py-3 font-mono text-xs text-gray-600">
          {cou.id.slice(0, 8)}…
        </td>

        <td className="px-4 py-3">
          <StatusBadge status={cou.status} />
        </td>

        <td className="px-4 py-3 text-xs text-gray-500">
          {new Date(cou.createdAt).toLocaleDateString()}
        </td>
      </tr>

      {expanded && (
        <tr className="border-b border-gray-100 bg-gray-50">
          <td colSpan={5} className="px-6 py-3">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-3">
              <div>
                <dt className="font-medium text-gray-500">Context of Use ID</dt>
                <dd className="font-mono text-gray-700">{cou.id}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Document ID</dt>
                <dd className="font-mono text-gray-700">{cou.documentId}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Context Definition</dt>
                <dd className="font-mono text-gray-700">{cou.contextDefinitionId}</dd>
              </div>
              {latestOp?.reason && (
                <div className="col-span-2 sm:col-span-3">
                  <dt className="font-medium text-gray-500">Reason</dt>
                  <dd className="text-gray-700">{latestOp.reason}</dd>
                </div>
              )}
              {operations.length > 1 && (
                <div className="col-span-2 sm:col-span-3">
                  <dt className="mb-1 font-medium text-gray-500">
                    Lifecycle history ({operations.length} operations)
                  </dt>
                  <dd>
                    <ul className="space-y-1">
                      {operations.map((op) => (
                        <li key={op.id} className="flex items-center gap-2 text-gray-600">
                          <span
                            className={cn(
                              "rounded-full px-1.5 py-0.5 text-xs font-medium",
                              OP_STYLES[op.operationType] ?? "bg-gray-100 text-gray-600",
                            )}
                          >
                            {op.operationType}
                          </span>
                          <span className="font-mono text-gray-400">
                            {new Date(op.createdAt).toLocaleString()}
                          </span>
                          {op.reason && <span>— {op.reason}</span>}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>
          </td>
        </tr>
      )}
    </>
  );
}
