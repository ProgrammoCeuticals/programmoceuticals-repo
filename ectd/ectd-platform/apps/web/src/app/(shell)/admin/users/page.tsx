"use client";

import { useState } from "react";
import { useOrgUsers, useCreateUser } from "@/lib/api/queries";
import { LoadingSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { toast } from "@/components/ui/Toast";
import { ApiClientError } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 25;

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [showInvite, setShowInvite] = useState(false);
  const { data, isLoading, isError, refetch } = useOrgUsers(page);
  const router = useRouter();

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {data ? `${data.total} user${data.total !== 1 ? "s" : ""}` : ""}
        </p>
        <Button onClick={() => setShowInvite(true)}>Invite User</Button>
      </div>

      {isLoading && <LoadingSkeleton rows={5} />}
      {isError && (
        <ErrorState
          message="Could not load users."
          onRetry={() => void refetch()}
        />
      )}
      {!isLoading && !isError && (!data?.data || data.data.length === 0) && (
        <EmptyState
          title="No users yet"
          description="Invite users to give them access to this organization."
          action={{ label: "Invite User", onClick: () => setShowInvite(true) }}
        />
      )}

      {!isLoading && !isError && data?.data && data.data.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm" aria-label="Users">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Roles
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {user.roles.length > 0
                      ? user.roles
                          .map((r) => r.role.name)
                          .join(", ")
                      : <span className="italic text-gray-400">No roles</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !isError && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <InviteUserModal
        open={showInvite}
        onClose={() => setShowInvite(false)}
      />
    </>
  );
}

function InviteUserModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync, isPending } = useCreateUser();

  const handleClose = () => {
    setName(""); setEmail(""); setPassword("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({ name, email, password });
      toast.success("User created.");
      handleClose();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Failed to create user.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Invite User" size="sm">
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div>
          <label htmlFor="user-name" className="mb-1 block text-xs font-medium text-gray-700">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="user-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label htmlFor="user-email" className="mb-1 block text-xs font-medium text-gray-700">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="user-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label htmlFor="user-password" className="mb-1 block text-xs font-medium text-gray-700">
            Temporary Password <span aria-hidden="true">*</span>
          </label>
          <input
            id="user-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Create User
          </Button>
        </div>
      </form>
    </Modal>
  );
}
