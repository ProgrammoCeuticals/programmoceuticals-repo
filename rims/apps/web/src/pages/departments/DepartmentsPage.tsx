import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Badge, DataTable, Button } from "@rims/ui";
import api from "../../lib/api";

interface Department {
  id: string;
  name: string;
  status: string;
  parentId: string | null;
  _count: { employees: number };
  children: Department[];
}

export function DepartmentsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      api.get<{ data: Department[] }>("/departments").then((r) => r.data),
  });

  const all: Department[] =
    (data as { data?: Department[] } | undefined)?.data ?? [];

  const departments = statusFilter === "all"
    ? all
    : all.filter((d) => d.status === statusFilter);

  const columns = [
    { key: "name", header: "Name", render: (row: Department) => row.name },
    {
      key: "status",
      header: "Status",
      render: (row: Department) => <Badge label={row.status} />,
    },
    {
      key: "parent",
      header: "Parent",
      render: (row: Department) => {
        if (!row.parentId) return <span className="text-slate-400">—</span>;
        const parent = all.find((d) => d.id === row.parentId);
        return parent?.name ?? row.parentId;
      },
    },
    {
      key: "employees",
      header: "Employees",
      render: (row: Department) => row._count.employees,
    },
    {
      key: "subDepts",
      header: "Sub-departments",
      render: (row: Department) => row.children.length || 0,
    },
  ];

  return (
    <div>
      <PageHeader title="Departments" />

      <div className="flex gap-3 mb-4">
        <select
          className="h-9 rounded-md border border-slate-200 px-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <DataTable<Department>
        columns={columns}
        data={departments}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        rowActions={(row) => (
          <Button variant="ghost" size="sm" onClick={() => navigate(`/departments/${row.id}`)}>
            View
          </Button>
        )}
      />
    </div>
  );
}
