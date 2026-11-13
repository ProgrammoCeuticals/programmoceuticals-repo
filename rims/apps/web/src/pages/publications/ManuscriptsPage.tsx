import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PageHeader,
  Button,
  Badge,
  DataTable,
  Select,
  Input,
  Modal,
  FormField,
} from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────

interface Manuscript {
  id: string;
  title: string;
  status: string;
  targetJournal: string | null;
  submittedDate: string | null;
  publishedDate: string | null;
  _count?: { authors: number };
}

interface ManuscriptsResponse {
  data: Manuscript[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

// ── Helpers ────────────────────────────────────────────────────────────────


function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

// ── CreateManuscriptModal ──────────────────────────────────────────────────

function CreateManuscriptModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [targetJournal, setTargetJournal] = useState("");

  const { data: projectsData } = useQuery({
    queryKey: ["research-projects-list"],
    queryFn: () => api.get<{ data: { id: string; title: string }[] }>("/research/projects?pageSize=200").then((r) => r.data),
    enabled: open,
  });
  const projects: { id: string; title: string }[] =
    (projectsData as { data?: { id: string; title: string }[] } | undefined)?.data ?? [];
  const [researchProjectId, setResearchProjectId] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api.post("/publications", {
        title,
        abstract: abstract || undefined,
        targetJournal: targetJournal || undefined,
        researchProjectId: researchProjectId || undefined,
      }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Manuscript created", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      setTitle(""); setAbstract(""); setTargetJournal(""); setResearchProjectId("");
      onClose();
    },
    onError: (err: Error) => toast({ title: "Failed to create", description: err.message, variant: "error" }),
  });

  return (
    <Modal open={open} onClose={onClose} title="New Manuscript"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!title.trim()}>
            Create Manuscript
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Title" htmlFor="ms-title" required>
          <Input id="ms-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Manuscript title" />
        </FormField>
        <FormField label="Abstract" htmlFor="ms-abstract">
          <Input id="ms-abstract" value={abstract} onChange={(e) => setAbstract(e.target.value)} placeholder="Optional abstract" />
        </FormField>
        <FormField label="Target Journal" htmlFor="ms-journal">
          <Input id="ms-journal" value={targetJournal} onChange={(e) => setTargetJournal(e.target.value)} placeholder="e.g. The Lancet" />
        </FormField>
        <FormField label="Research Project" htmlFor="ms-project">
          <Select id="ms-project" value={researchProjectId} onChange={(e) => setResearchProjectId(e.target.value)}
            options={[
              { value: "", label: "No project" },
              ...projects.map((p) => ({ value: p.id, label: p.title })),
            ]}
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── ManuscriptsPage ────────────────────────────────────────────────────────

export function ManuscriptsPage() {
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
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
    queryKey: ["publications", page, statusFilter, debouncedSearch],
    queryFn: () =>
      api
        .get<ManuscriptsResponse>(`/publications?${params}`)
        .then((r) => r.data),
  });

  const manuscripts: Manuscript[] =
    (data as ManuscriptsResponse | undefined)?.data ?? [];
  const meta = (data as ManuscriptsResponse | undefined)?.meta;

  const columns = [
    { key: "title", header: "Title" },
    {
      key: "status",
      header: "Status",
      render: (row: Manuscript) => (
        <Badge label={row.status} />
      ),
    },
    {
      key: "targetJournal",
      header: "Target Journal",
      render: (row: Manuscript) => row.targetJournal ?? "—",
    },
    {
      key: "authors",
      header: "Authors",
      render: (row: Manuscript) =>
        row._count?.authors != null ? String(row._count.authors) : "—",
    },
    {
      key: "submittedDate",
      header: "Submitted Date",
      render: (row: Manuscript) => formatDate(row.submittedDate),
    },
    {
      key: "publishedDate",
      header: "Published Date",
      render: (row: Manuscript) => formatDate(row.publishedDate),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Publications & Manuscripts"
        actions={
          hasPermission("publications.create") ? (
            <Button onClick={() => setCreateOpen(true)}>New Manuscript</Button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <Select
          options={[
            { value: "all", label: "All Statuses" },
            { value: "DRAFT", label: "Draft" },
            { value: "INTERNAL_REVIEW", label: "Internal Review" },
            { value: "READY_FOR_SUBMISSION", label: "Ready for Submission" },
            { value: "SUBMITTED", label: "Submitted" },
            { value: "UNDER_REVIEW", label: "Under Review" },
            { value: "REVISION_REQUIRED", label: "Revision Required" },
            { value: "ACCEPTED", label: "Accepted" },
            { value: "REJECTED", label: "Rejected" },
            { value: "PUBLISHED", label: "Published" },
            { value: "WITHDRAWN", label: "Withdrawn" },
          ]}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-56"
        />
        <Input
          placeholder="Search manuscripts…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <DataTable<Manuscript>
        columns={columns}
        data={manuscripts}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        rowActions={(row) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/publications/${row.id}`)}
          >
            View
          </Button>
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

      <CreateManuscriptModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
