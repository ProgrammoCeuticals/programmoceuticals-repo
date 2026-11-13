import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Users2, Building2, Mail, Activity, FolderKanban, CheckSquare,
  Bell, BellOff, ArrowRight, ClipboardList, FileText, DollarSign,
  BookOpen, ShieldCheck, BarChart2, Target, Layers,
} from "lucide-react";
import { Badge, Button, Card, EmptyState, Spinner } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

// ── Helpers ───────────────────────────────────────────────────────────────────

interface DeptNode { status?: string; children?: DeptNode[] }

function flattenDepts(nodes: DeptNode[]): DeptNode[] {
  const result: DeptNode[] = [];
  const stack = [...nodes];
  while (stack.length) {
    const node = stack.pop()!;
    result.push(node);
    if (node.children?.length) stack.push(...node.children);
  }
  return result;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const TODAY = new Date().toLocaleDateString("en-US", {
  weekday: "long", month: "long", day: "numeric",
});

// ── KPI Card ──────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  isLoading: boolean;
  onClick?: () => void;
}

function KpiCard({ label, value, icon, iconBg, isLoading, onClick }: KpiCardProps) {
  return (
    <Card>
      <button
        className={`w-full text-left flex items-center gap-3 ${onClick ? "cursor-pointer" : "cursor-default"}`}
        onClick={onClick}
        disabled={!onClick}
      >
        <div className={`p-3 rounded-xl ${iconBg} shrink-0`}>{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">{label}</p>
          {isLoading
            ? <div className="h-7 w-14 bg-slate-200 animate-pulse rounded mt-1" />
            : <p className="text-2xl font-bold text-slate-900 leading-tight">{value}</p>
          }
        </div>
      </button>
    </Card>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

const PRIORITY_VARIANT: Record<string, "active" | "pending" | "suspended" | "inactive"> = {
  CRITICAL: "suspended", HIGH: "pending", MEDIUM: "active", LOW: "inactive",
};

interface Task {
  id: string; title: string; status: string; priority: string;
  dueDate: string | null; researchProject?: { title: string } | null;
}
interface Notification {
  id: string; title: string; body: string; status: string;
  createdAt: string; actionUrl?: string | null;
}
interface AuditEvent {
  id: string; actorId: string; action: string; resourceType: string; createdAt: string;
}
interface PendingItem {
  id: string; label: string; sub: string; href: string; type: string;
}
interface KpiAssignment {
  id: string;
  kpiDefinition?: { name: string } | null;
  weight: number | null;
  target: number | null;
  result?: { status: string; value: number | null } | null;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  // ── KPI queries ─────────────────────────────────────────────────────────────

  const { data: empData, isLoading: empLoading } = useQuery({
    queryKey: ["employees", "count"],
    queryFn: () => api.get("/employees?pageSize=1").then((r) => r.data),
    enabled: hasPermission("employees.view"),
  });
  const { data: deptData, isLoading: deptLoading } = useQuery({
    queryKey: ["departments", "active-count"],
    queryFn: () => api.get("/departments").then((r) => r.data),
    enabled: hasPermission("departments.view"),
  });
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users", "pending-count"],
    queryFn: () => api.get("/users?status=PENDING_VERIFICATION&pageSize=1").then((r) => r.data),
    enabled: hasPermission("users.view"),
  });
  const dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: auditData, isLoading: auditLoading } = useQuery({
    queryKey: ["audit", "recent-count"],
    queryFn: () => api.get(`/audit-events?dateFrom=${dateFrom}&pageSize=1`).then((r) => r.data),
    enabled: hasPermission("audit.view"),
  });
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["research-projects", "active-count"],
    queryFn: () => api.get("/research/projects?pageSize=1&status=ACTIVE").then((r) => r.data),
    enabled: hasPermission("research.projects.view"),
  });
  const { data: tasksCountData, isLoading: tasksCountLoading } = useQuery({
    queryKey: ["tasks", "in-progress-count"],
    queryFn: () => api.get("/tasks?pageSize=1&status=IN_PROGRESS").then((r) => r.data),
    enabled: hasPermission("tasks.view"),
  });
  const { data: docsData, isLoading: docsLoading } = useQuery({
    queryKey: ["documents", "pending-count"],
    queryFn: () => api.get("/documents?pageSize=1&status=UNDER_REVIEW").then((r) => r.data),
    enabled: hasPermission("documents.view"),
  });
  const { data: manuscriptsData, isLoading: manuscriptsLoading } = useQuery({
    queryKey: ["manuscripts", "in-review-count"],
    queryFn: () => api.get("/publications?pageSize=1&status=UNDER_REVIEW").then((r) => r.data),
    enabled: hasPermission("publications.view"),
  });
  const { data: qualityData, isLoading: qualityLoading } = useQuery({
    queryKey: ["quality", "in-progress-count"],
    queryFn: () => api.get("/quality/reviews?pageSize=1&status=IN_PROGRESS").then((r) => r.data),
    enabled: hasPermission("quality.reviews.view"),
  });

  // ── Pending approvals ────────────────────────────────────────────────────────

  const { data: pendingProjectsData, isLoading: pendingProjectsLoading } = useQuery({
    queryKey: ["research-projects", "pending-approval"],
    queryFn: () => api.get("/research/projects?pageSize=5&status=PENDING_APPROVAL").then((r) => r.data),
    enabled: hasPermission("research.projects.approve"),
  });
  const { data: pendingBudgetsData, isLoading: pendingBudgetsLoading } = useQuery({
    queryKey: ["budgets", "pending"],
    queryFn: () => api.get("/finance/budgets?approvalStatus=PENDING").then((r) => r.data),
    enabled: hasPermission("finance.view") || hasPermission("finance.budgets.approve"),
  });
  const { data: pendingDocsData, isLoading: pendingDocsLoading } = useQuery({
    queryKey: ["documents", "pending-review-list"],
    queryFn: () => api.get("/documents?pageSize=5&status=UNDER_REVIEW").then((r) => r.data),
    enabled: hasPermission("documents.approve"),
  });

  // ── My tasks + notifications + KPI assignments ────────────────────────────────

  const { data: myTasksData, isLoading: myTasksLoading } = useQuery({
    queryKey: ["tasks", "mine-dashboard"],
    queryFn: () => api.get("/tasks?pageSize=5&status=IN_PROGRESS").then((r) => r.data),
    enabled: hasPermission("tasks.view"),
  });
  const { data: notifData, isLoading: notifLoading } = useQuery({
    queryKey: ["notifications", "unread-dashboard"],
    queryFn: () => api.get("/notifications?status=UNREAD&pageSize=5").then((r) => r.data),
  });
  const markAllRead = useMutation({
    mutationFn: () => api.post("/notifications/read-all"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const { data: recentAudit, isLoading: auditRecLoading } = useQuery({
    queryKey: ["audit", "recent"],
    queryFn: () => api.get("/audit-events?pageSize=5").then((r) => r.data),
    enabled: hasPermission("audit.view"),
  });
  const { data: kpiData, isLoading: kpiLoading } = useQuery({
    queryKey: ["my-performance", "dashboard"],
    queryFn: () => api.get("/performance/assignments?subjectType=EMPLOYEE&subjectId=me&pageSize=5").then((r) => r.data),
    enabled: hasPermission("performance.cycles.view"),
  });

  // ── Derived values ────────────────────────────────────────────────────────────

  const totalEmployees: string | number = empData?.meta?.total ?? "—";
  const activeDepts: string | number = (() => {
    if (!deptData?.data) return "—";
    return flattenDepts(deptData.data as DeptNode[]).filter((d) => d.status === "ACTIVE").length;
  })();
  const pendingInvites: string | number = usersData?.meta?.total ?? "—";
  const auditCount: string | number = auditData?.meta?.total ?? "—";
  const activeProjects: string | number = projectsData?.meta?.total ?? "—";
  const openTasks: string | number = tasksCountData?.meta?.total ?? "—";
  const pendingDocs: string | number = docsData?.meta?.total ?? "—";
  const pendingBudgets: string | number = Array.isArray(pendingBudgetsData) ? pendingBudgetsData.length : "—";
  const manuscriptsInReview: string | number = manuscriptsData?.meta?.total ?? "—";
  const qualityInProgress: string | number = qualityData?.meta?.total ?? "—";

  const myTasks: Task[] = myTasksData?.data ?? [];
  const notifications: Notification[] = notifData?.data ?? [];
  const unreadCount: number = notifData?.meta?.total ?? 0;
  const recentEvents: AuditEvent[] = recentAudit?.data ?? [];
  const kpiAssignments: KpiAssignment[] = kpiData?.data ?? [];

  // Build consolidated pending approvals list
  const pendingItems: PendingItem[] = [
    ...((pendingProjectsData?.data ?? []) as Array<{ id: string; title: string; status: string }>).map((p) => ({
      id: p.id, label: p.title, sub: "Research Project", href: `/research/projects/${p.id}`, type: "project",
    })),
    ...((Array.isArray(pendingBudgetsData) ? pendingBudgetsData.slice(0, 5) : (pendingBudgetsData?.data ?? [])) as Array<{ id: string; name: string; approvedAmount: number }>).map((b) => ({
      id: b.id, label: b.name ?? b.id.slice(0, 8), sub: `Budget · $${Number(b.approvedAmount)?.toLocaleString() ?? "—"}`, href: `/finance/budgets/${b.id}`, type: "budget",
    })),
    ...((pendingDocsData?.data ?? []) as Array<{ id: string; title: string; documentType: string }>).map((d) => ({
      id: d.id, label: d.title, sub: `Document · ${d.documentType ?? ""}`, href: `/documents/${d.id}`, type: "document",
    })),
  ];
  const pendingApprovalsLoading = pendingProjectsLoading || pendingBudgetsLoading || pendingDocsLoading;
  const showPendingApprovals =
    hasPermission("research.projects.approve") ||
    hasPermission("finance.budgets.approve") ||
    hasPermission("documents.approve");

  // KPI grid config
  const kpis: KpiCardProps[] = [
    hasPermission("employees.view") && { label: "Total Employees", value: totalEmployees, icon: <Users2 size={18} className="text-blue-600" />, iconBg: "bg-blue-50", isLoading: empLoading, onClick: () => navigate("/employees") },
    hasPermission("departments.view") && { label: "Active Departments", value: activeDepts, icon: <Building2 size={18} className="text-emerald-600" />, iconBg: "bg-emerald-50", isLoading: deptLoading, onClick: () => navigate("/departments") },
    hasPermission("research.projects.view") && { label: "Active Projects", value: activeProjects, icon: <FolderKanban size={18} className="text-indigo-600" />, iconBg: "bg-indigo-50", isLoading: projectsLoading, onClick: () => navigate("/research/projects") },
    hasPermission("tasks.view") && { label: "In-Progress Tasks", value: openTasks, icon: <CheckSquare size={18} className="text-amber-600" />, iconBg: "bg-amber-50", isLoading: tasksCountLoading, onClick: () => navigate("/tasks") },
    hasPermission("documents.view") && { label: "Docs Pending Review", value: pendingDocs, icon: <FileText size={18} className="text-orange-600" />, iconBg: "bg-orange-50", isLoading: docsLoading, onClick: () => navigate("/documents") },
    hasPermission("finance.view") && { label: "Budgets Pending", value: pendingBudgets, icon: <DollarSign size={18} className="text-green-600" />, iconBg: "bg-green-50", isLoading: pendingBudgetsLoading, onClick: () => navigate("/finance/budgets") },
    hasPermission("publications.view") && { label: "Manuscripts In Review", value: manuscriptsInReview, icon: <BookOpen size={18} className="text-pink-600" />, iconBg: "bg-pink-50", isLoading: manuscriptsLoading, onClick: () => navigate("/publications") },
    hasPermission("quality.reviews.view") && { label: "Quality Reviews", value: qualityInProgress, icon: <ShieldCheck size={18} className="text-teal-600" />, iconBg: "bg-teal-50", isLoading: qualityLoading, onClick: () => navigate("/quality/reviews") },
    hasPermission("users.view") && { label: "Pending Invitations", value: pendingInvites, icon: <Mail size={18} className="text-rose-600" />, iconBg: "bg-rose-50", isLoading: usersLoading, onClick: () => navigate("/users") },
    hasPermission("audit.view") && { label: "Audit Events (7d)", value: auditCount, icon: <Activity size={18} className="text-purple-600" />, iconBg: "bg-purple-50", isLoading: auditLoading, onClick: () => navigate("/audit") },
  ].filter(Boolean) as KpiCardProps[];

  // Quick links config
  const quickLinks = [
    hasPermission("research.projects.view") && { label: "Research", icon: <FolderKanban size={20} />, href: "/research/projects", color: "text-indigo-600 bg-indigo-50" },
    hasPermission("tasks.view") && { label: "Tasks", icon: <CheckSquare size={20} />, href: "/tasks", color: "text-amber-600 bg-amber-50" },
    hasPermission("finance.view") && { label: "Finance", icon: <DollarSign size={20} />, href: "/finance/budgets", color: "text-green-600 bg-green-50" },
    hasPermission("documents.view") && { label: "Documents", icon: <FileText size={20} />, href: "/documents", color: "text-orange-600 bg-orange-50" },
    hasPermission("publications.view") && { label: "Publications", icon: <BookOpen size={20} />, href: "/publications", color: "text-pink-600 bg-pink-50" },
    hasPermission("quality.reviews.view") && { label: "Quality", icon: <ShieldCheck size={20} />, href: "/quality/reviews", color: "text-teal-600 bg-teal-50" },
    hasPermission("performance.cycles.view") && { label: "Performance", icon: <Target size={20} />, href: "/performance/my", color: "text-violet-600 bg-violet-50" },
    hasPermission("employees.view") && { label: "Employees", icon: <Users2 size={20} />, href: "/employees", color: "text-blue-600 bg-blue-50" },
    { label: "Analytics", icon: <BarChart2 size={20} />, href: "/analytics", color: "text-slate-600 bg-slate-100" },
    hasPermission("documents.view") && { label: "Reports", icon: <Layers size={20} />, href: "/reports/executive-overview", color: "text-cyan-600 bg-cyan-50" },
  ].filter(Boolean) as { label: string; icon: React.ReactNode; href: string; color: string }[];

  const pendingTypeIcon: Record<string, React.ReactNode> = {
    project: <FolderKanban size={14} className="text-indigo-500" />,
    budget: <DollarSign size={14} className="text-green-500" />,
    document: <FileText size={14} className="text-orange-500" />,
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {greeting()}, {user?.firstName ?? "there"} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">{TODAY}</p>
      </div>

      {/* KPI grid */}
      {kpis.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
        </div>
      )}

      {/* Pending Approvals */}
      {showPendingApprovals && (
        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <ShieldCheck size={16} />
                Pending Approvals
                {pendingItems.length > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-rose-600 text-white text-xs font-bold">
                    {pendingItems.length}
                  </span>
                )}
              </div>
            </div>
          }
        >
          {pendingApprovalsLoading ? (
            <div className="flex justify-center py-6"><Spinner /></div>
          ) : pendingItems.length === 0 ? (
            <EmptyState title="No pending approvals" description="Items awaiting your approval will appear here." />
          ) : (
            <ul className="divide-y divide-slate-100 -mx-6 -mb-6">
              {pendingItems.map((item) => (
                <li
                  key={`${item.type}-${item.id}`}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => navigate(item.href)}
                >
                  <span className="shrink-0">{pendingTypeIcon[item.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.sub}</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 shrink-0" />
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {/* Tasks + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hasPermission("tasks.view") && (
          <Card
            header={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckSquare size={16} />In-Progress Tasks
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/tasks")}>
                  View all <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            }
          >
            {myTasksLoading ? (
              <div className="flex justify-center py-6"><Spinner /></div>
            ) : myTasks.length === 0 ? (
              <EmptyState title="No in-progress tasks" description="Tasks will appear here." />
            ) : (
              <ul className="divide-y divide-slate-100 -mx-6 -mb-6">
                {myTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-start gap-3 px-6 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                      {task.researchProject && (
                        <p className="text-xs text-slate-400 truncate">{task.researchProject.title}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge label={task.priority} variant={PRIORITY_VARIANT[task.priority] ?? "inactive"} />
                      {task.dueDate && (
                        <span className="text-xs text-slate-400">{new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Bell size={16} />
                Notifications
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-blue-600 text-white text-xs font-bold">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending}>
                  <BellOff size={14} className="mr-1" /> Mark all read
                </Button>
              )}
            </div>
          }
        >
          {notifLoading ? (
            <div className="flex justify-center py-6"><Spinner /></div>
          ) : notifications.length === 0 ? (
            <EmptyState title="You're all caught up" description="New notifications will appear here." />
          ) : (
            <ul className="divide-y divide-slate-100 -mx-6 -mb-6">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`px-6 py-3 hover:bg-slate-50 transition-colors ${n.actionUrl ? "cursor-pointer" : ""}`}
                  onClick={() => n.actionUrl && navigate(n.actionUrl)}
                >
                  <div className="flex items-start gap-2">
                    {n.status === "UNREAD" && <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                    <div className={n.status !== "UNREAD" ? "pl-4" : ""}>
                      <p className="text-sm font-medium text-slate-800">{n.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{n.body}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* My KPI Assignments */}
      {hasPermission("performance.cycles.view") && (
        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Target size={16} />My KPI Assignments
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/performance/my")}>
                View all <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          }
        >
          {kpiLoading ? (
            <div className="flex justify-center py-6"><Spinner /></div>
          ) : kpiAssignments.length === 0 ? (
            <EmptyState title="No KPI assignments" description="Your KPI assignments will appear here when a cycle is active." />
          ) : (
            <div className="overflow-x-auto -mx-6 -mb-6">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500 uppercase tracking-wide">
                    <th className="px-6 py-3 font-medium">KPI</th>
                    <th className="px-6 py-3 font-medium">Target</th>
                    <th className="px-6 py-3 font-medium">Weight</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {kpiAssignments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-700">{a.kpiDefinition?.name ?? "—"}</td>
                      <td className="px-6 py-3 text-slate-500">{a.target ?? "—"}</td>
                      <td className="px-6 py-3 text-slate-500">{a.weight != null ? `${a.weight}%` : "—"}</td>
                      <td className="px-6 py-3">
                        {a.result
                          ? <Badge label={a.result.status} />
                          : <Badge variant="inactive" label="Not Submitted" />
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Quick Links */}
      {quickLinks.length > 0 && (
        <Card header={<span className="text-slate-700 font-medium">Quick Links</span>}>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3 pt-1">
            {quickLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className={`p-2 rounded-lg ${link.color}`}>{link.icon}</div>
                <span className="text-xs text-slate-600 font-medium text-center leading-tight">{link.label}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Audit Activity */}
      {hasPermission("audit.view") && (
        <Card
          header={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <ClipboardList size={16} />Recent Activity
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/audit")}>
                View all <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          }
        >
          {auditRecLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-5 bg-slate-200 animate-pulse rounded" />)}
            </div>
          ) : recentEvents.length === 0 ? (
            <EmptyState title="No recent activity" description="Audit events will appear here as actions are taken." />
          ) : (
            <div className="overflow-x-auto -mx-6 -mb-6">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500 uppercase tracking-wide">
                    <th className="px-6 py-3 font-medium">Actor</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                    <th className="px-6 py-3 font-medium">Resource</th>
                    <th className="px-6 py-3 font-medium">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-mono text-slate-600">{event.actorId?.slice(0, 8) ?? "—"}</td>
                      <td className="px-6 py-3 text-slate-700">{event.action}</td>
                      <td className="px-6 py-3 text-slate-500">{event.resourceType}</td>
                      <td className="px-6 py-3 text-slate-400">{timeAgo(event.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
