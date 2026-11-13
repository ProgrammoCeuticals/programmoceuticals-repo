import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PageHeader,
  Button,
  Badge,
  DataTable,
  Modal,
  FormField,
  Input,
  Spinner,
} from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────

interface FundingSource {
  id: string;
  name: string;
  funderName: string | null;
  grantRef: string | null;
  totalAmount: number | null;
  currency: string;
  isActive: boolean;
}

interface FundingSourcesResponse {
  data: FundingSource[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

interface Budget {
  id: string;
  researchProject?: { title: string } | null;
  fundingSource?: { name: string } | null;
  approvedAmount: number;
  currency: string;
  totalSpent: number;
  remaining: number;
  approvalStatus: "APPROVED" | "PENDING" | "REJECTED";
}

// ── Helpers ────────────────────────────────────────────────────────────────


function formatCurrency(amount: number | null, currency = "USD"): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// ── NewFundingSourceModal ──────────────────────────────────────────────────

interface NewFundingSourceModalProps {
  open: boolean;
  onClose: () => void;
}

function NewFundingSourceModal({ open, onClose }: NewFundingSourceModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [funderName, setFunderName] = useState("");
  const [grantRef, setGrantRef] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [currency, setCurrency] = useState("USD");

  const mutation = useMutation({
    mutationFn: () =>
      api
        .post("/finance/funding-sources", {
          name,
          funderName: funderName || undefined,
          grantRef: grantRef || undefined,
          totalAmount: totalAmount ? Number(totalAmount) : undefined,
          currency,
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Funding source created", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["finance-funding-sources"] });
      setName("");
      setFunderName("");
      setGrantRef("");
      setTotalAmount("");
      setCurrency("USD");
      onClose();
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to create funding source",
        description: err.message,
        variant: "error",
      });
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Funding Source"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
            disabled={!name.trim()}
          >
            Create
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Name" htmlFor="fs-name" required>
          <Input
            id="fs-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Funding source name"
          />
        </FormField>
        <FormField label="Funder Name" htmlFor="fs-funder">
          <Input
            id="fs-funder"
            value={funderName}
            onChange={(e) => setFunderName(e.target.value)}
            placeholder="Organisation or person funding"
          />
        </FormField>
        <FormField label="Grant Reference" htmlFor="fs-grant-ref">
          <Input
            id="fs-grant-ref"
            value={grantRef}
            onChange={(e) => setGrantRef(e.target.value)}
            placeholder="Grant reference number"
          />
        </FormField>
        <FormField label="Total Amount" htmlFor="fs-amount">
          <Input
            id="fs-amount"
            type="number"
            min="0"
            step="0.01"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="0.00"
          />
        </FormField>
        <FormField label="Currency" htmlFor="fs-currency">
          <Input
            id="fs-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="USD"
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── NewBudgetModal ─────────────────────────────────────────────────────────

interface NewBudgetModalProps {
  open: boolean;
  onClose: () => void;
}

function NewBudgetModal({ open, onClose }: NewBudgetModalProps) {
  const queryClient = useQueryClient();
  const [researchProjectId, setResearchProjectId] = useState("");
  const [fundingSourceId, setFundingSourceId] = useState("");
  const [approvedAmount, setApprovedAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");

  const { data: projectsData } = useQuery({
    queryKey: ["research-projects", "all-for-budget"],
    queryFn: () => api.get("/research/projects?pageSize=100").then((r) => r.data),
    enabled: open,
  });
  const { data: fsAllData } = useQuery({
    queryKey: ["finance-funding-sources", "all"],
    queryFn: () => api.get("/finance/funding-sources").then((r) => r.data),
    enabled: open,
  });

  const projectOptions = [
    { value: "", label: "Select a research project…" },
    ...((projectsData?.data ?? []) as Array<{ id: string; title: string }>).map(
      (p) => ({ value: p.id, label: p.title }),
    ),
  ];
  const fsOptions = [
    { value: "", label: "No funding source" },
    ...((Array.isArray(fsAllData) ? fsAllData : (fsAllData?.data ?? [])) as Array<{ id: string; name: string }>).map(
      (f) => ({ value: f.id, label: f.name }),
    ),
  ];

  const mutation = useMutation({
    mutationFn: () =>
      api
        .post("/finance/budgets", {
          researchProjectId,
          fundingSourceId: fundingSourceId || undefined,
          approvedAmount: String(approvedAmount),
          currency: currency || undefined,
          notes: notes || undefined,
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Budget created", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["finance-budgets"] });
      setResearchProjectId("");
      setFundingSourceId("");
      setApprovedAmount("");
      setCurrency("USD");
      setNotes("");
      onClose();
    },
    onError: (err: Error) => {
      toast({ title: "Failed to create budget", description: err.message, variant: "error" });
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Budget"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
            disabled={!researchProjectId || !approvedAmount}
          >
            Create
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Research Project" htmlFor="budget-project" required>
          <select
            id="budget-project"
            value={researchProjectId}
            onChange={(e) => setResearchProjectId(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {projectOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </FormField>
        <FormField label="Funding Source" htmlFor="budget-fs">
          <select
            id="budget-fs"
            value={fundingSourceId}
            onChange={(e) => setFundingSourceId(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fsOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </FormField>
        <FormField label="Approved Amount" htmlFor="budget-amount" required>
          <Input
            id="budget-amount"
            type="number"
            min="0"
            step="0.01"
            value={approvedAmount}
            onChange={(e) => setApprovedAmount(e.target.value)}
            placeholder="0.00"
          />
        </FormField>
        <FormField label="Currency" htmlFor="budget-currency">
          <Input
            id="budget-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="USD"
          />
        </FormField>
        <FormField label="Notes" htmlFor="budget-notes">
          <Input
            id="budget-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes"
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── BudgetsPage ────────────────────────────────────────────────────────────

export function BudgetsPage() {
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const [fundingSourcesOpen, setFundingSourcesOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState<"funding-source" | "budget" | null>(null);

  const [fsPage, setFsPage] = useState(1);

  const { data: fsData, isLoading: fsLoading } = useQuery({
    queryKey: ["finance-funding-sources", fsPage],
    queryFn: () =>
      api
        .get<FundingSourcesResponse>(
          `/finance/funding-sources?page=${fsPage}&pageSize=20`
        )
        .then((r) => r.data),
    enabled: fundingSourcesOpen,
  });

  const fundingSources: FundingSource[] =
    (fsData as FundingSourcesResponse | undefined)?.data ?? [];
  const fsMeta = (fsData as FundingSourcesResponse | undefined)?.meta;

  const { data: budgetData, isLoading: budgetLoading } = useQuery({
    queryKey: ["finance-budgets", budgetPage],
    queryFn: () =>
      api.get(`/finance/budgets`).then((r) => r.data),
  });

  const budgets: Budget[] = Array.isArray(budgetData) ? budgetData : [];

  const fsColumns = [
    { key: "name", header: "Name" },
    {
      key: "funderName",
      header: "Funder",
      render: (row: FundingSource) => row.funderName ?? "—",
    },
    {
      key: "grantRef",
      header: "Grant Ref",
      render: (row: FundingSource) => row.grantRef ?? "—",
    },
    {
      key: "totalAmount",
      header: "Total Amount",
      render: (row: FundingSource) =>
        formatCurrency(row.totalAmount, row.currency),
    },
    {
      key: "isActive",
      header: "Status",
      render: (row: FundingSource) => (
        <Badge
          variant={row.isActive ? "active" : "inactive"}
          label={row.isActive ? "Active" : "Inactive"}
        />
      ),
    },
  ];

  const budgetColumns = [
    {
      key: "researchProject",
      header: "Research Project",
      render: (row: Budget) => row.researchProject?.title ?? "—",
    },
    {
      key: "fundingSource",
      header: "Funding Source",
      render: (row: Budget) => row.fundingSource?.name ?? "—",
    },
    {
      key: "approvedAmount",
      header: "Approved Amount",
      render: (row: Budget) =>
        formatCurrency(row.approvedAmount, row.currency),
    },
    {
      key: "totalSpent",
      header: "Spent",
      render: (row: Budget) => formatCurrency(row.totalSpent, row.currency),
    },
    {
      key: "remaining",
      header: "Remaining",
      render: (row: Budget) => formatCurrency(row.remaining, row.currency),
    },
    {
      key: "approvalStatus",
      header: "Approval Status",
      render: (row: Budget) => (
        <Badge
          label={row.approvalStatus}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Finance & Budgets"
        actions={
          hasPermission("finance.create") ? (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setModalOpen("funding-source")}
              >
                New Funding Source
              </Button>
              <Button onClick={() => setModalOpen("budget")}>
                New Budget
              </Button>
            </div>
          ) : undefined
        }
      />

      {/* Funding Sources section (collapsible) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-slate-700">
            Funding Sources
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFundingSourcesOpen((prev) => !prev)}
          >
            {fundingSourcesOpen ? "Hide" : "Show"}
          </Button>
        </div>

        {fundingSourcesOpen && (
          <>
            {fsLoading ? (
              <div className="flex items-center justify-center py-10">
                <Spinner size="md" />
              </div>
            ) : (
              <DataTable<FundingSource>
                columns={fsColumns}
                data={fundingSources}
                isLoading={false}
                getRowKey={(row) => row.id}
                pagination={
                  fsMeta
                    ? {
                        page: fsMeta.page,
                        pageSize: fsMeta.pageSize,
                        total: fsMeta.total,
                        totalPages: fsMeta.totalPages,
                        onPageChange: setFsPage,
                      }
                    : undefined
                }
              />
            )}
          </>
        )}
      </div>

      {/* Project Budgets section */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-2">
          Project Budgets
        </h2>
        <DataTable<Budget>
          columns={budgetColumns}
          data={budgets}
          isLoading={budgetLoading}
          getRowKey={(row) => row.id}
          rowActions={(row) => (            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/finance/budgets/${row.id}`)}
            >
              View
            </Button>
          )}
          pagination={undefined}
        />
      </div>

      <NewFundingSourceModal
        open={modalOpen === "funding-source"}
        onClose={() => setModalOpen(null)}
      />
      <NewBudgetModal
        open={modalOpen === "budget"}
        onClose={() => setModalOpen(null)}
      />
    </div>
  );
}
