import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader, Button, Badge, Select, Spinner, FormField } from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author?: { firstName: string; lastName: string } | null;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  assignee?: { firstName: string; lastName: string } | null;
  researchProject?: { title: string } | null;
  comments?: Comment[];
}

function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data: task, isLoading } = useQuery<Task>({
    queryKey: ["task", id],
    queryFn: () => api.get<Task>(`/tasks/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) =>
      api.patch(`/tasks/${id}`, { status }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Status updated", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update status", description: err.message, variant: "error" });
    },
  });

  const commentMutation = useMutation({
    mutationFn: () =>
      api.post(`/tasks/${id}/comments`, { content: commentText }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Comment added", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["task", id] });
      setCommentText("");
    },
    onError: (err: Error) => {
      toast({ title: "Failed to add comment", description: err.message, variant: "error" });
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!task) {
    return <div className="p-8 text-center text-slate-500">Task not found.</div>;
  }

  return (
    <div>
      <PageHeader
        title={task.title}
        actions={<Button variant="ghost" onClick={() => navigate("/tasks")}>← Back</Button>}
      />

      <div className="bg-white border border-[#e2e8f0] p-6 mb-6">
        <div className="flex flex-wrap gap-3 mb-4">
          <Badge label={task.status} />
          <Badge label={task.priority} />
        </div>

        {task.description && (
          <p className="text-sm text-slate-700 mb-4">{task.description}</p>
        )}

        <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
          <div>
            <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">Assignee</dt>
            <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">
              {task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">Due Date</dt>
            <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">{formatDate(task.dueDate)}</dd>
          </div>
          {task.researchProject && (
            <div>
              <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">Project</dt>
              <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">{task.researchProject.title}</dd>
            </div>
          )}
        </dl>

        <FormField label="Change Status" htmlFor="task-status">
          <Select
            id="task-status"
            value={task.status}
            onChange={(e) => statusMutation.mutate(e.target.value)}
            options={[
              { value: "NOT_STARTED", label: "Not Started" },
              { value: "TODO", label: "To Do" },
              { value: "IN_PROGRESS", label: "In Progress" },
              { value: "COMPLETED", label: "Completed" },
              { value: "ON_HOLD", label: "On Hold" },
              { value: "CANCELLED", label: "Cancelled" },
            ]}
            className="w-48"
          />
        </FormField>
      </div>

      <div className="bg-white border border-[#e2e8f0] p-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441] border-b-2 border-[#193441] pb-1 mb-3">
          Comments
        </h3>
        <div className="divide-y divide-slate-100 mb-4">
          {(task.comments ?? []).length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No comments yet.</p>
          ) : (
            (task.comments ?? []).map((c) => (
              <div key={c.id} className="py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-[#193441]">
                    {c.author ? `${c.author.firstName} ${c.author.lastName}` : "Unknown"}
                  </span>
                  <span className="text-[11px] text-[#718096]">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-[13px] text-[#193441]">{c.content}</p>
              </div>
            ))
          )}
        </div>
        <textarea
          className="w-full border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:border-[#193441] resize-none bg-white"
          rows={3}
          placeholder="Add a comment…"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className="flex justify-end mt-2">
          <Button
            onClick={() => commentMutation.mutate()}
            loading={commentMutation.isPending}
            disabled={!commentText.trim()}
          >
            Add Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
