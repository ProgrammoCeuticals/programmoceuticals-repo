import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader, Button, Badge, Modal, FormField, Input, Select, Spinner } from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────

interface Employee { id: string; firstName: string; lastName: string; }
interface Member { id: string; employeeId: string; role: string | null; employee?: Employee | null; }
interface Milestone { id: string; title: string; dueDate: string | null; status: string; }
interface Task {
  id: string; title: string; status: string; priority: string;
  dueDate: string | null;
  assignee?: { firstName: string; lastName: string } | null;
  projectTeam?: { id: string; name: string } | null;
}
interface ProjectTeamMember { id: string; employeeId: string; role: string; employee?: Employee | null; }
interface ProjectTeam {
  id: string; name: string; description: string | null;
  startDate: string | null; endDate: string | null;
  leaderId: string | null; leader?: Employee | null;
  members?: ProjectTeamMember[];
  _count?: { tasks: number };
}
interface StatusUpdate { id: string; content: string; createdAt: string; author?: { firstName: string; lastName: string } | null; }
interface Approval { id: string; approvalType: string; status: string; referenceNo: string | null; approvedAt: string | null; }
interface ResearchProject {
  id: string; title: string; summary: string | null; methodology: string | null;
  status: string; startDate: string | null; endDate: string | null; ethicsStatus: string | null;
  principalInvestigator?: Employee | null;
  department?: { name: string } | null;
  members?: Member[]; milestones?: Milestone[];
  projectTeams?: ProjectTeam[]; tasks?: Task[];
  statusUpdates?: StatusUpdate[]; approvals?: Approval[];
}
interface BudgetSummary {
  approvedAmount: number; totalSpent: number; remaining: number; currency: string;
  categorySummary: { name: string; allocated: number; spent: number }[];
}
interface Budget {
  id: string; approvedAmount: string; currency: string; approvalStatus: string;
  fundingSource?: { name: string } | null;
}
interface Expense {
  id: string; description: string; amount: string; currency: string;
  transactionDate: string; reference: string | null;
  category?: { name: string } | null;
}

type Tab = "overview" | "teams" | "milestones" | "tasks" | "finance" | "updates" | "approvals";

function fmt(date: string | null | undefined) { return date ? new Date(date).toLocaleDateString() : "—"; }
function money(n: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

// ── AddMemberModal ─────────────────────────────────────────────────────────

function AddMemberModal({ open, onClose, projectId }: { open: boolean; onClose: () => void; projectId: string }) {
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState("MEMBER");
  const { data: empData } = useQuery({
    queryKey: ["employees-list"],
    queryFn: () => api.get<{ data: Employee[] }>("/employees?pageSize=200").then((r) => r.data),
    enabled: open,
  });
  const employees: Employee[] = (empData as { data?: Employee[] } | undefined)?.data ?? [];
  const mutation = useMutation({
    mutationFn: () => api.post(`/research/projects/${projectId}/members`, { employeeId, role }).then((r) => r.data),
    onSuccess: () => { toast({ title: "Member added", variant: "success" }); queryClient.invalidateQueries({ queryKey: ["research-project", projectId] }); setEmployeeId(""); setRole("MEMBER"); onClose(); },
    onError: (err: Error) => toast({ title: "Failed to add member", description: err.message, variant: "error" }),
  });
  return (
    <Modal open={open} onClose={onClose} title="Add Member"
      footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button><Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!employeeId}>Add Member</Button></div>}
    >
      <div className="space-y-4">
        <FormField label="Employee" htmlFor="member-employee" required>
          <Select id="member-employee" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}
            options={[{ value: "", label: "Select employee" }, ...employees.map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName}` }))]} />
        </FormField>
        <FormField label="Role" htmlFor="member-role">
          <Input id="member-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. MEMBER, CO_PI" />
        </FormField>
      </div>
    </Modal>
  );
}

// ── AddMilestoneModal ──────────────────────────────────────────────────────

function AddMilestoneModal({ open, onClose, projectId }: { open: boolean; onClose: () => void; projectId: string }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const mutation = useMutation({
    mutationFn: () => api.post(`/research/projects/${projectId}/milestones`, { title, dueDate: dueDate || undefined }).then((r) => r.data),
    onSuccess: () => { toast({ title: "Milestone added", variant: "success" }); queryClient.invalidateQueries({ queryKey: ["research-project", projectId] }); setTitle(""); setDueDate(""); onClose(); },
    onError: (err: Error) => toast({ title: "Failed to add milestone", description: err.message, variant: "error" }),
  });
  return (
    <Modal open={open} onClose={onClose} title="Add Milestone"
      footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button><Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!title.trim()}>Add Milestone</Button></div>}
    >
      <div className="space-y-4">
        <FormField label="Title" htmlFor="milestone-title" required>
          <Input id="milestone-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Milestone title" />
        </FormField>
        <FormField label="Due Date" htmlFor="milestone-due">
          <Input id="milestone-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </FormField>
      </div>
    </Modal>
  );
}

// ── AddTeamMemberModal ───────────────────────────────────────────────────────

function AddTeamMemberModal({ open, onClose, projectId, teamId, members, existingMemberIds }: { open: boolean; onClose: () => void; projectId: string; teamId: string; members: Member[]; existingMemberIds: string[] }) {
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState("MEMBER");
  const available = members.filter((m) => m.employee && !existingMemberIds.includes(m.employeeId));
  const mutation = useMutation({
    mutationFn: () => api.post(`/research/projects/${projectId}/teams/${teamId}/members`, { employeeId, role }).then((r) => r.data),
    onSuccess: () => { toast({ title: "Member added to team", variant: "success" }); queryClient.invalidateQueries({ queryKey: ["research-project", projectId] }); setEmployeeId(""); setRole("MEMBER"); onClose(); },
    onError: (err: Error) => toast({ title: "Failed to add member", description: err.message, variant: "error" }),
  });
  return (
    <Modal open={open} onClose={onClose} title="Add Team Member"
      footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button><Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!employeeId}>Add</Button></div>}
    >
      <div className="space-y-4">
        <FormField label="Project Member" htmlFor="tm-employee" required>
          <Select id="tm-employee" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}
            options={[{ value: "", label: available.length ? "Select member" : "All project members already in team" }, ...available.map((m) => ({ value: m.employeeId, label: `${m.employee!.firstName} ${m.employee!.lastName}` }))]} />
        </FormField>
        <FormField label="Role" htmlFor="tm-role">
          <Select id="tm-role" value={role} onChange={(e) => setRole(e.target.value)}
            options={[{ value: "MEMBER", label: "Member" }, { value: "LEAD", label: "Lead" }, { value: "ANALYST", label: "Analyst" }, { value: "REVIEWER", label: "Reviewer" }]} />
        </FormField>
      </div>
    </Modal>
  );
}

// ── CreateTeamModal ────────────────────────────────────────────────────────

function CreateTeamModal({ open, onClose, projectId, members }: { open: boolean; onClose: () => void; projectId: string; members: Member[] }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const mutation = useMutation({
    mutationFn: () => api.post(`/research/projects/${projectId}/teams`, { name, description: description || undefined, leaderId: leaderId || undefined, startDate: startDate || undefined, endDate: endDate || undefined }).then((r) => r.data),
    onSuccess: () => { toast({ title: "Team created", variant: "success" }); queryClient.invalidateQueries({ queryKey: ["research-project", projectId] }); setName(""); setDescription(""); setLeaderId(""); setStartDate(""); setEndDate(""); onClose(); },
    onError: (err: Error) => toast({ title: "Failed to create team", description: err.message, variant: "error" }),
  });
  return (
    <Modal open={open} onClose={onClose} title="New Project Team"
      footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button><Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!name.trim()}>Create Team</Button></div>}
    >
      <div className="space-y-4">
        <FormField label="Team Name" htmlFor="team-name" required>
          <Input id="team-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Data Collection Team" />
        </FormField>
        <FormField label="Description" htmlFor="team-desc">
          <Input id="team-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
        </FormField>
        <FormField label="Team Leader" htmlFor="team-leader">
          <Select id="team-leader" value={leaderId} onChange={(e) => setLeaderId(e.target.value)}
            options={[{ value: "", label: "No leader yet" }, ...members.filter((m) => m.employee).map((m) => ({ value: m.employeeId, label: `${m.employee!.firstName} ${m.employee!.lastName}` }))]} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Date" htmlFor="team-start"><Input id="team-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></FormField>
          <FormField label="End Date" htmlFor="team-end"><Input id="team-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></FormField>
        </div>
      </div>
    </Modal>
  );
}

// ── AddTaskModal ───────────────────────────────────────────────────────────

function AddTaskModal({ open, onClose, projectId, members, projectTeams }: { open: boolean; onClose: () => void; projectId: string; members: Member[]; projectTeams: ProjectTeam[] }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [projectTeamId, setProjectTeamId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const selectedTeam = projectTeams.find((t) => t.id === projectTeamId);
  const assigneePool = projectTeamId && selectedTeam ? (selectedTeam.members ?? []).filter((m) => m.employee) : members.filter((m) => m.employee);
  const mutation = useMutation({
    mutationFn: () => api.post("/tasks", { title, description: description || undefined, priority, researchProjectId: projectId, projectTeamId: projectTeamId || undefined, assigneeId: assigneeId || undefined, startDate: startDate || undefined, dueDate: dueDate || undefined }).then((r) => r.data),
    onSuccess: () => { toast({ title: "Task created", variant: "success" }); queryClient.invalidateQueries({ queryKey: ["research-project", projectId] }); queryClient.invalidateQueries({ queryKey: ["tasks"] }); setTitle(""); setDescription(""); setPriority("MEDIUM"); setProjectTeamId(""); setAssigneeId(""); setStartDate(""); setDueDate(""); onClose(); },
    onError: (err: Error) => toast({ title: "Failed to create task", description: err.message, variant: "error" }),
  });
  return (
    <Modal open={open} onClose={onClose} title="New Task"
      footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button><Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!title.trim()}>Create Task</Button></div>}
    >
      <div className="space-y-4">
        <FormField label="Title" htmlFor="task-title" required><Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" /></FormField>
        <FormField label="Description" htmlFor="task-desc"><Input id="task-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" /></FormField>
        <FormField label="Team" htmlFor="task-team">
          <Select id="task-team" value={projectTeamId} onChange={(e) => { setProjectTeamId(e.target.value); setAssigneeId(""); }}
            options={[{ value: "", label: "No team" }, ...projectTeams.map((t) => ({ value: t.id, label: t.name }))]} />
        </FormField>
        <FormField label="Assign To" htmlFor="task-assignee">
          <Select id="task-assignee" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}
            options={[{ value: "", label: "Unassigned" }, ...assigneePool.map((m) => ({ value: m.employeeId, label: `${m.employee!.firstName} ${m.employee!.lastName}` }))]} />
        </FormField>
        <FormField label="Priority" htmlFor="task-priority">
          <Select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value)}
            options={[{ value: "LOW", label: "Low" }, { value: "MEDIUM", label: "Medium" }, { value: "HIGH", label: "High" }, { value: "CRITICAL", label: "Critical" }]} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Date" htmlFor="task-start"><Input id="task-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></FormField>
          <FormField label="Due Date" htmlFor="task-due"><Input id="task-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></FormField>
        </div>
      </div>
    </Modal>
  );
}

// ── FinanceTab ─────────────────────────────────────────────────────────────

function FinanceTab({ projectId }: { projectId: string }) {
  const { data: budgetsData } = useQuery({
    queryKey: ["project-budgets", projectId],
    queryFn: () => api.get<{ data: Budget[] }>(`/finance/budgets?researchProjectId=${projectId}`).then((r) => r.data),
  });
  const budgets: Budget[] = (budgetsData as { data?: Budget[] } | undefined)?.data ?? [];
  const firstBudget = budgets[0];

  const { data: summaryData } = useQuery({
    queryKey: ["budget-summary", firstBudget?.id],
    queryFn: () => api.get<{ data: BudgetSummary }>(`/finance/budgets/${firstBudget!.id}/summary`).then((r) => r.data),
    enabled: !!firstBudget,
  });
  const summary: BudgetSummary | undefined = (summaryData as { data?: BudgetSummary } | undefined)?.data;

  const { data: expensesData } = useQuery({
    queryKey: ["budget-expenses", firstBudget?.id],
    queryFn: () => api.get<{ data: Expense[] }>(`/finance/expenses?budgetId=${firstBudget!.id}`).then((r) => r.data),
    enabled: !!firstBudget,
  });
  const expenses: Expense[] = (expensesData as { data?: Expense[] } | undefined)?.data ?? [];

  if (!firstBudget) {
    return <div className="bg-white border border-[#e2e8f0] px-4 py-8 text-center text-sm text-slate-500">No budget allocated to this project yet.</div>;
  }

  const currency = summary?.currency ?? firstBudget.currency;
  const pct = summary ? Math.min(100, Math.round((summary.totalSpent / summary.approvedAmount) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Budget overview cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Approved Budget", value: summary ? money(summary.approvedAmount, currency) : "—", color: "text-[#193441]" },
          { label: "Total Spent", value: summary ? money(summary.totalSpent, currency) : "—", color: "text-[#c53030]" },
          { label: "Remaining", value: summary ? money(summary.remaining, currency) : "—", color: "text-[#276749]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-[#e2e8f0] px-5 py-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Spend progress bar */}
      {summary && (
        <div className="bg-white border border-[#e2e8f0] px-5 py-4">
          <div className="flex justify-between text-[11px] text-[#718096] mb-2">
            <span>Budget utilisation</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-400" : "bg-[#276749]"}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {/* Funding source */}
      {firstBudget.fundingSource && (
        <div className="bg-white border border-[#e2e8f0] px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">Funding Source</p>
            <p className="text-sm font-semibold text-[#193441] mt-0.5">{firstBudget.fundingSource.name}</p>
          </div>
          <Badge label={firstBudget.approvalStatus} />
        </div>
      )}

      {/* Category breakdown */}
      {summary && summary.categorySummary.length > 0 && (
        <div className="bg-white border border-[#e2e8f0]">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441]">Category Breakdown</p>
          </div>
          <div className="divide-y divide-slate-100">
            {summary.categorySummary.map((cat) => {
              const catPct = cat.allocated > 0 ? Math.min(100, Math.round((cat.spent / cat.allocated) * 100)) : 0;
              return (
                <div key={cat.name} className="px-5 py-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-[#193441]">{cat.name}</span>
                    <span className="text-[#718096] text-[11px]">{money(cat.spent, currency)} / {money(cat.allocated, currency)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${catPct > 90 ? "bg-red-500" : catPct > 70 ? "bg-amber-400" : "bg-[#2a7699]"}`} style={{ width: `${catPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent expenses */}
      {expenses.length > 0 && (
        <div className="bg-white border border-[#e2e8f0]">
          <div className="px-5 py-3 border-b border-[#e2e8f0]">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441]">Expenses ({expenses.length})</p>
          </div>
          <div className="divide-y divide-slate-100">
            {expenses.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm text-[#193441]">{exp.description}</p>
                  <p className="text-[11px] text-[#718096] mt-0.5">
                    {exp.category?.name ?? "Uncategorised"} · {fmt(exp.transactionDate)}
                    {exp.reference ? ` · ${exp.reference}` : ""}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#193441]">{money(parseFloat(exp.amount), exp.currency)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── ResearchProjectDetailPage ──────────────────────────────────────────────

export function ResearchProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [addTeamMember, setAddTeamMember] = useState<{ teamId: string; existingIds: string[] } | null>(null);
  const [updateText, setUpdateText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["research-project", id],
    queryFn: () => api.get<{ data: ResearchProject }>(`/research/projects/${id}`).then((r) => r.data),
    enabled: !!id,
  });
  const project: ResearchProject | undefined = (data as { data?: ResearchProject } | undefined)?.data;

  const statusMutation = useMutation({
    mutationFn: (status: string) => api.patch(`/research/projects/${id}`, { status }).then((r) => r.data),
    onSuccess: () => { toast({ title: "Status updated", variant: "success" }); queryClient.invalidateQueries({ queryKey: ["research-project", id] }); },
    onError: (err: Error) => toast({ title: "Failed to update status", description: err.message, variant: "error" }),
  });

  const postUpdateMutation = useMutation({
    mutationFn: () => api.post(`/research/projects/${id}/status-updates`, { content: updateText }).then((r) => r.data),
    onSuccess: () => { toast({ title: "Update posted", variant: "success" }); queryClient.invalidateQueries({ queryKey: ["research-project", id] }); setUpdateText(""); },
    onError: (err: Error) => toast({ title: "Failed to post update", description: err.message, variant: "error" }),
  });

  if (isLoading) return <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>;
  if (!project) return <div className="p-8 text-center text-slate-500">Project not found.</div>;

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "teams", label: "Teams" },
    { key: "milestones", label: "Milestones" },
    { key: "tasks", label: "Tasks" },
    { key: "finance", label: "Finance" },
    { key: "updates", label: "Updates" },
    { key: "approvals", label: "Approvals" },
  ];

  return (
    <div>
      <PageHeader title={project.title} actions={<Button variant="ghost" onClick={() => navigate("/research/projects")}>← Back</Button>} />

      {/* Status bar */}
      <div className="bg-white border border-[#e2e8f0] px-6 py-4 mb-1 flex flex-wrap items-center gap-3">
        <Badge label={project.status} />
        {project.ethicsStatus && <span className="text-[11px] text-[#718096]">Ethics: <span className="font-semibold text-[#193441]">{project.ethicsStatus}</span></span>}
        <span className="text-[11px] text-[#718096]">PI: <span className="font-semibold text-[#193441]">{project.principalInvestigator ? `${project.principalInvestigator.firstName} ${project.principalInvestigator.lastName}` : "—"}</span></span>
        <span className="text-[11px] text-[#718096]">{fmt(project.startDate)} – {fmt(project.endDate)}</span>
        <div className="ml-auto flex gap-2">
          {project.status === "DRAFT" && <Button size="sm" variant="primary" onClick={() => statusMutation.mutate("PENDING_APPROVAL")} loading={statusMutation.isPending}>Submit for Approval</Button>}
          {project.status === "PENDING_APPROVAL" && hasPermission("research.projects.approve") && <Button size="sm" variant="primary" onClick={() => statusMutation.mutate("APPROVED")} loading={statusMutation.isPending}>Approve</Button>}
          {project.status === "APPROVED" && <Button size="sm" variant="primary" onClick={() => statusMutation.mutate("ACTIVE")} loading={statusMutation.isPending}>Activate</Button>}
          {project.status === "ACTIVE" && <><Button size="sm" variant="primary" onClick={() => statusMutation.mutate("COMPLETED")} loading={statusMutation.isPending}>Mark Complete</Button><Button size="sm" variant="ghost" onClick={() => statusMutation.mutate("ON_HOLD")} loading={statusMutation.isPending}>On Hold</Button></>}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b-2 border-[#e2e8f0] mb-5">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 border-b-[3px] transition-colors text-[11px] uppercase tracking-[0.06em] font-bold ${activeTab === tab.key ? "text-[#193441] border-[#193441]" : "text-[#718096] border-transparent hover:text-[#193441]"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Overview ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e2e8f0] p-6">
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              {[
                { label: "Methodology", value: project.methodology },
                { label: "Department", value: project.department?.name },
                { label: "Members", value: (project.members ?? []).length },
                { label: "Teams", value: (project.projectTeams ?? []).length },
                { label: "Milestones", value: (project.milestones ?? []).length },
                { label: "Tasks", value: (project.tasks ?? []).length },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">{label}</dt>
                  <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">{value ?? "—"}</dd>
                </div>
              ))}
            </dl>
            {project.summary && <p className="text-sm text-slate-600 mt-6 border-t border-slate-100 pt-4">{project.summary}</p>}
          </div>
          {/* Members list */}
          <div className="bg-white border border-[#e2e8f0]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#e2e8f0]">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441]">Members ({(project.members ?? []).length})</p>
              <Button size="sm" onClick={() => setMemberModalOpen(true)}>Add Member</Button>
            </div>
            <div className="divide-y divide-slate-100">
              {(project.members ?? []).length === 0
                ? <p className="px-5 py-6 text-sm text-slate-400 text-center">No members yet.</p>
                : (project.members ?? []).map((m) => (
                  <div key={m.id} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-[#193441]">{m.employee ? `${m.employee.firstName} ${m.employee.lastName}` : m.employeeId}</span>
                    <Badge label={m.role ?? "MEMBER"} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Teams ── */}
      {activeTab === "teams" && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441]">Project Teams</p>
            <Button size="sm" onClick={() => setTeamModalOpen(true)}>New Team</Button>
          </div>
          <div className="space-y-4">
            {(project.projectTeams ?? []).length === 0
              ? <div className="bg-white border border-[#e2e8f0] px-4 py-8 text-center text-sm text-slate-500">No teams yet.</div>
              : (project.projectTeams ?? []).map((team) => (
                <div key={team.id} className="bg-white border border-[#e2e8f0]">
                  <div className="flex items-start justify-between px-5 py-4 border-b border-[#e2e8f0]">
                    <div>
                      <p className="text-sm font-semibold text-[#193441]">{team.name}</p>
                      {team.description && <p className="text-[11px] text-[#718096] mt-0.5">{team.description}</p>}
                      <div className="flex flex-wrap gap-4 mt-2">
                        {team.leader && <span className="text-[11px] text-[#718096]">Lead: <span className="font-semibold text-[#193441]">{team.leader.firstName} {team.leader.lastName}</span></span>}
                        {team.startDate && <span className="text-[11px] text-[#718096]">{fmt(team.startDate)} – {fmt(team.endDate)}</span>}
                        <span className="text-[11px] text-[#718096]">{team._count?.tasks ?? 0} task{(team._count?.tasks ?? 0) !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setAddTeamMember({ teamId: team.id, existingIds: (team.members ?? []).map((m) => m.employeeId) })}>Add Member</Button>
                    <Button size="sm" variant="ghost" onClick={() => setActiveTab("tasks")}>View Tasks</Button>
                  </div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {(team.members ?? []).length === 0
                      ? <p className="px-5 py-3 text-[11px] text-slate-400">No members assigned.</p>
                      : (team.members ?? []).map((m) => (
                        <div key={m.id} className="flex items-center justify-between px-5 py-2.5">
                          <span className="text-[13px] text-[#193441]">{m.employee ? `${m.employee.firstName} ${m.employee.lastName}` : m.employeeId}</span>
                          <Badge variant={m.role === "LEAD" ? "active" : "default"} label={m.role} />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Milestones ── */}
      {activeTab === "milestones" && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441]">Milestones</p>
            <Button size="sm" onClick={() => setMilestoneModalOpen(true)}>Add Milestone</Button>
          </div>
          <div className="bg-white border border-[#e2e8f0] divide-y divide-slate-100">
            {(project.milestones ?? []).length === 0
              ? <p className="px-4 py-6 text-sm text-slate-500 text-center">No milestones yet.</p>
              : (project.milestones ?? []).map((m) => (
                <div key={m.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#193441]">{m.title}</p>
                    <p className="text-[11px] text-[#718096] mt-0.5">Due: {fmt(m.dueDate)}</p>
                  </div>
                  <Badge label={m.status} />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Tasks ── */}
      {activeTab === "tasks" && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441]">Tasks</p>
            <Button size="sm" onClick={() => setTaskModalOpen(true)}>New Task</Button>
          </div>
          <div className="bg-white border border-[#e2e8f0] divide-y divide-slate-100">
            {(project.tasks ?? []).length === 0
              ? <p className="px-4 py-6 text-sm text-slate-500 text-center">No tasks yet.</p>
              : (project.tasks ?? []).map((t) => (
                <div key={t.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <Link to={`/tasks/${t.id}`} className="text-sm font-medium text-[#193441] hover:underline">{t.title}</Link>
                    <p className="text-[11px] text-[#718096] mt-0.5">
                      {t.projectTeam ? `${t.projectTeam.name} · ` : ""}
                      {t.assignee ? `${t.assignee.firstName} ${t.assignee.lastName}` : "Unassigned"}
                      {t.dueDate ? ` · Due ${fmt(t.dueDate)}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge label={t.status} />
                    <Badge label={t.priority} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Finance ── */}
      {activeTab === "finance" && <FinanceTab projectId={id!} />}

      {/* ── Updates ── */}
      {activeTab === "updates" && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441] mb-3">Status Updates</p>
          <div className="bg-white border border-[#e2e8f0] divide-y divide-slate-100 mb-4">
            {(project.statusUpdates ?? []).length === 0
              ? <p className="px-4 py-6 text-sm text-slate-500 text-center">No updates yet.</p>
              : (project.statusUpdates ?? []).map((u) => (
                <div key={u.id} className="px-5 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-[#193441]">{u.author ? `${u.author.firstName} ${u.author.lastName}` : "Unknown"}</span>
                    <span className="text-[11px] text-[#718096]">{new Date(u.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-700">{u.content}</p>
                </div>
              ))}
          </div>
          <div className="bg-white border border-[#e2e8f0] p-4">
            <textarea className="w-full border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:border-[#193441] resize-none bg-white" rows={3} placeholder="Write an update…" value={updateText} onChange={(e) => setUpdateText(e.target.value)} />
            <div className="flex justify-end mt-2">
              <Button onClick={() => postUpdateMutation.mutate()} loading={postUpdateMutation.isPending} disabled={!updateText.trim()}>Post Update</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Approvals ── */}
      {activeTab === "approvals" && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441] mb-3">Approvals</p>
          <div className="bg-white border border-[#e2e8f0] divide-y divide-slate-100">
            {(project.approvals ?? []).length === 0
              ? <p className="px-4 py-6 text-sm text-slate-500 text-center">No approvals yet.</p>
              : (project.approvals ?? []).map((a) => (
                <div key={a.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#193441]">{a.approvalType}</p>
                    {a.referenceNo && <p className="font-mono text-[11px] text-[#718096]">Ref: {a.referenceNo}</p>}
                    {a.approvedAt && <p className="text-[11px] text-slate-400">{fmt(a.approvedAt)}</p>}
                  </div>
                  <Badge label={a.status} />
                </div>
              ))}
          </div>
        </div>
      )}

      <AddTeamMemberModal
        open={!!addTeamMember}
        onClose={() => setAddTeamMember(null)}
        projectId={id!}
        teamId={addTeamMember?.teamId ?? ""}
        members={project.members ?? []}
        existingMemberIds={addTeamMember?.existingIds ?? []}
      />
      <AddMemberModal open={memberModalOpen} onClose={() => setMemberModalOpen(false)} projectId={id!} />
      <AddMilestoneModal open={milestoneModalOpen} onClose={() => setMilestoneModalOpen(false)} projectId={id!} />
      <CreateTeamModal open={teamModalOpen} onClose={() => setTeamModalOpen(false)} projectId={id!} members={project.members ?? []} />
      <AddTaskModal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} projectId={id!} members={project.members ?? []} projectTeams={project.projectTeams ?? []} />
    </div>
  );
}
