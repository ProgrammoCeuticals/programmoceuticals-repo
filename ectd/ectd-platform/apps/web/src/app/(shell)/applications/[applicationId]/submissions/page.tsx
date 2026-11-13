"use client";

import { use } from "react";
import { useApplicationSubmissions, useApplication } from "@/lib/api/queries";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function SubmissionsPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = use(params);
  const { data: app } = useApplication(applicationId);
  const { data: submissions, isLoading, isError, refetch } = useApplicationSubmissions(applicationId);
  const router = useRouter();

  return (
    <>
      <Breadcrumbs
        segments={[
          { label: "Applications", href: "/applications" },
          { label: app?.applicationNumber ?? applicationId, href: `/applications/${applicationId}` },
          { label: "Submissions" },
        ]}
        className="mb-4"
      />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Submissions</h1>
      </div>

      {isLoading && <LoadingSkeleton rows={3} />}
      {isError && (
        <ErrorState message="Could not load submissions." onRetry={() => void refetch()} />
      )}

      {!isLoading && !isError && (!submissions || submissions.length === 0) && (
        <EmptyState
          title="No submissions yet"
          description="Submissions will appear here once created."
        />
      )}

      {!isLoading && !isError && submissions && submissions.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Sequence</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((sub, i) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    Sequence {String(i).padStart(4, "0")}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{sub.submissionType ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={sub.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/applications/${applicationId}/submissions/${sub.id}`,
                        )
                      }
                    >
                      Open
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
