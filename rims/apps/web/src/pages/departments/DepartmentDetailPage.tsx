import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Badge, DataTable, Button } from "@rims/ui";
import api from "../../lib/api";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  hireDate: string | null;
  position: { title: string } | null;
}

interface ChildDept {
  id: string;
  name: string;
  status: string;
  _count: { employees: number };
}

interface Department {
  id: string;
  name: string;
  status: string;
  parentId: string | null;
  createdAt: string;
  _count: { employees: number };
  children: ChildDept[];
  employees: Employee[];
}

export function DepartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["department", id],
    queryFn: () =>
      api.get<{ data: Department }>(`/departments/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const dept = (data as { data?: Department } | undefined)?.data;
  const employees = dept?.employees ?? [];
  const children = dept?.children ?? [];

  const employeeColumns = [
    {
      key: "name",
      header: "Name",
      render: (row: Employee) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: "position",
      header: "Position",
      render: (row: Employee) =>
        row.position?.title ?? <span className="text-slate-400">—</span>,
    },
    {
      key: "hireDate",
      header: "Hire Date",
      render: (row: Employee) =>
        row.hireDate
          ? new Date(row.hireDate).toLocaleDateString()
          : <span className="text-slate-400">—</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row: Employee) => <Badge label={row.status} />,
    },
  ];

  const childColumns = [
    { key: "name", header: "Name", render: (row: ChildDept) => row.name },
    {
      key: "status",
      header: "Status",
      render: (row: ChildDept) => <Badge label={row.status} />,
    },
    {
      key: "employees",
      header: "Employees",
      render: (row: ChildDept) => row._count.employees,
    },
  ];

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Department" />
        <div className="animate-pulse space-y-3 mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!dept) return <div className="p-6"><div className="h-8 w-48 bg-slate-200 animate-pulse rounded" /></div>;

  return (
    <div>
      <PageHeader
        title={dept.name}
        actions={
          <Button variant="ghost" onClick={() => navigate("/departments")}>
            ← Back
          </Button>
        }
      />

      {/* Info card */}
      <div className="mt-4 bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 mb-6">
        {[
          { label: "Status", value: <Badge label={dept.status} /> },
          { label: "Employees", value: dept._count.employees },
          {
            label: "Created",
            value: new Date(dept.createdAt).toLocaleDateString(),
          },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center px-6 py-4 gap-4">
            <span className="w-40 shrink-0 text-sm font-medium text-slate-500">
              {label}
            </span>
            <span className="text-sm text-slate-900">{value}</span>
          </div>
        ))}
      </div>

      {/* Employees */}
      <h2 className="text-base font-semibold text-slate-800 mb-3">
        Employees ({employees.length})
      </h2>
      <DataTable<Employee>
        columns={employeeColumns}
        data={employees}
        isLoading={false}
        getRowKey={(row) => row.id}
        rowActions={(row) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/employees/${row.id}`)}
          >
            View
          </Button>
        )}
      />

      {/* Sub-departments */}
      {children.length > 0 && (
        <>
          <h2 className="text-base font-semibold text-slate-800 mt-8 mb-3">
            Sub-departments ({children.length})
          </h2>
          <DataTable<ChildDept>
            columns={childColumns}
            data={children}
            isLoading={false}
            getRowKey={(row) => row.id}
            rowActions={(row) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/departments/${row.id}`)}
              >
                View
              </Button>
            )}
          />
        </>
      )}
    </div>
  );
}
