import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PageHeader, Button, Badge, Card, Spinner, EmptyState } from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";

// ── Types ──────────────────────────────────────────────────────────────────

interface Permission {
  id: string;
  code: string;
  description?: string;
}

interface RolePermissionRecord {
  permission: { code: string };
}

interface Role {
  id: string;
  name: string;
  isSystem: boolean;
  _count?: { rolePermissions: number };
  rolePermissions?: RolePermissionRecord[];
}

interface RolesResponse {
  data: Role[];
}

interface PermissionsResponse {
  data: Permission[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Group permission codes by their resource prefix (first segment before '.') */
function groupPermissions(
  permissions: Permission[],
): Record<string, Permission[]> {
  return permissions.reduce<Record<string, Permission[]>>((acc, perm) => {
    const resource = perm.code.split(".")[0];
    if (!acc[resource]) acc[resource] = [];
    acc[resource].push(perm);
    return acc;
  }, {});
}

// ── Page ───────────────────────────────────────────────────────────────────

export function RoleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [checkedCodes, setCheckedCodes] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  // Load roles list (includes rolePermissions codes now)
  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => api.get<RolesResponse>("/roles").then((r) => r.data),
  });

  // Load all permissions
  const { data: permsData, isLoading: permsLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: () =>
      api.get<PermissionsResponse>("/permissions").then((r) => r.data),
  });

  const roles: Role[] = Array.isArray(rolesData)
    ? (rolesData as Role[])
    : ((rolesData as RolesResponse | undefined)?.data ?? []);

  const permissions: Permission[] = Array.isArray(permsData)
    ? (permsData as Permission[])
    : ((permsData as PermissionsResponse | undefined)?.data ?? []);

  const role = roles.find((r) => r.id === id);

  // Initialise checked state from role data once loaded
  useEffect(() => {
    if (role && permissions.length > 0 && !initialized) {
      const currentCodes = new Set(
        (role.rolePermissions ?? []).map((rp) => rp.permission.code),
      );
      setCheckedCodes(currentCodes);
      setInitialized(true);
    }
  }, [role, permissions, initialized]);

  const savePermsMutation = useMutation({
    mutationFn: (permissionCodes: string[]) =>
      api
        .post(`/roles/${id}/permissions`, { permissionCodes })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Permissions updated", variant: "success" });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update permissions",
        description: err.message,
        variant: "error",
      });
    },
  });

  function toggleCode(code: string) {
    setCheckedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  const isLoading = rolesLoading || permsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!role) {
    return (
      <EmptyState
        title="Role not found"
        description="The role you are looking for does not exist."
        action={
          <Button onClick={() => navigate("/roles")}>Back to Roles</Button>
        }
      />
    );
  }

  const grouped = groupPermissions(permissions);

  return (
    <div>
      <PageHeader
        title={role.name}
        breadcrumbs={[
          { label: "Roles & Permissions", href: "/roles" },
          { label: role.name },
        ]}
        actions={
          !role.isSystem ? (
            <Button
              variant="primary"
              onClick={() => savePermsMutation.mutate([...checkedCodes])}
              loading={savePermsMutation.isPending}
            >
              Save Permissions
            </Button>
          ) : undefined
        }
      />

      <div className="mb-4 flex items-center gap-3">
        <Badge
          variant={role.isSystem ? "pending" : "active"}
          label={role.isSystem ? "System Role" : "Custom Role"}
        />
        {role.isSystem && (
          <p className="text-sm text-slate-500">
            System roles cannot be modified.
          </p>
        )}
      </div>

      {permissions.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500">
            No permissions defined in the system.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.entries(grouped).map(([resource, perms]) => (
            <Card
              key={resource}
              header={
                <p className="text-sm font-semibold text-slate-700 capitalize">
                  {resource}
                </p>
              }
            >
              <div className="space-y-2">
                {perms.map((perm) => (
                  <label
                    key={perm.code}
                    className={`flex items-center gap-2 text-sm cursor-pointer ${
                      role.isSystem ? "pointer-events-none opacity-70" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedCodes.has(perm.code)}
                      onChange={() => toggleCode(perm.code)}
                      disabled={role.isSystem}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="font-mono text-xs text-slate-600">
                      {perm.code}
                    </span>
                  </label>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {!role.isSystem && (
        <div className="mt-6 flex gap-3">
          <Button
            variant="primary"
            onClick={() => savePermsMutation.mutate([...checkedCodes])}
            loading={savePermsMutation.isPending}
          >
            Save Permissions
          </Button>
          <Button variant="ghost" onClick={() => navigate("/roles")}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
