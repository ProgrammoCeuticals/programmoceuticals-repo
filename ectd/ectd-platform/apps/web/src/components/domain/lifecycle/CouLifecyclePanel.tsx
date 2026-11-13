"use client";

import { useCouLifecycle } from "@/lib/api/queries";
import { LoadingSkeleton } from "@/components/ui/States";
import { LifecycleBadge } from "@/components/ui/LifecycleBadge";

interface CouLifecyclePanelProps {
  couId: string;
}

export function CouLifecyclePanel({ couId }: CouLifecyclePanelProps) {
  const { data: ops, isLoading } = useCouLifecycle(couId);

  if (isLoading) return <LoadingSkeleton rows={2} />;
  if (!ops || ops.length === 0) {
    return (
      <p className="text-xs text-gray-400">No lifecycle operations recorded.</p>
    );
  }

  return (
    <ol className="relative border-l border-gray-200 space-y-4 pl-4" aria-label="Lifecycle history">
      {ops.map((op) => (
        <li key={op.id} className="relative">
          {/* Timeline dot */}
          <span
            className="absolute -left-[1.125rem] top-1 h-3 w-3 rounded-full border-2 border-white bg-gray-400"
            aria-hidden="true"
          />
          <div className="flex items-start justify-between gap-2">
            <LifecycleBadge operation={op.operationType} />
            <time
              dateTime={op.createdAt}
              className="shrink-0 text-xs text-gray-400"
            >
              {new Date(op.createdAt).toLocaleDateString()}
            </time>
          </div>
          {op.reason && (
            <p className="mt-1 text-xs text-gray-500">{op.reason}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
