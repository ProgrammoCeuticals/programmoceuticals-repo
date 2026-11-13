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
import { useAuthStore } from "../../store/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

interface ManuscriptAuthor {
  id: string;
  employeeId: string;
  contributionRole: string | null;
  isCorresponding: boolean;
  employee?: Employee | null;
}

interface PeerReview {
  id: string;
  round: number;
  deadline: string | null;
  submittedAt: string | null;
  outcome: string | null;
  notes: string | null;
}

interface Manuscript {
  id: string;
  title: string;
  abstract: string | null;
  keywords: string[];
  status: string;
  targetJournal: string | null;
  publisher: string | null;
  doi: string | null;
  url: string | null;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  submittedDate: string | null;
  publishedDate: string | null;
  researchProjectId: string | null;
  authors?: ManuscriptAuthor[];
  peerReviews?: PeerReview[];
}

// ── Helpers ────────────────────────────────────────────────────────────────


function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

// Map of valid next statuses for each current status
const STATUS_TRANSITIONS: Record<string, { next: string; label: string }[]> = {
  DRAFT: [{ next: "INTERNAL_REVIEW", label: "Submit for Internal Review" }],
  INTERNAL_REVIEW: [
    { next: "READY_FOR_SUBMISSION", label: "Mark Ready for Submission" },
    { next: "DRAFT", label: "Return to Draft" },
  ],
  READY_FOR_SUBMISSION: [
    { next: "SUBMITTED", label: "Mark as Submitted" },
    { next: "INTERNAL_REVIEW", label: "Return to Internal Review" },
  ],
  SUBMITTED: [
    { next: "UNDER_REVIEW", label: "Mark Under Review" },
    { next: "WITHDRAWN", label: "Withdraw" },
  ],
  UNDER_REVIEW: [
    { next: "REVISION_REQUIRED", label: "Request Revision" },
    { next: "ACCEPTED", label: "Mark Accepted" },
    { next: "REJECTED", label: "Mark Rejected" },
  ],
  REVISION_REQUIRED: [
    { next: "SUBMITTED", label: "Resubmit" },
    { next: "WITHDRAWN", label: "Withdraw" },
  ],
  ACCEPTED: [{ next: "PUBLISHED", label: "Mark as Published" }],
  REJECTED: [{ next: "DRAFT", label: "Reopen as Draft" }],
  PUBLISHED: [],
  WITHDRAWN: [{ next: "DRAFT", label: "Reopen as Draft" }],
};

type Tab = "authors" | "peerReview" | "publicationDetails";

// ── AddAuthorModal ─────────────────────────────────────────────────────────

interface AddAuthorModalProps {
  open: boolean;
  onClose: () => void;
  manuscriptId: string;
}

function AddAuthorModal({ open, onClose, manuscriptId }: AddAuthorModalProps) {
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState("");
  const [contributionRole, setContributionRole] = useState("");

  const { data: empData } = useQuery({
    queryKey: ["employees-list"],
    queryFn: () =>
      api
        .get<{ data: Employee[] }>("/employees?pageSize=200")
        .then((r) => r.data),
    enabled: open,
  });
  const employees: Employee[] =
    (empData as { data?: Employee[] } | undefined)?.data ?? [];

  const mutation = useMutation({
    mutationFn: () =>
      api
        .post(`/publications/${manuscriptId}/authors`, {
          employeeId,
          contributionRole: contributionRole || undefined,
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Author added", variant: "success" });
      queryClient.invalidateQueries({
        queryKey: ["publication", manuscriptId],
      });
      setEmployeeId("");
      setContributionRole("");
      onClose();
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to add author",
        description: err.message,
        variant: "error",
      });
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Author"
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
            disabled={!employeeId}
          >
            Add Author
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Employee" htmlFor="author-employee" required>
          <Select
            id="author-employee"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            options={[
              { value: "", label: "Select employee" },
              ...employees.map((e) => ({
                value: e.id,
                label: `${e.firstName} ${e.lastName}`,
              })),
            ]}
          />
        </FormField>
        <FormField label="Contribution Role" htmlFor="author-role">
          <Input
            id="author-role"
            value={contributionRole}
            onChange={(e) => setContributionRole(e.target.value)}
            placeholder="e.g. Conceptualization, Writing, Data Analysis"
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── AddReviewRoundModal ────────────────────────────────────────────────────

interface AddReviewRoundModalProps {
  open: boolean;
  onClose: () => void;
  manuscriptId: string;
}

function AddReviewRoundModal({
  open,
  onClose,
  manuscriptId,
}: AddReviewRoundModalProps) {
  const queryClient = useQueryClient();
  const [round, setRound] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api
        .post(`/publications/${manuscriptId}/reviews`, {
          round: round ? Number(round) : undefined,
          deadline: deadline || undefined,
          notes: notes || undefined,
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Review round added", variant: "success" });
      queryClient.invalidateQueries({
        queryKey: ["publication", manuscriptId],
      });
      setRound("");
      setDeadline("");
      setNotes("");
      onClose();
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to add review round",
        description: err.message,
        variant: "error",
      });
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Review Round"
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
          >
            Add Review Round
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Round #" htmlFor="review-round">
          <Input
            id="review-round"
            type="number"
            value={round}
            onChange={(e) => setRound(e.target.value)}
            placeholder="e.g. 1"
          />
        </FormField>
        <FormField label="Deadline" htmlFor="review-deadline">
          <Input
            id="review-deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </FormField>
        <FormField label="Notes" htmlFor="review-notes">
          <Input
            id="review-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes"
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── ManuscriptDetailPage ───────────────────────────────────────────────────

export function ManuscriptDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const [activeTab, setActiveTab] = useState<Tab>("authors");
  const [authorModalOpen, setAuthorModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Publication details edit state
  const [editDoi, setEditDoi] = useState("");
  const [editVolume, setEditVolume] = useState("");
  const [editIssue, setEditIssue] = useState("");
  const [editPages, setEditPages] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [detailsInitialized, setDetailsInitialized] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["publication", id],
    queryFn: () =>
      api.get<{ data: Manuscript }>(`/publications/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const manuscript: Manuscript | undefined = (
    data as { data?: Manuscript } | undefined
  )?.data;

  // Initialise publication detail fields once data arrives
  if (manuscript && !detailsInitialized) {
    setEditDoi(manuscript.doi ?? "");
    setEditVolume(manuscript.volume ?? "");
    setEditIssue(manuscript.issue ?? "");
    setEditPages(manuscript.pages ?? "");
    setEditUrl(manuscript.url ?? "");
    setDetailsInitialized(true);
  }

  const statusMutation = useMutation({
    mutationFn: (status: string) =>
      api.patch(`/publications/${id}`, { status }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Status updated", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["publication", id] });
      queryClient.invalidateQueries({ queryKey: ["publications"] });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update status",
        description: err.message,
        variant: "error",
      });
    },
  });

  const detailsMutation = useMutation({
    mutationFn: () =>
      api
        .patch(`/publications/${id}`, {
          doi: editDoi || undefined,
          volume: editVolume || undefined,
          issue: editIssue || undefined,
          pages: editPages || undefined,
          url: editUrl || undefined,
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Publication details saved", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["publication", id] });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to save details",
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

  if (!manuscript) {
    return (
      <div className="p-8 text-center text-slate-500">
        Manuscript not found.
      </div>
    );
  }

  const transitions = STATUS_TRANSITIONS[manuscript.status] ?? [];

  const tabs: { key: Tab; label: string }[] = [
    { key: "authors", label: "Authors" },
    { key: "peerReview", label: "Peer Review" },
    { key: "publicationDetails", label: "Publication Details" },
  ];

  const sortedReviews = [...(manuscript.peerReviews ?? [])].sort(
    (a, b) => a.round - b.round,
  );

  return (
    <div>
      <PageHeader
        title={manuscript.title}
        actions={
          <Button variant="ghost" onClick={() => navigate("/publications")}>
            ← Back
          </Button>
        }
      />

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Left 2/3 — details */}
        <div className="flex-1 lg:basis-2/3 min-w-0">
          <div className="bg-white border border-[#e2e8f0] p-6">
            {/* Abstract */}
            {manuscript.abstract && (
              <div className="mb-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441] border-b-2 border-[#193441] pb-1 mb-3">
                  Abstract
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {manuscript.abstract}
                </p>
              </div>
            )}

            {/* Keywords */}
            {manuscript.keywords && manuscript.keywords.length > 0 && (
              <div className="mb-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441] border-b-2 border-[#193441] pb-1 mb-3">
                  Keywords
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {manuscript.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center px-[6px] py-[1px] text-[10px] font-bold bg-[#e2e8f0] text-[#193441]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata grid */}
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {manuscript.researchProjectId && (
                <div className="col-span-2">
                  <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
                    Research Project
                  </dt>
                  <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">
                    <a
                      href={`/research/projects/${manuscript.researchProjectId}`}
                      className="hover:underline"
                    >
                      View linked project →
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
                  Target Journal
                </dt>
                <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">
                  {manuscript.targetJournal ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
                  Publisher
                </dt>
                <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">
                  {manuscript.publisher ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
                  DOI
                </dt>
                <dd className="font-mono text-[13px] font-semibold text-[#193441] mt-0.5">
                  {manuscript.doi ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
                  URL
                </dt>
                <dd className="text-[13px] font-semibold text-[#193441] mt-0.5 truncate">
                  {manuscript.url ? (
                    <a
                      href={manuscript.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#193441] underline hover:opacity-70"
                    >
                      {manuscript.url}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Tabs */}
          <div className="border-b-2 border-[#e2e8f0] mt-6 mb-4">
            <div className="flex gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 border-b-[3px] transition-colors text-[11px] uppercase tracking-[0.06em] font-bold ${
                    activeTab === tab.key
                      ? "text-[#193441] border-[#193441]"
                      : "text-[#718096] border-transparent hover:text-[#193441]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Authors tab */}
          {activeTab === "authors" && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441] border-b-2 border-[#193441] pb-1">
                  Authors
                </h3>
                <Button size="sm" onClick={() => setAuthorModalOpen(true)}>
                  Add Author
                </Button>
              </div>
              <div className="bg-white border border-[#e2e8f0] divide-y divide-[#e2e8f0]">
                {(manuscript.authors ?? []).length === 0 ? (
                  <p className="px-4 py-6 text-sm text-slate-500 text-center">
                    No authors yet.
                  </p>
                ) : (
                  (manuscript.authors ?? []).map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div>
                        <p className="text-[13px] font-semibold text-[#193441]">
                          {a.employee
                            ? `${a.employee.firstName} ${a.employee.lastName}`
                            : a.employeeId}
                        </p>
                        {a.contributionRole && (
                          <p className="text-[11px] text-[#718096] mt-0.5">
                            {a.contributionRole}
                          </p>
                        )}
                      </div>
                      {a.isCorresponding && (
                        <Badge variant="active" label="Corresponding" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Peer Review tab */}
          {activeTab === "peerReview" && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441] border-b-2 border-[#193441] pb-1">
                  Peer Review
                </h3>
                <Button size="sm" onClick={() => setReviewModalOpen(true)}>
                  Add Review Round
                </Button>
              </div>
              <div className="bg-white border border-[#e2e8f0] divide-y divide-[#e2e8f0]">
                {sortedReviews.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-slate-500 text-center">
                    No review rounds yet.
                  </p>
                ) : (
                  sortedReviews.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-start justify-between px-4 py-3 gap-4"
                    >
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 flex-1">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
                            Round
                          </span>{" "}
                          <span className="text-[13px] font-semibold text-[#193441]">
                            {r.round}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
                            Deadline
                          </span>{" "}
                          <span className="text-[13px] font-semibold text-[#193441]">
                            {formatDate(r.deadline)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
                            Submitted
                          </span>{" "}
                          <span className="text-[13px] font-semibold text-[#193441]">
                            {formatDate(r.submittedAt)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
                            Outcome
                          </span>{" "}
                          <span className="text-[13px] font-semibold text-[#193441]">
                            {r.outcome ?? "—"}
                          </span>
                        </div>
                        {r.notes && (
                          <div className="col-span-2">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
                              Notes
                            </span>{" "}
                            <span className="text-[13px] text-[#193441]">
                              {r.notes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Publication Details tab */}
          {activeTab === "publicationDetails" && (
            <div className="bg-white border border-[#e2e8f0] p-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="DOI" htmlFor="pub-doi">
                  <Input
                    id="pub-doi"
                    value={editDoi}
                    onChange={(e) => setEditDoi(e.target.value)}
                    placeholder="e.g. 10.1000/xyz123"
                  />
                </FormField>
                <FormField label="Volume" htmlFor="pub-volume">
                  <Input
                    id="pub-volume"
                    value={editVolume}
                    onChange={(e) => setEditVolume(e.target.value)}
                    placeholder="e.g. 12"
                  />
                </FormField>
                <FormField label="Issue" htmlFor="pub-issue">
                  <Input
                    id="pub-issue"
                    value={editIssue}
                    onChange={(e) => setEditIssue(e.target.value)}
                    placeholder="e.g. 3"
                  />
                </FormField>
                <FormField label="Pages" htmlFor="pub-pages">
                  <Input
                    id="pub-pages"
                    value={editPages}
                    onChange={(e) => setEditPages(e.target.value)}
                    placeholder="e.g. 45–67"
                  />
                </FormField>
                <div className="col-span-2">
                  <FormField label="URL" htmlFor="pub-url">
                    <Input
                      id="pub-url"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="https://…"
                    />
                  </FormField>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="primary"
                  onClick={() => detailsMutation.mutate()}
                  loading={detailsMutation.isPending}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right 1/3 — status panel */}
        <div className="lg:basis-1/3 lg:max-w-xs w-full">
          <div className="bg-white border border-[#e2e8f0] p-5 sticky top-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441] border-b-2 border-[#193441] pb-1 mb-3">
              Status
            </h3>
            <div className="mb-4">
              <Badge
                label={manuscript.status}
              />
            </div>

            {transitions.length > 0 && (
              <div className="flex flex-col gap-2">
                {transitions.map((t, idx) => (
                  <Button
                    key={t.next}
                    variant={idx === 0 ? "primary" : "ghost"}
                    onClick={() => statusMutation.mutate(t.next)}
                    loading={statusMutation.isPending}
                    className="w-full justify-center"
                  >
                    {t.label}
                  </Button>
                ))}
              </div>
            )}

            <dl className="mt-5 space-y-3">
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
                  Submitted
                </dt>
                <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">
                  {formatDate(manuscript.submittedDate)}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
                  Published
                </dt>
                <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">
                  {formatDate(manuscript.publishedDate)}
                </dd>
              </div>
            </dl>

            {hasPermission("publications.update") && (
              <div className="mt-5 pt-4 border-t border-[#e2e8f0]">
                <p className="text-[11px] text-[#718096]">
                  You have edit access to this manuscript.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddAuthorModal
        open={authorModalOpen}
        onClose={() => setAuthorModalOpen(false)}
        manuscriptId={id!}
      />
      <AddReviewRoundModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        manuscriptId={id!}
      />
    </div>
  );
}
