import { useState } from "react";
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
} from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────

interface Role {
  id: string;
  name: string;
  isSystem: boolean;
  _count?: { rolePermissions: number };
}

interface RolesResponse {
  data: Role[];
  meta?: unknown;
}

// ── Schema ─────────────────────────────────────────────────────────────────

const createRoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});
type CreateRoleValues = z.infer<typeof createRoleSchema>;

// ── CreateRoleModal ────────────────────────────────────────────────────────

interface CreateRoleModalProps {
  open: boolean;
  onClose: () => void;
}

function CreateRoleModal({ open, onClose }: CreateRoleModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoleValues>({ resolver: zodResolver(createRoleSchema) });

  const mutation = useMutation({
    mutationFn: (values: CreateRoleValues) =>
      api.post("/roles", values).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Role created", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      reset();
      onClose();
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to create role",
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
      title="New Role"
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
            Create Role
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField
          label="Name"
          htmlFor="role-name"
          error={errors.name?.message}
          required
        >
          <Input
            id="role-name"
            placeholder="e.g. Finance Auditor"
            error={errors.name?.message}
            {...register("name")}
          />
        </FormField>
        <FormField
          label="Description"
          htmlFor="role-desc"
          error={errors.description?.message}
        >
          <Input
            id="role-desc"
            placeholder="Optional description"
            {...register("description")}
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── RolesPage ──────────────────────────────────────────────────────────────

export function RolesPage() {
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => api.get<RolesResponse>("/roles").then((r) => r.data),
  });

  const roles: Role[] = Array.isArray(data)
    ? (data as Role[])
    : ((data as RolesResponse | undefined)?.data ?? []);

  const columns = [
    { key: "name", header: "Name" },
    {
      key: "type",
      header: "Type",
      render: (row: Role) => (
        <Badge
          variant={row.isSystem ? "pending" : "active"}
          label={row.isSystem ? "System" : "Custom"}
        />
      ),
    },
    {
      key: "permissions",
      header: "Permissions",
      render: (row: Role) => `${row._count?.rolePermissions ?? 0} permissions`,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        actions={
          hasPermission("roles.create") ? (
            <Button onClick={() => setCreateOpen(true)}>New Role</Button>
          ) : undefined
        }
      />

      <DataTable<Role>
        columns={columns}
        data={roles}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        rowActions={(row) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/roles/${row.id}`)}
          >
            Manage
          </Button>
        )}
      />

      <CreateRoleModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
