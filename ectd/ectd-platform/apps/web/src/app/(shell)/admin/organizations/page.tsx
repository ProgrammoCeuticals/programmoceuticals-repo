"use client";

import { useState } from "react";
import { useOrganizations, useCreateOrg } from "@/lib/api/queries";
import { LoadingSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { toast } from "@/components/ui/Toast";
import { ApiClientError } from "@/lib/api/client";

export default function AdminOrganizationsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const { data: orgs, isLoading, isError, refetch } = useOrganizations();

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {orgs ? `${orgs.length} organization${orgs.length !== 1 ? "s" : ""}` : ""}
        </p>
        <Button onClick={() => setShowCreate(true)}>New Organization</Button>
      </div>

      {isLoading && <LoadingSkeleton rows={4} />}
      {isError && (
        <ErrorState
          message="Could not load organizations."
          onRetry={() => void refetch()}
        />
      )}
      {!isLoading && !isError && (!orgs || orgs.length === 0) && (
        <EmptyState
          title="No organizations"
          description="Create an organization to get started."
          action={{ label: "New Organization", onClick: () => setShowCreate(true) }}
        />
      )}

      {!isLoading && !isError && orgs && orgs.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm" aria-label="Organizations">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orgs.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {org.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {org.code ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {org.type ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={org.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateOrgModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </>
  );
}

function CreateOrgModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("");
  const { mutateAsync, isPending } = useCreateOrg();

  const handleClose = () => {
    setName(""); setCode(""); setType("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({
        name,
        ...(code ? { code } : {}),
        ...(type ? { type } : {}),
      });
      toast.success("Organization created.");
      handleClose();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Failed to create organization.",
      );
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="New Organization" size="sm">
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div>
          <label htmlFor="org-name" className="mb-1 block text-xs font-medium text-gray-700">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="org-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label htmlFor="org-code" className="mb-1 block text-xs font-medium text-gray-700">
            Code
          </label>
          <input
            id="org-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. ACME"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label htmlFor="org-type" className="mb-1 block text-xs font-medium text-gray-700">
            Type
          </label>
          <input
            id="org-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="e.g. SPONSOR"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
}
