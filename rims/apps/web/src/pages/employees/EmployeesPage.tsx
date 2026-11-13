import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader, Badge, DataTable, Input, Button, Modal, FormField, Select } from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  hireDate: string | null;
  department: { name: string } | null;
  position: { title: string } | null;
  team: { name: string } | null;
}

interface EmployeesResponse {
  data: Employee[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

// ── CreateEmployeeModal ────────────────────────────────────────────────────

function CreateEmployeeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const { data: deptData } = useQuery({
    queryKey: ["departments-list"],
    queryFn: () => api.get<{ data: { id: string; name: string }[] }>("/departments").then((r) => r.data),
    enabled: open,
  });
  const departments: { id: string; name: string }[] =
    (deptData as { data?: { id: string; name: string }[] } | undefined)?.data ?? [];

  const mutation = useMutation({
    mutationFn: () =>
      api.post("/employees", {
        firstName,
        lastName,
        hireDate: hireDate || undefined,
        departmentId: departmentId || undefined,
      }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Employee created", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setFirstName(""); setLastName(""); setHireDate(""); setDepartmentId("");
      onClose();
    },
    onError: (err: Error) => toast({ title: "Failed to create", description: err.message, variant: "error" }),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Employee"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
            disabled={!firstName.trim() || !lastName.trim()}
          >
            Create Employee
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First Name" htmlFor="new-first" required>
            <Input id="new-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
          </FormField>
          <FormField label="Last Name" htmlFor="new-last" required>
            <Input id="new-last" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
          </FormField>
        </div>
        <FormField label="Department" htmlFor="new-dept">
          <Select
            id="new-dept"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            options={[
              { value: "", label: "No department" },
              ...departments.map((d) => ({ value: d.id, label: d.name })),
            ]}
          />
        </FormField>
        <FormField label="Hire Date" htmlFor="new-hire">
          <Input id="new-hire" type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} />
        </FormField>
      </div>
    </Modal>
  );
}

// ── EmployeesPage ──────────────────────────────────────────────────────────

export function EmployeesPage() {
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = { current: undefined as ReturnType<typeof setTimeout> | undefined };

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
    ...(debouncedSearch && { search: debouncedSearch }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["employees", page, debouncedSearch],
    queryFn: () =>
      api.get<EmployeesResponse>(`/employees?${params}`).then((r) => r.data),
  });

  const employees: Employee[] = (data as EmployeesResponse | undefined)?.data ?? [];
  const meta = (data as EmployeesResponse | undefined)?.meta;

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (row: Employee) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: "department",
      header: "Department",
      render: (row: Employee) =>
        row.department?.name ?? <span className="text-slate-400">—</span>,
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

  return (
    <div>
      <PageHeader
        title="Employees"
        actions={
          hasPermission("employees.write") ? (
            <Button onClick={() => setCreateOpen(true)}>New Employee</Button>
          ) : undefined
        }
      />

      <div className="flex gap-3 mb-4">
        <Input
          placeholder="Search employees…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <DataTable<Employee>
        columns={columns}
        data={employees}
        isLoading={isLoading}
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

      <CreateEmployeeModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
