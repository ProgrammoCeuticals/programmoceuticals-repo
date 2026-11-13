import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Button, Badge, DataTable, Select, Input } from "@rims/ui";
import api from "../../lib/api";

// ── Types ──────────────────────────────────────────────────────────────────

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
}

interface TasksResponse {
  data: Task[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

// ── Helpers ────────────────────────────────────────────────────────────────



function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

// ── TasksPage ──────────────────────────────────────────────────────────────

export function TasksPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
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
    ...(priorityFilter !== "all" && { priority: priorityFilter }),
    ...(debouncedSearch && { search: debouncedSearch }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", page, statusFilter, priorityFilter, debouncedSearch],
    queryFn: () =>
      api.get<TasksResponse>(`/tasks?${params}`).then((r) => r.data),
  });

  const tasks: Task[] = (data as TasksResponse | undefined)?.data ?? [];
  const meta = (data as TasksResponse | undefined)?.meta;

  const columns = [
    { key: "title", header: "Title" },
    {
      key: "status",
      header: "Status",
      render: (row: Task) => (
        <Badge label={row.status} />
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (row: Task) => (
        <Badge label={row.priority} />
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (row: Task) => formatDate(row.dueDate),
    },
  ];

  return (
    <div>
      <PageHeader title="Tasks" />

      <div className="flex flex-wrap gap-3 mb-4">
        <Select
          options={[
            { value: "all", label: "All Statuses" },
            { value: "TODO", label: "To Do" },
            { value: "IN_PROGRESS", label: "In Progress" },
            { value: "COMPLETED", label: "Completed" },
            { value: "CANCELLED", label: "Cancelled" },
            { value: "ON_HOLD", label: "On Hold" },
          ]}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-48"
        />
        <Select
          options={[
            { value: "all", label: "All Priorities" },
            { value: "LOW", label: "Low" },
            { value: "MEDIUM", label: "Medium" },
            { value: "HIGH", label: "High" },
            { value: "CRITICAL", label: "Critical" },
          ]}
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
            setPage(1);
          }}
          className="w-44"
        />
        <Input
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <DataTable<Task>
        columns={columns}
        data={tasks}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        rowActions={(row) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/tasks/${row.id}`)}
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
    </div>
  );
}
