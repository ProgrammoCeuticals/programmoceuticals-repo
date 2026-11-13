import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge, DataTable, Spinner } from "@rims/ui";
import { toast } from "@rims/ui";
import { useAuthStore } from "../../store/auth.store";
import api from "../../lib/api";

interface SubscriptionPlan {
  id: string;
  name: string;
  maxUsers: number;
}

interface Subscription {
  id: string;
  status: string;
  startDate: string;
  endDate: string | null;
  plan: SubscriptionPlan;
}

interface UsageSummary {
  activeUsers: number;
  totalEmployees: number;
  totalProjects: number;
  totalDocuments: number;
  asOf: string | null;
}

interface ModuleEntitlement {
  id: string;
  moduleCode: string;
  enabled: boolean;
  enabledAt: string | null;
}

interface SubResponse {
  data: Subscription;
}

interface UsageResponse {
  data: UsageSummary;
}

interface EntitlementsResponse {
  data: ModuleEntitlement[];
}

function statusVariant(status: string): string {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "active";
    case "TRIAL":
      return "pending";
    case "SUSPENDED":
      return "suspended";
    case "CANCELLED":
      return "inactive";
    default:
      return "default";
  }
}

function formatDate(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString();
}

export function SubscriptionPage() {
  const queryClient = useQueryClient();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canManage = hasPermission("institution.settings.manage");

  const { data: subData, isLoading: subLoading } = useQuery({
    queryKey: ["subscription-current"],
    queryFn: () =>
      api.get<SubResponse>("/subscriptions/current").then((r) => r.data),
  });

  const { data: usageData, isLoading: usageLoading } = useQuery({
    queryKey: ["usage-summary"],
    queryFn: () =>
      api.get<UsageResponse>("/usage/summary").then((r) => r.data),
  });

  const { data: entData, isLoading: entLoading } = useQuery({
    queryKey: ["subscription-entitlements"],
    queryFn: () =>
      api.get<EntitlementsResponse>("/subscriptions/entitlements").then((r) => r.data),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ moduleCode, enable }: { moduleCode: string; enable: boolean }) =>
      api
        .post(`/subscriptions/modules/${enable ? "enable" : "disable"}`, { moduleCode })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Module updated", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["subscription-entitlements"] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update module", description: err.message, variant: "error" });
    },
  });

  const subscription = subData?.data;
  const usage = usageData?.data;
  const entitlements: ModuleEntitlement[] = entData?.data ?? [];

  const usageCards = [
    { label: "Active Users", value: usage?.activeUsers ?? "—" },
    { label: "Employees", value: usage?.totalEmployees ?? "—" },
    { label: "Projects", value: usage?.totalProjects ?? "—" },
    { label: "Documents", value: usage?.totalDocuments ?? "—" },
  ];

  const entColumns = [
    { key: "moduleCode", header: "Module Code" },
    {
      key: "enabled",
      header: "Status",
      render: (row: ModuleEntitlement) => (
        <Badge
          variant={row.enabled ? "active" : "inactive"}
          label={row.enabled ? "Enabled" : "Disabled"}
        />
      ),
    },
    {
      key: "enabledAt",
      header: "Enabled At",
      render: (row: ModuleEntitlement) => formatDate(row.enabledAt),
    },
  ];

  if (subLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-slate-800">
        Subscription &amp; Modules
      </h1>

      {/* Current plan card */}
      {subscription && (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            Current Plan
          </h2>
          <div className="flex flex-wrap items-start gap-6">
            <div>
              <p className="text-2xl font-semibold text-slate-800">
                {subscription.plan.name}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div>
                <span className="font-medium">Status: </span>
                <Badge
                  variant={statusVariant(subscription.status)}
                  label={subscription.status}
                />
              </div>
              <div>
                <span className="font-medium">Start: </span>
                {formatDate(subscription.startDate)}
              </div>
              <div>
                <span className="font-medium">End: </span>
                {formatDate(subscription.endDate)}
              </div>
              <div>
                <span className="font-medium">Max Users: </span>
                {subscription.plan.maxUsers}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage summary cards */}
      {usageLoading ? (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {usageCards.map((card) => (
            <div
              key={card.label}
              className="rounded-lg border border-slate-200 bg-white p-4 text-center"
            >
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-xs text-slate-500 mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modules table */}
      <div>
        <h2 className="text-lg font-medium text-slate-700 mb-3">
          Module Entitlements
        </h2>
        {entLoading ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : (
          <DataTable<ModuleEntitlement>
            columns={entColumns}
            data={entitlements}
            isLoading={false}
            getRowKey={(row) => row.id}
            rowActions={
              canManage
                ? (row) => (
                    <button
                      onClick={() =>
                        toggleMutation.mutate({
                          moduleCode: row.moduleCode,
                          enable: !row.enabled,
                        })
                      }
                      disabled={toggleMutation.isPending}
                      className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                        row.enabled
                          ? "border-red-300 text-red-600 hover:bg-red-50"
                          : "border-green-300 text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {row.enabled ? "Disable" : "Enable"}
                    </button>
                  )
                : undefined
            }
          />
        )}
      </div>

      {/* Upgrade prompt */}
      {subscription && subscription.plan.name !== "Enterprise" && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="text-base font-semibold text-blue-800 mb-1">
            Upgrade to Enterprise
          </h3>
          <p className="text-sm text-blue-700">
            Get unlimited users, all modules, and dedicated support. Contact
            your account manager or{" "}
            <a
              href="mailto:sales@programmoceuticals.com"
              className="underline font-medium"
            >
              sales@programmoceuticals.com
            </a>{" "}
            to upgrade.
          </p>
        </div>
      )}
    </div>
  );
}
