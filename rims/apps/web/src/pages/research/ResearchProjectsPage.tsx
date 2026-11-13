import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader, Button, Badge, DataTable, Select, Input, Modal, FormField } from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────

interface ResearchProject {
  id: string;
  title: string;
  status: string;
  methodology: string | null;
  startDate: string | null;
  principalInvestigator?: { firstName: string; lastName: string } | null;
}

interface ProjectsResponse {
  data: ResearchProject[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

// ── Helpers ────────────────────────────────────────────────────────────────


function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

// ── CreateProjectModal ────────────────────────────────────────────────────

function CreateProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [researchArea, setResearchArea] = useState("");
  const [methodology, setMethodology] = useState("");
  const [startDate, setStartDate] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const { data: deptsData } = useQuery({
    queryKey: ["departments", "all"],
    queryFn: () => api.get("/departments").then((r) => r.data),
    enabled: open,
  });

  interface DeptNode { id: string; name: string; children?: DeptNode[] }
  function flatDepts(nodes: DeptNode[]): DeptNode[] {
    const out: DeptNode[] = [];
    const stack = [...nodes];
    while (stack.length) { const n = stack.pop()!; out.push(n); if (n.children?.length) stack.push(...n.children); }
    return out;
  }
  const depts = flatDepts((deptsData?.data ?? deptsData ?? []) as DeptNode[]);

  const mutation = useMutation({
    mutationFn: () => api.post("/research/projects", {
      title,
      summary: summary || undefined,
      researchArea: researchArea || undefined,
      methodology: methodology || undefined,
      startDate: startDate || undefined,
      departmentId: departmentId || undefined,
    }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Project created", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["research-projects"] });
      setTitle(""); setSummary(""); setResearchArea(""); setMethodology(""); setStartDate(""); setDepartmentId("");
      onClose();
    },
    onError: (err: Error) => toast({ title: "Failed to create project", description: err.message, variant: "error" }),
  });

  return (
    <Modal open={open} onClose={onClose} title="New Research Project"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!title.trim()}>Create</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Title" htmlFor="proj-title" required>
          <Input id="proj-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" />
        </FormField>
        <FormField label="Summary" htmlFor="proj-summary">
          <Input id="proj-summary" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief summary" />
        </FormField>
        <FormField label="Research Area" htmlFor="proj-area">
          <Input id="proj-area" value={researchArea} onChange={(e) => setResearchArea(e.target.value)} placeholder="e.g. Oncology" />
        </FormField>
        <FormField label="Methodology" htmlFor="proj-method">
          <Input id="proj-method" value={methodology} onChange={(e) => setMethodology(e.target.value)} placeholder="e.g. RCT, Observational" />
        </FormField>
        <FormField label="Start Date" htmlFor="proj-start">
          <Input id="proj-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </FormField>
        <FormField label="Department" htmlFor="proj-dept">
          <select id="proj-dept" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">No department</option>
            {depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </FormField>
      </div>
    </Modal>
  );
}

// ── ResearchProjectsPage ───────────────────────────────────────────────────

export function ResearchProjectsPage() {
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = {
    current: undefined as ReturnType<typeof setTimeout> | undefined,
  };

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
  }, []);

  const params = new URLSearchParams({
    page: String(page),
    pageSize: "20",
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(debouncedSearch && { search: debouncedSearch }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["research-projects", page, statusFilter, debouncedSearch],
    queryFn: () =>
      api
        .get<ProjectsResponse>(`/research/projects?${params}`)
        .then((r) => r.data),
  });

  const projects: ResearchProject[] =
    (data as ProjectsResponse | undefined)?.data ?? [];
  const meta = (data as ProjectsResponse | undefined)?.meta;

  const columns = [
    { key: "title", header: "Title" },
    {
      key: "status",
      header: "Status",
      render: (row: ResearchProject) => (
        <Badge label={row.status} />
      ),
    },
    {
      key: "methodology",
      header: "Methodology",
      render: (row: ResearchProject) => row.methodology ?? "—",
    },
    {
      key: "startDate",
      header: "Start Date",
      render: (row: ResearchProject) => formatDate(row.startDate),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Research Projects"
        actions={
          hasPermission("research.projects.create") ? (
            <Button onClick={() => setCreateOpen(true)}>New Project</Button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <Select
          options={[
            { value: "all", label: "All Statuses" },
            { value: "DRAFT", label: "Draft" },
            { value: "PENDING_APPROVAL", label: "Pending Approval" },
            { value: "ACTIVE", label: "Active" },
            { value: "ON_HOLD", label: "On Hold" },
            { value: "COMPLETED", label: "Completed" },
            { value: "CANCELLED", label: "Cancelled" },
          ]}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-48"
        />
        <Input
          placeholder="Search projects…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <DataTable<ResearchProject>
        columns={columns}
        data={projects}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        rowActions={(row) => (
          <Button variant="ghost" size="sm" onClick={() => navigate(`/research/projects/${row.id}`)}>View</Button>
        )}
        pagination={
          meta ? { page: meta.page, pageSize: meta.pageSize, total: meta.total, totalPages: meta.totalPages, onPageChange: setPage } : undefined
        }
      />
      <CreateProjectModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
