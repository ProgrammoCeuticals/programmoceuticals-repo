import { useQuery } from "@tanstack/react-query";
import { BarChart } from "@rims/ui";
import { Badge, DataTable, Spinner } from "@rims/ui";
import api from "../../lib/api";

interface TrendsResult {
  labels: string[];
  series: { name: string; data: number[] }[];
  generatedAt: string;
}

interface WorkloadItem {
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  projectMembershipCount: number;
  openTaskCount: number;
}

interface RiskProject {
  projectId: string;
  title: string;
  hasOverdueMilestone: boolean;
  noRecentUpdate: boolean;
  approachingDeadline: boolean;
}

interface TrendsResponse {
  data: TrendsResult;
}

interface WorkloadResponse {
  data: WorkloadItem[];
}

interface RisksResponse {
  data: RiskProject[];
}

function getPeriodDates(): { periodStart: string; periodEnd: string } {
  const now = new Date();
  const periodEnd = now.toISOString().split("T")[0];
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setDate(1);
  const periodStart = sixMonthsAgo.toISOString().split("T")[0];
  return { periodStart, periodEnd };
}

export function AnalyticsDashboardPage() {
  const { periodStart, periodEnd } = getPeriodDates();

  const projectTrendsQuery = useQuery({
    queryKey: ["analytics-trends-projects", periodStart, periodEnd],
    queryFn: () =>
      api
        .get<TrendsResponse>("/analytics/trends", {
          params: {
            metric: "research_projects_by_month",
            periodStart,
            periodEnd,
            interval: "monthly",
          },
        })
        .then((r) => r.data),
  });

  const taskTrendsQuery = useQuery({
    queryKey: ["analytics-trends-tasks", periodStart, periodEnd],
    queryFn: () =>
      api
        .get<TrendsResponse>("/analytics/trends", {
          params: {
            metric: "tasks_completed_by_week",
            periodStart,
            periodEnd,
            interval: "weekly",
          },
        })
        .then((r) => r.data),
  });

  const risksQuery = useQuery({
    queryKey: ["analytics-project-risks"],
    queryFn: () =>
      api.get<RisksResponse>("/analytics/project-risks").then((r) => r.data),
  });

  const workloadQuery = useQuery({
    queryKey: ["analytics-workload"],
    queryFn: () =>
      api.get<WorkloadResponse>("/analytics/workload").then((r) => r.data),
  });

  // Build chart data from trends
  const projectTrends = projectTrendsQuery.data?.data;
  const taskTrends = taskTrendsQuery.data?.data;

  const projectChartData =
    projectTrends?.labels.map((label, i) => ({
      label,
      value: projectTrends.series[0]?.data[i] ?? 0,
    })) ?? [];

  const taskChartData =
    taskTrends?.labels.map((label, i) => ({
      label,
      value: taskTrends.series[0]?.data[i] ?? 0,
    })) ?? [];

  const risks = (risksQuery.data?.data ?? []).filter(
    (r) => r.hasOverdueMilestone || r.noRecentUpdate || r.approachingDeadline,
  );

  const workload = [...(workloadQuery.data?.data ?? [])].sort(
    (a, b) => b.openTaskCount - a.openTaskCount,
  );

  const riskColumns = [
    { key: "title", header: "Title" },
    {
      key: "hasOverdueMilestone",
      header: "Overdue Milestones",
      render: (row: RiskProject) =>
        row.hasOverdueMilestone ? (
          <Badge variant="suspended" label="Yes" />
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        ),
    },
    {
      key: "noRecentUpdate",
      header: "No Recent Updates",
      render: (row: RiskProject) =>
        row.noRecentUpdate ? (
          <Badge variant="suspended" label="Yes" />
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        ),
    },
    {
      key: "approachingDeadline",
      header: "Approaching Deadline",
      render: (row: RiskProject) =>
        row.approachingDeadline ? (
          <Badge variant="pending" label="Yes" />
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        ),
    },
  ];

  const workloadColumns = [
    { key: "departmentName", header: "Department" },
    { key: "employeeCount", header: "Employees" },
    { key: "projectMembershipCount", header: "Project Memberships" },
    { key: "openTaskCount", header: "Open Tasks" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-slate-800">
        Analytics &amp; Intelligence
      </h1>

      {/* Trends section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          {projectTrendsQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <BarChart
              data={projectChartData}
              title="Research Projects by Month"
              color="#3b82f6"
            />
          )}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          {taskTrendsQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <BarChart
              data={taskChartData}
              title="Tasks Completed by Week"
              color="#10b981"
            />
          )}
        </div>
      </div>

      {/* Project Risk Indicators */}
      <div>
        <h2 className="text-lg font-medium text-slate-700 mb-3">
          Project Risk Indicators
        </h2>
        {risksQuery.isLoading ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : (
          <DataTable<RiskProject>
            columns={riskColumns}
            data={risks}
            isLoading={false}
            getRowKey={(row) => row.projectId}
          />
        )}
      </div>

      {/* Workload Distribution */}
      <div>
        <h2 className="text-lg font-medium text-slate-700 mb-3">
          Workload Distribution
        </h2>
        {workloadQuery.isLoading ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : (
          <DataTable<WorkloadItem>
            columns={workloadColumns}
            data={workload}
            isLoading={false}
            getRowKey={(row) => row.departmentId}
          />
        )}
      </div>
    </div>
  );
}
