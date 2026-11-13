import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader, Button, Badge, Modal, FormField, Input, Select, Spinner } from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────

interface KpiAssignment {
  id: string;
  kpiDefinition?: {
    name: string;
    measurementType: string;
  } | null;
  weight: number | null;
  target: number | null;
  result?: {
    id: string;
    status: string;
    value: number | null;
  } | null;
}

interface AssignmentsResponse {
  data: KpiAssignment[];
}

// ── Helpers ────────────────────────────────────────────────────────────────


// ── SubmitResultModal ──────────────────────────────────────────────────────

interface SubmitResultModalProps {
  open: boolean;
  onClose: () => void;
  assignment: KpiAssignment | null;
}

function SubmitResultModal({ open, onClose, assignment }: SubmitResultModalProps) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");
  const [boolValue, setBoolValue] = useState("true");
  const [notes, setNotes] = useState("");
  const [evidenceRef, setEvidenceRef] = useState("");

  const measurementType = assignment?.kpiDefinition?.measurementType ?? "NUMERIC";
  const isBoolean = measurementType === "BOOLEAN";
  const isMilestone = measurementType === "MILESTONE";

  const mutation = useMutation({
    mutationFn: () => {
      const payload: Record<string, unknown> = {
        assignmentId: assignment?.id,
        notes: notes || undefined,
        evidenceRef: evidenceRef || undefined,
      };
      if (isBoolean) {
        payload.value = boolValue === "true" ? 1 : 0;
      } else if (isMilestone) {
        payload.milestoneRef = value;
      } else {
        payload.value = value ? Number(value) : undefined;
      }
      return api.post("/performance/results", payload).then((r) => r.data);
    },
    onSuccess: () => {
      toast({ title: "Result submitted", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["my-performance"] });
      setValue("");
      setBoolValue("true");
      setNotes("");
      setEvidenceRef("");
      onClose();
    },
    onError: (err: Error) => {
      toast({ title: "Failed to submit result", description: err.message, variant: "error" });
    },
  });

  if (!assignment) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Submit Result — ${assignment.kpiDefinition?.name ?? "KPI"}`}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
          >
            Submit Result
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {isBoolean ? (
          <FormField label="Result" htmlFor="result-bool">
            <Select
              id="result-bool"
              value={boolValue}
              onChange={(e) => setBoolValue(e.target.value)}
              options={[
                { value: "true", label: "Yes / Achieved" },
                { value: "false", label: "No / Not Achieved" },
              ]}
            />
          </FormField>
        ) : (
          <FormField
            label={isMilestone ? "Milestone Reference" : "Value"}
            htmlFor="result-value"
          >
            <Input
              id="result-value"
              type={isMilestone ? "text" : "number"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={isMilestone ? "Milestone description" : "Numeric value"}
            />
          </FormField>
        )}
        <FormField label="Notes" htmlFor="result-notes">
          <Input
            id="result-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes"
          />
        </FormField>
        <FormField label="Evidence Reference" htmlFor="result-evidence">
          <Input
            id="result-evidence"
            value={evidenceRef}
            onChange={(e) => setEvidenceRef(e.target.value)}
            placeholder="e.g. link or document reference"
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── MyPerformancePage ──────────────────────────────────────────────────────

export function MyPerformancePage() {
  const user = useAuthStore((s) => s.user);
  const [selectedAssignment, setSelectedAssignment] =
    useState<KpiAssignment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const subjectId = (user as (typeof user & { employeeId?: string }) | null)
    ?.employeeId ?? user?.id ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["my-performance", subjectId],
    queryFn: () =>
      api
        .get<AssignmentsResponse>(
          `/performance/assignments?subjectType=EMPLOYEE&subjectId=${subjectId}`,
        )
        .then((r) => r.data),
    enabled: !!subjectId,
  });

  const assignments: KpiAssignment[] =
    (data as AssignmentsResponse | undefined)?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Performance" />

      <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
        {assignments.length === 0 ? (
          <p className="px-4 py-8 text-sm text-slate-500 text-center">
            No KPI assignments found.
          </p>
        ) : (
          assignments.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {a.kpiDefinition?.name ?? "—"}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  {a.weight != null && <span>Weight: {a.weight}</span>}
                  {a.target != null && <span>Target: {a.target}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {a.result ? (
                  <Badge
                    label={a.result.status}
                  />
                ) : (
                  <Badge variant="default" label="No Result" />
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedAssignment(a);
                    setModalOpen(true);
                  }}
                >
                  Submit Result
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <SubmitResultModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment}
      />
    </div>
  );
}
