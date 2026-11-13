import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader, Button, Badge, DataTable, Select, Modal, FormField, Input } from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────

interface QualityReview {
  id: string;
  title: string;
  reviewType: string;
  status: string;
  scheduledDate: string | null;
  _count?: { findings: number };
}

interface ReviewsResponse {
  data: QualityReview[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

// ── Helpers ────────────────────────────────────────────────────────────────


function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

// ── NewReviewModal ─────────────────────────────────────────────────────────

interface NewReviewModalProps {
  open: boolean;
  onClose: () => void;
}

function NewReviewModal({ open, onClose }: NewReviewModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [reviewType, setReviewType] = useState("INTERNAL");
  const [scheduledDate, setScheduledDate] = useState("");
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
    mutationFn: () =>
      api.post("/quality/reviews", {
        title,
        reviewType,
        ...(scheduledDate && { scheduledDate }),
        ...(departmentId && { departmentId }),
      }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Review created", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["quality-reviews"] });
      setTitle(""); setReviewType("INTERNAL"); setScheduledDate(""); setDepartmentId("");
      onClose();
    },
    onError: (err: Error) => {
      toast({ title: "Failed to create review", description: err.message, variant: "error" });
    },
  });

  return (
    <Modal open={open} onClose={onClose} title="New Quality Review"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!title.trim()}>Create Review</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Title" htmlFor="review-title" required>
          <Input id="review-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Review title" />
        </FormField>
        <FormField label="Review Type" htmlFor="review-type" required>
          <select id="review-type" value={reviewType} onChange={(e) => setReviewType(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="INTERNAL">Internal</option>
            <option value="EXTERNAL">External</option>
            <option value="REGULATORY">Regulatory</option>
            <option value="CLINICAL">Clinical</option>
          </select>
        </FormField>
        <FormField label="Scheduled Date" htmlFor="review-date">
          <Input id="review-date" type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
        </FormField>
        <FormField label="Department" htmlFor="review-dept">
          <select id="review-dept" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All departments</option>
            {depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </FormField>
      </div>
    </Modal>
  );
}

// ── QualityReviewsPage ─────────────────────────────────────────────────────

export function QualityReviewsPage() {
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [newReviewOpen, setNewReviewOpen] = useState(false);

  const params = new URLSearchParams({
    page: String(page),
    pageSize: "20",
    ...(statusFilter !== "all" && { status: statusFilter }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["quality-reviews", page, statusFilter],
    queryFn: () =>
      api
        .get<ReviewsResponse>(`/quality/reviews?${params}`)
        .then((r) => r.data),
  });

  const reviews: QualityReview[] =
    (data as ReviewsResponse | undefined)?.data ?? [];
  const meta = (data as ReviewsResponse | undefined)?.meta;

  const columns = [
    { key: "title", header: "Title" },
    {
      key: "reviewType",
      header: "Type",
      render: (row: QualityReview) => row.reviewType,
    },
    {
      key: "status",
      header: "Status",
      render: (row: QualityReview) => (
        <Badge label={row.status} />
      ),
    },
    {
      key: "scheduledDate",
      header: "Scheduled Date",
      render: (row: QualityReview) => formatDate(row.scheduledDate),
    },
    {
      key: "findings",
      header: "Findings Count",
      render: (row: QualityReview) =>
        row._count?.findings != null ? String(row._count.findings) : "—",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quality Reviews"
        actions={
          hasPermission("quality.reviews.manage") ? (
            <Button onClick={() => setNewReviewOpen(true)}>New Review</Button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <Select
          options={[
            { value: "all", label: "All" },
            { value: "SCHEDULED", label: "Scheduled" },
            { value: "IN_PROGRESS", label: "In Progress" },
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
      </div>

      <DataTable<QualityReview>
        columns={columns}
        data={reviews}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        rowActions={(row) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/quality/reviews/${row.id}`)}
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

      <NewReviewModal
        open={newReviewOpen}
        onClose={() => setNewReviewOpen(false)}
      />
    </div>
  );
}
