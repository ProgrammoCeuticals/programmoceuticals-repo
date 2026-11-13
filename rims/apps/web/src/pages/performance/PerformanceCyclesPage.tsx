import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader, Button, Badge, DataTable } from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────

interface KpiAssignment {
  id: string;
}

interface PerformanceCycle {
  id: string;
  name: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  kpiAssignments?: KpiAssignment[];
}

interface CyclesResponse {
  data: PerformanceCycle[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

// ── Helpers ────────────────────────────────────────────────────────────────


function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

// ── PerformanceCyclesPage ──────────────────────────────────────────────────

export function PerformanceCyclesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const { data, isLoading } = useQuery({
    queryKey: ["performance-cycles"],
    queryFn: () =>
      api
        .get<CyclesResponse>("/performance/cycles?pageSize=100")
        .then((r) => r.data),
  });

  const cycles: PerformanceCycle[] =
    (data as CyclesResponse | undefined)?.data ?? [];

  function useStatusAction(action: string) {
    return useMutation({
      mutationFn: (cycleId: string) =>
        api
          .post(`/performance/cycles/${cycleId}/${action}`)
          .then((r) => r.data),
      onSuccess: () => {
        toast({ title: "Cycle updated", variant: "success" });
        queryClient.invalidateQueries({ queryKey: ["performance-cycles"] });
      },
      onError: (err: Error) => {
        toast({ title: "Action failed", description: err.message, variant: "error" });
      },
    });
  }

  const activateMutation = useStatusAction("activate");
  const closeMutation = useStatusAction("close");
  const lockMutation = useStatusAction("lock");

  const columns = [
    { key: "name", header: "Name" },
    {
      key: "status",
      header: "Status",
      render: (row: PerformanceCycle) => (
        <Badge label={row.status} />
      ),
    },
    {
      key: "period",
      header: "Period",
      render: (row: PerformanceCycle) =>
        `${formatDate(row.startDate)} – ${formatDate(row.endDate)}`,
    },
    {
      key: "kpiCount",
      header: "KPI Assignments",
      render: (row: PerformanceCycle) =>
        String(row.kpiAssignments?.length ?? 0),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Performance Cycles"
        actions={
          hasPermission("performance.cycles.manage") ? (
            <Button onClick={() => navigate("/performance/cycles/new")}>
              New Cycle
            </Button>
          ) : undefined
        }
      />

      <DataTable<PerformanceCycle>
        columns={columns}
        data={cycles}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        rowActions={(row) => (
          <div className="flex items-center gap-2 justify-end">
            {row.status === "DRAFT" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => activateMutation.mutate(row.id)}
                loading={activateMutation.isPending}
              >
                Activate
              </Button>
            )}
            {row.status === "ACTIVE" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => closeMutation.mutate(row.id)}
                loading={closeMutation.isPending}
              >
                Close
              </Button>
            )}
            {row.status === "CLOSED" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => lockMutation.mutate(row.id)}
                loading={lockMutation.isPending}
              >
                Lock
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/performance/cycles/${row.id}`)}
            >
              View
            </Button>
          </div>
        )}
      />
    </div>
  );
}
