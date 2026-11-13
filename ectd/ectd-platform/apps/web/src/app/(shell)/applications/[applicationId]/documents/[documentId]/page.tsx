"use client";

import { use } from "react";
import { useDocument, useDocumentDownloadRef } from "@/lib/api/queries";
import { LoadingSkeleton, ErrorState } from "@/components/ui/States";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { DocumentVersionHistory } from "@/components/domain/documents/DocumentVersionHistory";
import { useApplication } from "@/lib/api/queries";
import { ShieldCheck, ShieldX, Download } from "lucide-react";

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string; documentId: string }>;
}) {
  const { applicationId, documentId } = use(params);
  const { data: app } = useApplication(applicationId);
  const { data: doc, isLoading, isError, refetch } = useDocument(documentId);
  const { data: dlRef } = useDocumentDownloadRef(documentId);

  if (isLoading) return <LoadingSkeleton rows={6} />;
  if (isError || !doc) {
    return (
      <ErrorState
        message="Could not load document."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <>
      <Breadcrumbs
        segments={[
          { label: "Applications", href: "/applications" },
          {
            label: app?.applicationNumber ?? applicationId,
            href: `/applications/${applicationId}`,
          },
          {
            label: "Documents",
            href: `/applications/${applicationId}/documents`,
          },
          { label: doc.title },
        ]}
        className="mb-4"
      />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{doc.title}</h1>
          <p className="mt-0.5 font-mono text-xs text-gray-400">{doc.uuid}</p>
        </div>

        {dlRef && (
          <div className="flex items-center gap-2">
            {dlRef.available ? (
              <span className="flex items-center gap-1 text-xs text-green-700">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                File available
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-amber-700">
                <ShieldX className="h-4 w-4" aria-hidden="true" />
                File unavailable
              </span>
            )}
            {dlRef.available && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  window.open(`/api/v1/documents/${documentId}/download`, "_blank")
                }
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                Download
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-white p-4 text-sm sm:grid-cols-4">
        <MetaField label="MIME Type" value={doc.mimeType} mono />
        <MetaField label="Language" value={doc.language ?? "—"} />
        <MetaField
          label="Created"
          value={new Date(doc.createdAt).toLocaleDateString()}
        />
        <MetaField
          label="Updated"
          value={new Date(doc.updatedAt).toLocaleDateString()}
        />
      </div>

      {/* Download ref checksum */}
      {dlRef?.checksum && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-600">
          <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" aria-hidden="true" />
          <span className="font-medium">Checksum:</span>
          <span className="font-mono">{dlRef.checksum}</span>
          <span className="text-gray-400">
            · {dlRef.filename} · {(Number(dlRef.fileSize) / 1024).toFixed(1)} KB
          </span>
        </div>
      )}

      {/* Version history */}
      <section aria-labelledby="versions-heading">
        <h2
          id="versions-heading"
          className="mb-3 text-sm font-semibold text-gray-700"
        >
          Version History
        </h2>
        <DocumentVersionHistory documentId={documentId} />
      </section>
    </>
  );
}

function MetaField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className={mono ? "font-mono text-xs text-gray-700" : "text-gray-800"}>
        {value}
      </p>
    </div>
  );
}
