import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PageHeader,
  Button,
  Badge,
  DataTable,
  Modal,
  FormField,
  Input,
  Select,
} from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
}

interface Role {
  id: string;
  name: string;
}

interface UsersResponse {
  data: User[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

// ── Helpers ────────────────────────────────────────────────────────────────


// ── Invite schema ──────────────────────────────────────────────────────────

const inviteSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  roleId: z.string().min(1, "Role is required"),
});
type InviteFormValues = z.infer<typeof inviteSchema>;

// ── InviteUserModal ────────────────────────────────────────────────────────

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
}

function InviteUserModal({ open, onClose }: InviteUserModalProps) {
  const queryClient = useQueryClient();

  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: () => api.get<{ data: Role[] }>("/roles").then((r) => r.data),
    enabled: open,
  });
  const roles: Role[] =
    (rolesData as { data?: Role[] } | undefined)?.data ??
    (Array.isArray(rolesData) ? (rolesData as Role[]) : []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormValues>({ resolver: zodResolver(inviteSchema) });

  const mutation = useMutation({
    mutationFn: (values: InviteFormValues) =>
      api.post("/users/invitations", values).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Invitation sent", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      reset();
      onClose();
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to send invitation",
        description: err.message,
        variant: "error",
      });
    },
  });

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Invite User"
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit((v) => mutation.mutate(v))}
            loading={mutation.isPending}
          >
            Send Invitation
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField
          label="Email"
          htmlFor="invite-email"
          error={errors.email?.message}
          required
        >
          <Input
            id="invite-email"
            type="email"
            placeholder="user@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
        </FormField>
        <FormField
          label="Role"
          htmlFor="invite-roleId"
          error={errors.roleId?.message}
          required
        >
          <Select
            id="invite-roleId"
            error={errors.roleId?.message}
            options={[
              { value: "", label: "Select a role" },
              ...roles.map((r) => ({ value: r.id, label: r.name })),
            ]}
            {...register("roleId")}
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── UsersPage ──────────────────────────────────────────────────────────────

export function UsersPage() {
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);

  // debounce search
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
    ...(debouncedSearch && { search: debouncedSearch }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, statusFilter, debouncedSearch],
    queryFn: () =>
      api.get<UsersResponse>(`/users?${params}`).then((r) => r.data),
  });

  const users: User[] = (data as UsersResponse | undefined)?.data ?? [];
  const meta = (data as UsersResponse | undefined)?.meta;

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (row: User) => `${row.firstName} ${row.lastName}`,
    },
    { key: "email", header: "Email" },
    {
      key: "status",
      header: "Status",
      render: (row: User) => (
        <Badge label={row.status} />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Users"
        actions={
          hasPermission("users.invite") ? (
            <Button onClick={() => setInviteOpen(true)}>Invite User</Button>
          ) : undefined
        }
      />

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Select
          options={[
            { value: "all", label: "All Statuses" },
            { value: "ACTIVE", label: "Active" },
            { value: "SUSPENDED", label: "Suspended" },
            { value: "PENDING_VERIFICATION", label: "Pending Verification" },
          ]}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-48"
        />
        <Input
          placeholder="Search users…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <DataTable<User>
        columns={columns}
        data={users}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        rowActions={(row) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/users/${row.id}`)}
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

      <InviteUserModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
