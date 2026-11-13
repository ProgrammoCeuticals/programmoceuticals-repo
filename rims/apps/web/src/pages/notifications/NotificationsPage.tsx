import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Badge, DataTable, Spinner } from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";

interface NotificationItem {
  id: string;
  title: string;
  body: string | null;
  status: string;
  resourceType: string | null;
  actionUrl: string | null;
  createdAt: string;
}

interface NotificationsResponse {
  data: NotificationItem[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function statusVariant(status: string): string {
  switch (status) {
    case "UNREAD":
      return "pending";
    case "READ":
      return "inactive";
    case "DISMISSED":
      return "inactive";
    default:
      return "default";
  }
}

type StatusFilter = "ALL" | "UNREAD" | "READ";

export function NotificationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);

  const params = {
    pageSize: 20,
    page,
    ...(statusFilter !== "ALL" && { status: statusFilter }),
  };

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", statusFilter, page],
    queryFn: () =>
      api
        .get<NotificationsResponse>("/notifications", { params })
        .then((r) => r.data),
  });

  const notifications: NotificationItem[] = data?.data ?? [];
  const meta = data?.meta;

  const markReadMutation = useMutation({
    mutationFn: (id: string) =>
      api.post(`/notifications/${id}/read`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.post("/notifications/read-all").then((r) => r.data),
    onSuccess: () => {
      toast({ title: "All notifications marked as read", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to mark all read",
        description: err.message,
        variant: "error",
      });
    },
  });

  function handleRowAction(row: NotificationItem) {
    if (row.status === "UNREAD") {
      markReadMutation.mutate(row.id);
    }
    if (row.actionUrl) {
      navigate(row.actionUrl);
    }
  }

  const columns = [
    { key: "title", header: "Title" },
    {
      key: "body",
      header: "Body",
      render: (row: NotificationItem) =>
        row.body
          ? row.body.slice(0, 80) + (row.body.length > 80 ? "…" : "")
          : "—",
    },
    {
      key: "resourceType",
      header: "Resource Type",
      render: (row: NotificationItem) => row.resourceType ?? "—",
    },
    {
      key: "createdAt",
      header: "Time",
      render: (row: NotificationItem) => relativeTime(row.createdAt),
    },
    {
      key: "status",
      header: "Status",
      render: (row: NotificationItem) => (
        <Badge variant={statusVariant(row.status)} label={row.status} />
      ),
    },
  ];

  const tabs: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "ALL" },
    { label: "Unread", value: "UNREAD" },
    { label: "Read", value: "READ" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Notifications</h1>
        <Button
          variant="ghost"
          onClick={() => markAllReadMutation.mutate()}
          loading={markAllReadMutation.isPending}
        >
          Mark all read
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              statusFilter === tab.value
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-600 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <DataTable<NotificationItem>
          columns={columns}
          data={notifications}
          isLoading={false}
          getRowKey={(row) => row.id}
          rowActions={(row) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRowAction(row)}
            >
              Open
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
      )}
    </div>
  );
}
