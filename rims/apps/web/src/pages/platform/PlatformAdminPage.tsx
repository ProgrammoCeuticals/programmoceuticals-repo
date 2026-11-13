import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge, DataTable, Input, Spinner } from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";

interface PlatformTenant {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  _count?: { users: number; employees: number };
  subscription?: { planName: string };
}

interface SystemHealth {
  tenantCount: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  dbStatus: string;
  cacheStatus: string;
  queueStatus: string;
  uptime: number;
  timestamp: string;
}

interface TenantsResponse {
  data: PlatformTenant[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

interface HealthResponse {
  data: SystemHealth;
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString();
}

function statusVariant(status: string): string {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "active";
    case "TRIAL":
      return "pending";
    case "SUSPENDED":
      return "suspended";
    case "INACTIVE":
      return "inactive";
    default:
      return "default";
  }
}

function serviceStatusVariant(s: string): string {
  return s === "ok" || s === "healthy" ? "active" : "suspended";
}

export function PlatformAdminPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [suspendTarget, setSuspendTarget] = useState<PlatformTenant | null>(null);
  const [suspendReason, setSuspendReason] = useState("");

  // System health — auto-refresh every 30 seconds
  const { data: healthData, isLoading: healthLoading } = useQuery({
    queryKey: ["platform-system-health"],
    queryFn: () =>
      api.get<HealthResponse>("/platform/system/health").then((r) => r.data),
    refetchInterval: 30000,
  });
  const health = healthData?.data;

  // Tenant list
  const tenantParams = {
    page,
    pageSize: 20,
    ...(search && { search }),
    ...(statusFilter !== "ALL" && { status: statusFilter }),
  };

  const { data: tenantsData, isLoading: tenantsLoading } = useQuery({
    queryKey: ["platform-tenants", page, search, statusFilter],
    queryFn: () =>
      api
        .get<TenantsResponse>("/platform/tenants", { params: tenantParams })
        .then((r) => r.data),
  });

  const tenants: PlatformTenant[] = tenantsData?.data ?? [];
  const meta = tenantsData?.meta;

  const suspendMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.post(`/platform/tenants/${id}/suspend`, { reason }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Tenant suspended", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["platform-tenants"] });
      setSuspendTarget(null);
      setSuspendReason("");
    },
    onError: (err: Error) => {
      toast({ title: "Failed to suspend tenant", description: err.message, variant: "error" });
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) =>
      api.post(`/platform/tenants/${id}/activate`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Tenant activated", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["platform-tenants"] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to activate tenant", description: err.message, variant: "error" });
    },
  });

  const columns = [
    { key: "name", header: "Name" },
    { key: "slug", header: "Slug" },
    {
      key: "status",
      header: "Status",
      render: (row: PlatformTenant) => (
        <Badge variant={statusVariant(row.status)} label={row.status} />
      ),
    },
    {
      key: "users",
      header: "Users",
      render: (row: PlatformTenant) =>
        row._count?.users !== undefined ? String(row._count.users) : "—",
    },
    {
      key: "plan",
      header: "Plan",
      render: (row: PlatformTenant) => row.subscription?.planName ?? "—",
    },
    {
      key: "createdAt",
      header: "Created",
      render: (row: PlatformTenant) => formatDate(row.createdAt),
    },
  ];

  const statusOptions = ["ALL", "ACTIVE", "TRIAL", "SUSPENDED", "INACTIVE"];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-slate-800">Platform Administration</h1>

      {/* System Health */}
      {healthLoading ? (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      ) : health ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            System Health
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{health.tenantCount}</p>
              <p className="text-xs text-slate-500 mt-1">Tenants</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{health.activeSubscriptions}</p>
              <p className="text-xs text-slate-500 mt-1">Active Subs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{health.trialSubscriptions}</p>
              <p className="text-xs text-slate-500 mt-1">Trial Subs</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">{formatUptime(health.uptime)}</p>
              <p className="text-xs text-slate-500 mt-1">Uptime</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">DB:</span>
              <Badge variant={serviceStatusVariant(health.dbStatus)} label={health.dbStatus} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Cache:</span>
              <Badge variant={serviceStatusVariant(health.cacheStatus)} label={health.cacheStatus} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Queue:</span>
              <Badge variant={serviceStatusVariant(health.queueStatus)} label={health.queueStatus} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Last checked: {new Date(health.timestamp).toLocaleTimeString()} (auto-refreshes every 30s)
          </p>
        </div>
      ) : null}

      {/* Tenant list */}
      <div>
        <h2 className="text-lg font-medium text-slate-700 mb-4">Tenants</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          <Input
            placeholder="Search tenants…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All Statuses" : s}
              </option>
            ))}
          </select>
        </div>

        <DataTable<PlatformTenant>
          columns={columns}
          data={tenants}
          isLoading={tenantsLoading}
          getRowKey={(row) => row.id}
          rowActions={(row) => (
            <div className="flex gap-2 justify-end">
              {row.status.toUpperCase() !== "SUSPENDED" && (
                <button
                  onClick={() => {
                    setSuspendTarget(row);
                    setSuspendReason("");
                  }}
                  className="text-xs px-2 py-1 rounded-md border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  Suspend
                </button>
              )}
              {row.status.toUpperCase() === "SUSPENDED" && (
                <button
                  onClick={() => {
                    if (window.confirm(`Activate tenant "${row.name}"?`)) {
                      activateMutation.mutate(row.id);
                    }
                  }}
                  disabled={activateMutation.isPending}
                  className="text-xs px-2 py-1 rounded-md border border-green-300 text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50"
                >
                  Activate
                </button>
              )}
            </div>
          )}
          pagination={
            meta
              ? {
                  page: meta.page,
                  pageSize: meta.pageSize,
                  total: meta.total,
                  totalPages: meta.totalPages,
                  onPageChange: setPage,
                }
              : undefined
          }
        />
      </div>

      {/* Suspend modal */}
      {suspendTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSuspendTarget(null)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-base font-semibold text-slate-800 mb-2">
              Suspend Tenant: {suspendTarget.name}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Please provide a reason for suspending this tenant. This will be
              logged.
            </p>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reason
            </label>
            <textarea
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="e.g. Payment overdue, policy violation..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSuspendTarget(null)}
                className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  suspendMutation.mutate({
                    id: suspendTarget.id,
                    reason: suspendReason,
                  })
                }
                disabled={!suspendReason.trim() || suspendMutation.isPending}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {suspendMutation.isPending ? "Suspending…" : "Suspend"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
