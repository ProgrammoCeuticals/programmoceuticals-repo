"use client";

import { usePreparePublication } from "@/lib/api/queries";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/Toast";
import { ApiClientError } from "@/lib/api/client";
import type { PreparePublicationResult } from "@/lib/api/client";

interface PublishGatePanelProps {
  submissionUnitId: string;
  onReady: (result: PreparePublicationResult) => void;
}

export function PublishGatePanel({ submissionUnitId, onReady }: PublishGatePanelProps) {
  const { mutateAsync, isPending, data, reset } = usePreparePublication();

  const handleCheck = async () => {
    try {
      const result = await mutateAsync(submissionUnitId);
      onReady(result);
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : "Gate check failed.";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={() => void handleCheck()}
          loading={isPending}
        >
          Run Publish Gate Check
        </Button>
        {data && (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              data.ready ? "text-green-700" : "text-red-700"
            }`}
          >
            {data.ready ? (
              <CheckCircle className="h-4 w-4" aria-hidden="true" />
            ) : (
              <XCircle className="h-4 w-4" aria-hidden="true" />
            )}
            {data.ready ? "Ready to publish" : "Not ready"}
          </span>
        )}
      </div>

      {data && data.blockingIssues.length > 0 && (
        <ul className="space-y-1" aria-label="Blocking issues">
          {data.blockingIssues.map((issue) => (
            <li
              key={issue.code}
              className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            >
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
              <span>
                <span className="font-mono text-xs font-medium">{issue.code}</span>
                {" — "}
                {issue.message}
              </span>
            </li>
          ))}
        </ul>
      )}

      {data && data.warnings.length > 0 && (
        <ul className="space-y-1" aria-label="Warnings">
          {data.warnings.map((w) => (
            <li
              key={w.code}
              className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
              <span>
                <span className="font-mono text-xs font-medium">{w.code}</span>
                {" — "}
                {w.message}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
