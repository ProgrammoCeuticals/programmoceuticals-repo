"use client";

import { useDocumentVersions } from "@/lib/api/queries";
import { LoadingSkeleton, ErrorState } from "@/components/ui/States";
import { ShieldCheck } from "lucide-react";

interface DocumentVersionHistoryProps {
  documentId: string;
}

export function DocumentVersionHistory({ documentId }: DocumentVersionHistoryProps) {
  const { data: versions, isLoading, isError, refetch } = useDocumentVersions(documentId);

  if (isLoading) return <LoadingSkeleton rows={3} />;
  if (isError) return <ErrorState message="Could not load version history." onRetry={() => void refetch()} />;
  if (!versions || versions.length === 0) {
    return <p className="text-sm text-gray-400">No versions uploaded yet.</p>;
  }

  return (
    <ol className="space-y-2" aria-label="Version history">
      {[...versions].reverse().map((v) => (
        <li
          key={v.id}
          className="rounded-lg border border-gray-200 bg-white px-4 py-3"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900">
                Version {v.versionNumber}
                {v.versionNumber === versions[versions.length - 1]?.versionNumber && (
                  <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                    Current
                  </span>
                )}
              </p>
              <p className="mt-0.5 truncate font-mono text-xs text-gray-500">{v.filename}</p>
            </div>
            <time
              dateTime={v.createdAt}
              className="shrink-0 text-xs text-gray-400"
            >
              {new Date(v.createdAt).toLocaleDateString()}
            </time>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            {v.fileSize != null && (
              <span>{(Number(v.fileSize) / 1024).toFixed(1)} KB</span>
            )}
            {v.mimeType && <span>{v.mimeType}</span>}
            {v.checksum && (
              <span
                className="flex items-center gap-1 font-mono"
                title={`${v.checksumAlgorithm}: ${v.checksum}`}
              >
                <ShieldCheck className="h-3 w-3 text-green-500" aria-hidden="true" />
                {v.checksum.slice(0, 12)}…
              </span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
