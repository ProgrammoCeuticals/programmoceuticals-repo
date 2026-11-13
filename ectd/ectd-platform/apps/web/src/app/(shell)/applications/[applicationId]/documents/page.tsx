"use client";

import { use, useState } from "react";
import { useDocuments, useApplication } from "@/lib/api/queries";
import { LoadingSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { DocumentUploadModal } from "@/components/domain/documents/DocumentUploadModal";
import { useRouter } from "next/navigation";

export default function DocumentsPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = use(params);
  const { data: app } = useApplication(applicationId);
  const { data, isLoading, isError, refetch } = useDocuments(applicationId);
  const [showUpload, setShowUpload] = useState(false);
  const router = useRouter();

  return (
    <>
      <Breadcrumbs
        segments={[
          { label: "Applications", href: "/applications" },
          {
            label: app?.applicationNumber ?? applicationId,
            href: `/applications/${applicationId}`,
          },
          { label: "Documents" },
        ]}
        className="mb-4"
      />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Documents</h1>
        <Button onClick={() => setShowUpload(true)}>Upload Document</Button>
      </div>

      {isLoading && <LoadingSkeleton rows={4} />}
      {isError && (
        <ErrorState
          message="Could not load documents."
          onRetry={() => void refetch()}
        />
      )}

      {!isLoading && !isError && (!data?.data || data.data.length === 0) && (
        <EmptyState
          title="No documents yet"
          description="Upload documents to make them available for regulatory reference."
          action={{ label: "Upload Document", onClick: () => setShowUpload(true) }}
        />
      )}

      {!isLoading && !isError && data?.data && data.data.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  File Type
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Language
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Updated
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.data.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {doc.title}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {doc.mimeType}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {doc.language ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/applications/${applicationId}/documents/${doc.id}`,
                        )
                      }
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DocumentUploadModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        applicationId={applicationId}
      />
    </>
  );
}
