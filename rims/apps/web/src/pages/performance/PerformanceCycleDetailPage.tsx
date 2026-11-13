import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader, Button, Badge, Spinner, Modal, FormField, Input, Select } from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────

interface KpiResult {
  id: string;
  status: string;
  value: string | null;
  notes: string | null;
  reviewNotes: string | null;
}

interface KpiAssignment {
  id: string;
  subjectType: string;
  subjectId: string;
  weight: number | null;
  targetValue: string | null;
  kpiDefinition?: { name: string; measurementType: string; unit: string | null } | null;
  result?: KpiResult | null;
}

interface PerformanceCycle {
  id: string;
  name: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  kpiAssignments?: KpiAssignment[];
  totalAssignments?: number;
  submittedResults?: number;
  approvedResults?: number;
  totalWeight?: number;
  assessedWeight?: number;
}

function fmt(d: string | null | undefined) {
  return d ? new Date(d).toLocaleDateString() : "—";
}

// ── SubmitResultModal ──────────────────────────────────────────────────────

function SubmitResultModal({
  open, onClose, assignment, cycleId,
}: {
  open: boolean; onClose: () => void; assignment: KpiAssignment | null; cycleId: string;
}) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState(assignment?.result?.value ?? "");
  const [notes, setNotes] = useState(assignment?.result?.notes ?? "");
  const measurementType = assignment?.kpiDefinition?.measurementType ?? "NUMERIC";
  const isBoolean = measurementType === "BOOLEAN";

  const mutation = useMutation({
    mutationFn: () =>
      api.post("/performance/results", {
        assignmentId: assignment?.id,
        value: isBoolean ? value || "true" : value,
        notes: notes || undefined,
      }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Result submitted", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["performance-cycle", cycleId] });
      setValue(""); setNotes("");
      onClose();
    },
    onError: (err: Error) => toast({ title: "Failed to submit", description: err.message, variant: "error" }),
  });

  if (!assignment) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Submit Result — ${assignment.kpiDefinition?.name ?? "KPI"}`}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending}>Submit</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label={isBoolean ? "Result" : `Value${assignment.kpiDefinition?.unit ? ` (${assignment.kpiDefinition.unit})` : ""}`} htmlFor="res-value">
          {isBoolean ? (
            <Select id="res-value" value={value || "true"} onChange={(e) => setValue(e.target.value)}
              options={[{ value: "true", label: "Yes / Achieved" }, { value: "false", label: "No / Not Achieved" }]}
            />
          ) : (
            <Input id="res-value" type="number" value={value} onChange={(e) => setValue(e.target.value)}
              placeholder={assignment.targetValue ? `Target: ${assignment.targetValue}` : "Enter value"} />
          )}
        </FormField>
        <FormField label="Notes" htmlFor="res-notes">
          <Input id="res-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
        </FormField>
      </div>
    </Modal>
  );
}

// ── ReviewResultModal ──────────────────────────────────────────────────────

function ReviewResultModal({
  open, onClose, resultId, cycleId,
}: {
  open: boolean; onClose: () => void; resultId: string; cycleId: string;
}) {
  const queryClient = useQueryClient();
  const [approved, setApproved] = useState("true");
  const [reviewNotes, setReviewNotes] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api.patch(`/performance/results/${resultId}/review`, {
        approved: approved === "true",
        reviewNotes: reviewNotes || undefined,
      }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: approved === "true" ? "Result approved" : "Result returned", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["performance-cycle", cycleId] });
      setApproved("true"); setReviewNotes("");
      onClose();
    },
    onError: (err: Error) => toast({ title: "Failed to review", description: err.message, variant: "error" }),
  });

  return (
    <Modal open={open} onClose={onClose} title="Review KPI Result"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending}>Submit Review</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Decision" htmlFor="rev-decision">
          <Select id="rev-decision" value={approved} onChange={(e) => setApproved(e.target.value)}
            options={[{ value: "true", label: "Approve" }, { value: "false", label: "Return for revision" }]}
          />
        </FormField>
        <FormField label="Review Notes" htmlFor="rev-notes">
          <Input id="rev-notes" value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} placeholder="Optional notes" />
        </FormField>
      </div>
    </Modal>
  );
}

// ── PerformanceCycleDetailPage ─────────────────────────────────────────────

export function PerformanceCycleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const [submitTarget, setSubmitTarget] = useState<KpiAssignment | null>(null);
  const [reviewResultId, setReviewResultId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["performance-cycle", id],
    queryFn: () =>
      api.get<{ data: PerformanceCycle }>(`/performance/cycles/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const cycle: PerformanceCycle | undefined = (data as { data?: PerformanceCycle } | undefined)?.data;

  if (isLoading) return <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>;
  if (!cycle) return <div className="p-8 text-center text-slate-500">Cycle not found.</div>;

  const assignments = cycle.kpiAssignments ?? [];
  const totalAssignments = cycle.totalAssignments ?? assignments.length;
  const submittedResults = cycle.submittedResults ?? 0;
  const approvedResults = cycle.approvedResults ?? 0;
  const totalWeight = cycle.totalWeight ?? assignments.reduce((s, a) => s + (a.weight ?? 0), 0);
  const assessedWeight = cycle.assessedWeight ?? 0;
  const completionPct = totalWeight > 0 ? Math.round((assessedWeight / totalWeight) * 100) : 0;

  const canSubmit = cycle.status === "ACTIVE";
  const canReview = hasPermission("performance.results.review");

  return (
    <div>
      <PageHeader
        title={cycle.name}
        actions={<Button variant="ghost" onClick={() => navigate("/performance/cycles")}>← Back</Button>}
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Badge label={cycle.status} />
        <span className="text-[11px] text-[#718096]">{fmt(cycle.startDate)} – {fmt(cycle.endDate)}</span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "KPI Assignments", value: totalAssignments },
          { label: "Submitted", value: submittedResults },
          { label: "Approved", value: approvedResults },
          { label: "Completion", value: `${completionPct}%` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-[#e2e8f0] p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096] mb-1">{label}</p>
            <p className="text-[28px] font-bold text-[#193441] leading-none font-mono">{value}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white border border-[#e2e8f0] px-5 py-4 mb-6">
        <div className="flex justify-between text-[11px] text-[#718096] mb-2">
          <span>Overall completion</span><span>{completionPct}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#193441] rounded-full transition-all" style={{ width: `${completionPct}%` }} />
        </div>
      </div>

      {/* KPI Assignments table */}
      <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441] mb-3">
        KPI Assignments ({assignments.length})
      </p>
      <div className="bg-white border border-[#e2e8f0] divide-y divide-slate-100">
        {assignments.length === 0 ? (
          <p className="px-4 py-8 text-sm text-slate-500 text-center">No KPI assignments in this cycle.</p>
        ) : (
          assignments.map((a) => {
            const result = a.result;
            const canSubmitThis = canSubmit && (!result || result.status === "DRAFT" || result.status === "RETURNED");
            const canReviewThis = canReview && result?.status === "SUBMITTED";
            return (
              <div key={a.id} className="flex items-center justify-between px-5 py-3 gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#193441] truncate">{a.kpiDefinition?.name ?? "—"}</p>
                  <div className="flex flex-wrap gap-3 mt-0.5 text-[11px] text-[#718096]">
                    <span>Subject: {a.subjectType}</span>
                    {a.weight != null && <span>Weight: {a.weight}</span>}
                    {a.targetValue && <span>Target: {a.targetValue}</span>}
                    {result?.value && <span>Value: {result.value}</span>}
                  </div>
                  {result?.reviewNotes && (
                    <p className="text-[11px] text-amber-600 mt-0.5">Review note: {result.reviewNotes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {result ? <Badge label={result.status} /> : <Badge variant="default" label="No Result" />}
                  {canSubmitThis && (
                    <Button size="sm" variant="ghost" onClick={() => setSubmitTarget(a)}>
                      {result?.status === "RETURNED" ? "Resubmit" : "Submit"}
                    </Button>
                  )}
                  {canReviewThis && result && (
                    <Button size="sm" variant="primary" onClick={() => setReviewResultId(result.id)}>
                      Review
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <SubmitResultModal
        open={!!submitTarget}
        onClose={() => setSubmitTarget(null)}
        assignment={submitTarget}
        cycleId={id!}
      />
      <ReviewResultModal
        open={!!reviewResultId}
        onClose={() => setReviewResultId(null)}
        resultId={reviewResultId ?? ""}
        cycleId={id!}
      />
    </div>
  );
}
