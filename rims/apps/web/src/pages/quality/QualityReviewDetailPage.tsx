import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PageHeader,
  Button,
  Badge,
  Modal,
  FormField,
  Input,
  Select,
  Spinner,
} from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";

// ── Types ──────────────────────────────────────────────────────────────────

interface CorrectiveAction {
  id: string;
  title: string;
  description: string | null;
  status: string;
  ownerId: string | null;
  dueDate: string | null;
}

interface Finding {
  id: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  correctiveActions?: CorrectiveAction[];
}

interface QualityReview {
  id: string;
  title: string;
  reviewType: string;
  status: string;
  scheduledDate: string | null;
  leadReviewerId: string | null;
  summary: string | null;
  findings?: Finding[];
}

// ── Helpers ────────────────────────────────────────────────────────────────




function severityClasses(severity: string): string {
  switch (severity) {
    case "CRITICAL":
      return "bg-[#fed7d7] text-[#9b1c1c] border border-[#f9a8a8]";
    case "MAJOR":
      return "bg-[#fde68a] text-[#78350f] border border-[#fcd34d]";
    case "MINOR":
      return "bg-[#fef3c7] text-[#78350f] border border-[#fde68a]";
    case "OBSERVATION":
      return "bg-[#bee3f8] text-[#1a365d] border border-[#90cdf4]";
    default:
      return "bg-[#f7f8fa] text-[#193441] border border-[#e2e8f0]";
  }
}

function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

function nextActionStatus(current: string): string | null {
  switch (current) {
    case "OPEN":
      return "IN_PROGRESS";
    case "IN_PROGRESS":
      return "VERIFIED";
    case "VERIFIED":
      return "CLOSED";
    default:
      return null;
  }
}

function nextActionLabel(current: string): string {
  switch (current) {
    case "OPEN":
      return "Start";
    case "IN_PROGRESS":
      return "Verify";
    case "VERIFIED":
      return "Close";
    default:
      return "";
  }
}

// ── AddFindingModal ────────────────────────────────────────────────────────

interface AddFindingModalProps {
  open: boolean;
  onClose: () => void;
  reviewId: string;
}

function AddFindingModal({ open, onClose, reviewId }: AddFindingModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("MINOR");

  const mutation = useMutation({
    mutationFn: () =>
      api
        .post(`/quality/reviews/${reviewId}/findings`, {
          title,
          description: description || undefined,
          severity,
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Finding added", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["quality-review", reviewId] });
      setTitle("");
      setDescription("");
      setSeverity("MINOR");
      onClose();
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to add finding",
        description: err.message,
        variant: "error",
      });
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Finding"
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
            disabled={!title.trim()}
          >
            Add Finding
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Title" htmlFor="finding-title" required>
          <Input
            id="finding-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Finding title"
          />
        </FormField>
        <FormField label="Severity" htmlFor="finding-severity">
          <Select
            id="finding-severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            options={[
              { value: "CRITICAL", label: "Critical" },
              { value: "MAJOR", label: "Major" },
              { value: "MINOR", label: "Minor" },
              { value: "OBSERVATION", label: "Observation" },
            ]}
          />
        </FormField>
        <FormField label="Description" htmlFor="finding-desc">
          <Input
            id="finding-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the finding"
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── AddActionModal ─────────────────────────────────────────────────────────

interface AddActionModalProps {
  open: boolean;
  onClose: () => void;
  findingId: string;
  reviewId: string;
}

function AddActionModal({
  open,
  onClose,
  findingId,
  reviewId,
}: AddActionModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [ownerId, setOwnerId] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api
        .post(`/quality/findings/${findingId}/actions`, {
          title,
          description: description || undefined,
          dueDate: dueDate || undefined,
          ownerId: ownerId || undefined,
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Action added", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["quality-review", reviewId] });
      setTitle("");
      setDescription("");
      setDueDate("");
      setOwnerId("");
      onClose();
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to add action",
        description: err.message,
        variant: "error",
      });
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Corrective Action"
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
            disabled={!title.trim()}
          >
            Add Action
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Title" htmlFor="action-title" required>
          <Input
            id="action-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Action title"
          />
        </FormField>
        <FormField label="Description" htmlFor="action-desc">
          <Input
            id="action-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Action description"
          />
        </FormField>
        <FormField label="Due Date" htmlFor="action-due">
          <Input
            id="action-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </FormField>
        <FormField label="Owner ID" htmlFor="action-owner">
          <Input
            id="action-owner"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            placeholder="Optional owner employee ID"
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── FindingCard ────────────────────────────────────────────────────────────

interface FindingCardProps {
  finding: Finding;
  reviewId: string;
}

function FindingCard({ finding, reviewId }: FindingCardProps) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [addActionOpen, setAddActionOpen] = useState(false);

  const actionStatusMutation = useMutation({
    mutationFn: ({ actionId, status }: { actionId: string; status: string }) =>
      api.patch(`/quality/actions/${actionId}`, { status }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Action status updated", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["quality-review", reviewId] });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update action",
        description: err.message,
        variant: "error",
      });
    },
  });

  return (
    <>
      <div className={`border p-4 mb-3 ${severityClasses(finding.severity)}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.06em]">
                {finding.severity}
              </span>
              <Badge
                label={finding.status}
              />
            </div>
            <p className="text-[13px] font-semibold">{finding.title}</p>
            {finding.description && (
              <p className="text-[11px] mt-1 opacity-80">
                {finding.description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Hide Actions" : "Show Actions"}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 pl-2 border-l-2 border-current/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.06em] opacity-70">
                Corrective Actions
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAddActionOpen(true)}
              >
                Add Action
              </Button>
            </div>
            {(finding.correctiveActions ?? []).length === 0 ? (
              <p className="text-[10px] text-[#718096] py-2">
                No corrective actions yet.
              </p>
            ) : (
              <div className="space-y-2">
                {(finding.correctiveActions ?? []).map((action) => {
                  const next = nextActionStatus(action.status);
                  const label = nextActionLabel(action.status);
                  return (
                    <div
                      key={action.id}
                      className="bg-white/70 border border-white/40 px-3 py-2 flex items-start justify-between gap-2"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <Badge
                            label={action.status}
                          />
                          {action.ownerId && (
                            <span className="text-[10px] text-[#718096]">
                              Owner: {action.ownerId}
                            </span>
                          )}
                          {action.dueDate && (
                            <span className="text-[10px] text-[#718096]">
                              Due: {formatDate(action.dueDate)}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-bold text-[#193441]">
                          {action.title}
                        </p>
                        {action.description && (
                          <p className="text-[11px] opacity-70 mt-0.5">
                            {action.description}
                          </p>
                        )}
                      </div>
                      {next && label && (
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={actionStatusMutation.isPending}
                          onClick={() =>
                            actionStatusMutation.mutate({
                              actionId: action.id,
                              status: next,
                            })
                          }
                        >
                          {label}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <AddActionModal
        open={addActionOpen}
        onClose={() => setAddActionOpen(false)}
        findingId={finding.id}
        reviewId={reviewId}
      />
    </>
  );
}

// ── QualityReviewDetailPage ────────────────────────────────────────────────

export function QualityReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [addFindingOpen, setAddFindingOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["quality-review", id],
    queryFn: () =>
      api
        .get<{ data: QualityReview }>(`/quality/reviews/${id}`)
        .then((r) => r.data),
    enabled: !!id,
  });

  const review: QualityReview | undefined = (
    data as { data?: QualityReview } | undefined
  )?.data;

  const statusMutation = useMutation({
    mutationFn: (status: string) =>
      api.patch(`/quality/reviews/${id}`, { status }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Status updated", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["quality-review", id] });
      queryClient.invalidateQueries({ queryKey: ["quality-reviews"] });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update status",
        description: err.message,
        variant: "error",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="p-8 text-center text-slate-500">Review not found.</div>
    );
  }

  return (
    <div>
      <PageHeader
        title={review.title}
        actions={
          <Button variant="ghost" onClick={() => navigate("/quality/reviews")}>
            ← Back
          </Button>
        }
      />

      {/* Review info card */}
      <div className="bg-white border border-[#e2e8f0] p-6 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge
            label={review.status}
          />
          <span className="text-[11px] text-[#718096]">
            Type:{" "}
            <span className="text-[11px] font-bold text-[#193441]">
              {review.reviewType}
            </span>
          </span>
        </div>

        <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
          <div>
            <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
              Scheduled Date
            </dt>
            <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">
              {formatDate(review.scheduledDate)}
            </dd>
          </div>
          <div>
            <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
              Lead Reviewer
            </dt>
            <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">
              {review.leadReviewerId ?? "Not assigned"}
            </dd>
          </div>
        </dl>

        {review.summary && (
          <p className="text-sm text-slate-700 mb-4">{review.summary}</p>
        )}

        {/* Status action buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {review.status === "SCHEDULED" && (
            <Button
              variant="primary"
              onClick={() => statusMutation.mutate("IN_PROGRESS")}
              loading={statusMutation.isPending}
            >
              Start Review
            </Button>
          )}
          {review.status === "IN_PROGRESS" && (
            <Button
              variant="primary"
              onClick={() => statusMutation.mutate("COMPLETED")}
              loading={statusMutation.isPending}
            >
              Mark Complete
            </Button>
          )}
        </div>
      </div>

      {/* Findings section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441] border-b-2 border-[#193441] pb-1">
            Findings
          </h2>
          <Button size="sm" onClick={() => setAddFindingOpen(true)}>
            Add Finding
          </Button>
        </div>

        {(review.findings ?? []).length === 0 ? (
          <div className="bg-white border border-[#e2e8f0] px-4 py-8 text-center text-sm text-slate-500">
            No findings recorded yet.
          </div>
        ) : (
          <div>
            {(review.findings ?? []).map((finding) => (
              <FindingCard key={finding.id} finding={finding} reviewId={id!} />
            ))}
          </div>
        )}
      </div>

      <AddFindingModal
        open={addFindingOpen}
        onClose={() => setAddFindingOpen(false)}
        reviewId={id!}
      />
    </div>
  );
}
