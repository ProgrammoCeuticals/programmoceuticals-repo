import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

interface KpiDefinition {
  id: string;
  name: string;
  category: string | null;
  measurementType: string;
  directionality: string;
  status: string;
  defaultWeight: number | null;
  targetValue: number | null;
  description: string | null;
}

interface KpiResponse {
  data: KpiDefinition[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

// ── NewKpiModal ────────────────────────────────────────────────────────────

interface NewKpiModalProps {
  open: boolean;
  onClose: () => void;
}

function NewKpiModal({ open, onClose }: NewKpiModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [measurementType, setMeasurementType] = useState("NUMERIC");
  const [directionality, setDirectionality] = useState("HIGHER_IS_BETTER");
  const [defaultWeight, setDefaultWeight] = useState("");
  const [targetValue, setTargetValue] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api
        .post("/performance/kpis", {
          name,
          description: description || undefined,
          category: category || undefined,
          measurementType,
          directionality,
          defaultWeight: defaultWeight ? Number(defaultWeight) : undefined,
          targetValue: targetValue ? Number(targetValue) : undefined,
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: "KPI created", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["kpi-definitions"] });
      setName("");
      setDescription("");
      setCategory("");
      setMeasurementType("NUMERIC");
      setDirectionality("HIGHER_IS_BETTER");
      setDefaultWeight("");
      setTargetValue("");
      onClose();
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to create KPI",
        description: err.message,
        variant: "error",
      });
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New KPI Definition"
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
            disabled={!name.trim()}
          >
            Create KPI
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Name" htmlFor="kpi-name" required>
          <Input
            id="kpi-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="KPI name"
          />
        </FormField>
        <FormField label="Description" htmlFor="kpi-description">
          <Input
            id="kpi-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </FormField>
        <FormField label="Category" htmlFor="kpi-category">
          <Input
            id="kpi-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Research, Operations"
          />
        </FormField>
        <FormField label="Measurement Type" htmlFor="kpi-measurement">
          <Select
            id="kpi-measurement"
            value={measurementType}
            onChange={(e) => setMeasurementType(e.target.value)}
            options={[
              { value: "NUMERIC", label: "Numeric" },
              { value: "PERCENTAGE", label: "Percentage" },
              { value: "BOOLEAN", label: "Boolean" },
              { value: "MILESTONE", label: "Milestone" },
            ]}
          />
        </FormField>
        <FormField label="Directionality" htmlFor="kpi-directionality">
          <Select
            id="kpi-directionality"
            value={directionality}
            onChange={(e) => setDirectionality(e.target.value)}
            options={[
              { value: "HIGHER_IS_BETTER", label: "Higher is Better" },
              { value: "LOWER_IS_BETTER", label: "Lower is Better" },
              { value: "TARGET_IS_BEST", label: "Target is Best" },
            ]}
          />
        </FormField>
        <FormField label="Default Weight" htmlFor="kpi-weight">
          <Input
            id="kpi-weight"
            type="number"
            value={defaultWeight}
            onChange={(e) => setDefaultWeight(e.target.value)}
            placeholder="e.g. 1"
          />
        </FormField>
        <FormField label="Target Value" htmlFor="kpi-target">
          <Input
            id="kpi-target"
            type="number"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder="e.g. 100"
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── KpiDefinitionsPage ─────────────────────────────────────────────────────

export function KpiDefinitionsPage() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["kpi-definitions"],
    queryFn: () =>
      api
        .get<KpiResponse>("/performance/kpis?pageSize=100")
        .then((r) => r.data),
  });

  const kpis: KpiDefinition[] = (data as KpiResponse | undefined)?.data ?? [];

  const columns = [
    { key: "name", header: "Name" },
    {
      key: "category",
      header: "Category",
      render: (row: KpiDefinition) => row.category ?? "—",
    },
    { key: "measurementType", header: "Measurement Type" },
    { key: "directionality", header: "Directionality" },
    {
      key: "status",
      header: "Active",
      render: (row: KpiDefinition) => <Badge label={row.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="KPI Definitions"
        actions={
          hasPermission("performance.kpis.configure") ? (
            <Button onClick={() => setModalOpen(true)}>New KPI</Button>
          ) : undefined
        }
      />

      <DataTable<KpiDefinition>
        columns={columns}
        data={kpis}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
      />

      <NewKpiModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
