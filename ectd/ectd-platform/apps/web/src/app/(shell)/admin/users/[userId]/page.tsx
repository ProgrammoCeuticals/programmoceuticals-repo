"use client";

import { use, useState } from "react";
import {
  useOrgUser,
  useUserRoles,
  useUpdateUser,
  useAssignRole,
  useRemoveRole,
} from "@/lib/api/queries";
import { LoadingSkeleton, ErrorState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmationDialog } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { ApiClientError } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const router = useRouter();
  const { data: user, isLoading, isError } = useOrgUser(userId);
  const { data: roles } = useUserRoles(userId);
  const { mutateAsync: updateUser, isPending: updating } = useUpdateUser();
  const { mutateAsync: assignRole, isPending: assigning } = useAssignRole();
  const { mutateAsync: removeRole } = useRemoveRole();

  const [newRoleId, setNewRoleId] = useState("");
  const [removeTarget, setRemoveTarget] = useState<{ roleId: string; name: string } | null>(null);

  if (isLoading) return <LoadingSkeleton rows={5} />;
  if (isError || !user) return <ErrorState message="Could not load user." />;

  const handleToggleStatus = async () => {
    const next = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await updateUser({ id: userId, status: next });
      toast.success(`User ${next === "ACTIVE" ? "activated" : "suspended"}.`);
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Update failed.");
    }
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleId.trim()) return;
    try {
      await assignRole({ userId, roleId: newRoleId.trim() });
      toast.success("Role assigned.");
      setNewRoleId("");
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Failed to assign role.");
    }
  };

  const handleRemoveRole = async () => {
    if (!removeTarget) return;
    try {
      await removeRole({ userId, roleId: removeTarget.roleId });
      toast.success("Role removed.");
      setRemoveTarget(null);
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Failed to remove role.");
    }
  };

  return (
    <>
      <button
        onClick={() => router.push("/admin/users")}
        className="mb-4 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        All Users
      </button>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={user.status} />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => void handleToggleStatus()}
            loading={updating}
            className={
              user.status === "ACTIVE"
                ? "text-amber-700 border-amber-300 hover:bg-amber-50"
                : ""
            }
          >
            {user.status === "ACTIVE" ? "Suspend" : "Activate"}
          </Button>
        </div>
      </div>

      {/* Roles */}
      <section aria-labelledby="roles-heading" className="space-y-4">
        <h3 id="roles-heading" className="text-sm font-semibold text-gray-700">
          Roles
        </h3>

        {(!roles || roles.length === 0) && (
          <p className="text-sm text-gray-400">No roles assigned.</p>
        )}

        {roles && roles.length > 0 && (
          <ul className="space-y-2">
            {roles.map((role) => (
              <li
                key={role.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{role.name}</p>
                  {role.permissions.length > 0 && (
                    <p className="mt-0.5 text-xs text-gray-400">
                      {role.permissions
                        .map((p) => p.permission.name)
                        .join(", ")}
                    </p>
                  )}
                </div>
                <button
                  onClick={() =>
                    setRemoveTarget({ roleId: role.id, name: role.name })
                  }
                  aria-label={`Remove role ${role.name}`}
                  className="rounded p-1 text-gray-400 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Assign role */}
        <form
          onSubmit={(e) => void handleAssignRole(e)}
          className="flex gap-2"
        >
          <input
            type="text"
            value={newRoleId}
            onChange={(e) => setNewRoleId(e.target.value)}
            placeholder="Role ID (UUID)"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            aria-label="Role ID to assign"
          />
          <Button
            type="submit"
            variant="secondary"
            loading={assigning}
            disabled={!newRoleId.trim()}
          >
            Assign Role
          </Button>
        </form>
      </section>

      <ConfirmationDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => void handleRemoveRole()}
        title="Remove Role"
        description={`Remove role "${removeTarget?.name}" from this user?`}
        confirmLabel="Remove"
        confirmVariant="danger"
      />
    </>
  );
}
