import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PageHeader,
  Button,
  Badge,
  Card,
  ConfirmationDialog,
  Spinner,
  EmptyState,
} from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";

// ── Types ────────────────────────────────────────────────────────────────────

interface RoleAssignment {
  id: string;
  role: { id: string; name: string };
  scopeType: string;
  scopeId: string | null;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  createdAt: string;
  roleAssignments?: RoleAssignment[];
}

interface RoleOption {
  id: string;
  name: string;
}

interface DeptOption {
  id: string;
  name: string;
}

interface TeamOption {
  id: string;
  name: string;
}

interface ProjectOption {
  id: string;
  title: string;
}

type ScopeType = "INSTITUTION" | "DEPARTMENT" | "TEAM" | "PROJECT";

// ── Helpers ──────────────────────────────────────────────────────────────────

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096] mb-1">
        {label}
      </p>
      <div className="text-[13px] font-semibold text-[#193441]">{children}</div>
    </div>
  );
}

const SCOPE_COLORS: Record<ScopeType, string> = {
  INSTITUTION: "bg-purple-100 text-purple-800",
  DEPARTMENT: "bg-blue-100 text-blue-800",
  TEAM: "bg-green-100 text-green-800",
  PROJECT: "bg-orange-100 text-orange-800",
};

// ── Page ─────────────────────────────────────────────────────────────────────

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const [confirmActivate, setConfirmActivate] = useState(false);
  const [showAssignRole, setShowAssignRole] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedScopeType, setSelectedScopeType] =
    useState<ScopeType>("INSTITUTION");
  const [selectedScopeId, setSelectedScopeId] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", id],
    queryFn: () => api.get<{ data: User }>(`/users/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const user: User | undefined = (data as { data?: User } | undefined)?.data;

  // Dropdown data
  const { data: rolesData } = useQuery<{ data: RoleOption[] }>({
    queryKey: ["roles"],
    queryFn: () => api.get("/roles").then((r) => r.data),
  });

  const { data: deptsData } = useQuery<{ data: DeptOption[] } | DeptOption[]>({
    queryKey: ["departments"],
    queryFn: () => api.get("/departments").then((r) => r.data),
    enabled: selectedScopeType === "DEPARTMENT",
  });

  const { data: teamsData } = useQuery<{ data: TeamOption[] } | TeamOption[]>({
    queryKey: ["teams"],
    queryFn: () => api.get("/teams").then((r) => r.data),
    enabled: selectedScopeType === "TEAM",
  });

  const { data: projectsData } = useQuery<{ data: ProjectOption[] }>({
    queryKey: ["research-projects-list"],
    queryFn: () => api.get("/research/projects").then((r) => r.data),
    enabled: selectedScopeType === "PROJECT",
  });

  const statusMutation = useMutation({
    mutationFn: (status: "ACTIVE" | "SUSPENDED") =>
      api.patch(`/users/${id}`, { status }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "User updated", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update user",
        description: err.message,
        variant: "error",
      });
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: (payload: {
      roleId: string;
      scopeType: string;
      scopeId?: string;
    }) => api.post(`/users/${id}/roles`, payload).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Role assigned", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users", id] });
      setShowAssignRole(false);
      setSelectedRoleId("");
      setSelectedScopeId("");
      setSelectedScopeType("INSTITUTION");
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to assign role",
        description: err.message,
        variant: "error",
      });
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: (assignmentId: string) =>
      api.delete(`/users/${id}/roles/${assignmentId}`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Role removed", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users", id] });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to remove role",
        description: err.message,
        variant: "error",
      });
    },
  });

  function handleAssignRole() {
    if (!selectedRoleId) return;
    const payload: { roleId: string; scopeType: string; scopeId?: string } = {
      roleId: selectedRoleId,
      scopeType: selectedScopeType,
    };
    if (selectedScopeType !== "INSTITUTION" && selectedScopeId) {
      payload.scopeId = selectedScopeId;
    }
    assignRoleMutation.mutate(payload);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <EmptyState
        title="User not found"
        description="This user does not exist or you do not have permission to view them."
        action={
          <Button onClick={() => navigate("/users")}>Back to Users</Button>
        }
      />
    );
  }

  const roles = rolesData?.data ?? [];
  const depts: DeptOption[] = Array.isArray(deptsData)
    ? (deptsData as DeptOption[])
    : ((deptsData as { data?: DeptOption[] } | undefined)?.data ?? []);
  const teams: TeamOption[] = Array.isArray(teamsData)
    ? (teamsData as TeamOption[])
    : ((teamsData as { data?: TeamOption[] } | undefined)?.data ?? []);
  const projects: ProjectOption[] = projectsData?.data ?? [];

  return (
    <div>
      <PageHeader
        title={`${user.firstName} ${user.lastName}`}
        breadcrumbs={[
          { label: "Users", href: "/users" },
          { label: `${user.firstName} ${user.lastName}` },
        ]}
        actions={
          <div className="flex gap-2">
            {user.status === "ACTIVE" && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setConfirmSuspend(true)}
              >
                Suspend
              </Button>
            )}
            {user.status === "SUSPENDED" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setConfirmActivate(true)}
              >
                Activate
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/users")}
            >
              Back
            </Button>
          </div>
        }
      />

      <div className="max-w-2xl space-y-6">
        {/* ── User Info Card ───────────────────────────────────────────── */}
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoRow label="Full Name">
              {user.firstName} {user.lastName}
            </InfoRow>
            <InfoRow label="Email">{user.email}</InfoRow>
            <InfoRow label="Status">
              <Badge label={user.status} />
            </InfoRow>
            <InfoRow label="Member Since">
              {new Date(user.createdAt).toLocaleDateString()}
            </InfoRow>
          </div>
        </Card>

        {/* ── Role Assignments Card ────────────────────────────────────── */}
        <Card
          header={
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 text-sm">
                Role Assignments
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowAssignRole((v) => !v)}
              >
                {showAssignRole ? "Cancel" : "Add Role"}
              </Button>
            </div>
          }
        >
          {/* Existing assignments */}
          {(user.roleAssignments?.length ?? 0) === 0 ? (
            <p className="text-sm text-slate-400">No roles assigned.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {user.roleAssignments!.map((ra) => (
                <div
                  key={ra.id}
                  className="flex items-center justify-between py-2 gap-3"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-slate-800">
                      {ra.role.name}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${SCOPE_COLORS[ra.scopeType as ScopeType] ?? "bg-slate-100 text-slate-700"}`}
                    >
                      {ra.scopeType}
                    </span>
                    {ra.scopeId && (
                      <span className="text-[11px] text-slate-500 font-mono">
                        {ra.scopeId.slice(0, 8)}…
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => removeRoleMutation.mutate(ra.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add role form */}
          {showAssignRole && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                  Role
                </label>
                <select
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm text-slate-700"
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  aria-label="Select role"
                >
                  <option value="">— Select a role —</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                  Scope Type
                </label>
                <select
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm text-slate-700"
                  value={selectedScopeType}
                  onChange={(e) => {
                    setSelectedScopeType(e.target.value as ScopeType);
                    setSelectedScopeId("");
                  }}
                  aria-label="Select scope type"
                >
                  <option value="INSTITUTION">Institution-wide</option>
                  <option value="DEPARTMENT">Department</option>
                  <option value="TEAM">Team</option>
                  <option value="PROJECT">Project</option>
                </select>
              </div>

              {selectedScopeType === "DEPARTMENT" && (
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                    Department
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm text-slate-700"
                    value={selectedScopeId}
                    onChange={(e) => setSelectedScopeId(e.target.value)}
                    aria-label="Select department"
                  >
                    <option value="">— Select department —</option>
                    {depts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedScopeType === "TEAM" && (
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                    Team
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm text-slate-700"
                    value={selectedScopeId}
                    onChange={(e) => setSelectedScopeId(e.target.value)}
                    aria-label="Select team"
                  >
                    <option value="">— Select team —</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedScopeType === "PROJECT" && (
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                    Project
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm text-slate-700"
                    value={selectedScopeId}
                    onChange={(e) => setSelectedScopeId(e.target.value)}
                    aria-label="Select project"
                  >
                    <option value="">— Select project —</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleAssignRole}
                  disabled={!selectedRoleId || assignRoleMutation.isPending}
                >
                  Assign
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowAssignRole(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <ConfirmationDialog
        open={confirmSuspend}
        onClose={() => setConfirmSuspend(false)}
        title="Suspend User"
        description={`Are you sure you want to suspend ${user.firstName} ${user.lastName}? They will no longer be able to log in.`}
        confirmLabel="Suspend"
        confirmVariant="danger"
        onConfirm={async () => {
          await statusMutation.mutateAsync("SUSPENDED");
          setConfirmSuspend(false);
        }}
      />

      <ConfirmationDialog
        open={confirmActivate}
        onClose={() => setConfirmActivate(false)}
        title="Activate User"
        description={`Activate ${user.firstName} ${user.lastName}? They will regain access to the system.`}
        confirmLabel="Activate"
        confirmVariant="primary"
        onConfirm={async () => {
          await statusMutation.mutateAsync("ACTIVE");
          setConfirmActivate(false);
        }}
      />
    </div>
  );
}
