import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PageHeader,
  Button,
  Badge,
  Modal,
  FormField,
  Input,
  Spinner,
} from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────

interface BudgetCategory {
  id: string;
  name: string;
  allocatedAmount: number;
  spentAmount: number;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  transactionDate: string | null;
  reference: string | null;
  category?: BudgetCategory | null;
}

interface Budget {
  id: string;
  approvedAmount: number;
  currency: string;
  totalSpent: number;
  remaining: number;
  approvalStatus: "APPROVED" | "PENDING" | "REJECTED";
  researchProject?: { title: string } | null;
  fundingSource?: { name: string } | null;
  categories?: BudgetCategory[];
  expenses?: Expense[];
}

interface BudgetSummary {
  approvedAmount: number;
  totalSpent: number;
  remaining: number;
  currency: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────


function formatCurrency(
  amount: number | null | undefined,
  currency = "USD",
): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

// ── AddExpenseModal ────────────────────────────────────────────────────────

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  budgetId: string;
  categories: BudgetCategory[];
}

function AddExpenseModal({ open, onClose, budgetId, categories }: AddExpenseModalProps) {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [reference, setReference] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api
        .post("/finance/expenses", {
          budgetId,
          description,
          amount: Number(amount),
          categoryId: categoryId || undefined,
          transactionDate: transactionDate || undefined,
          reference: reference || undefined,
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Expense added", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["finance-budget", budgetId] });
      queryClient.invalidateQueries({
        queryKey: ["finance-budget-summary", budgetId],
      });
      setDescription("");
      setAmount("");
      setCategoryId("");
      setTransactionDate("");
      setReference("");
      onClose();
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to add expense",
        description: err.message,
        variant: "error",
      });
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Expense"
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
            disabled={!description.trim() || !amount}
          >
            Add Expense
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Description" htmlFor="exp-description" required>
          <Input
            id="exp-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Expense description"
          />
        </FormField>
        <FormField label="Amount" htmlFor="exp-amount" required>
          <Input
            id="exp-amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </FormField>
        <FormField label="Category" htmlFor="exp-category">
          <select
            id="exp-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Transaction Date" htmlFor="exp-date">
          <Input
            id="exp-date"
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
          />
        </FormField>
        <FormField label="Reference" htmlFor="exp-reference">
          <Input
            id="exp-reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Reference number (optional)"
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── BudgetDetailPage ───────────────────────────────────────────────────────

export function BudgetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["finance-budget", id],
    queryFn: () =>
      api.get<{ data: Budget }>(`/finance/budgets/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const { data: summaryData } = useQuery({
    queryKey: ["finance-budget-summary", id],
    queryFn: () =>
      api
        .get<{ data: BudgetSummary }>(`/finance/budgets/${id}/summary`)
        .then((r) => r.data),
    enabled: !!id,
  });

  const budget: Budget | undefined = (data as { data?: Budget } | undefined)
    ?.data;

  const summary: BudgetSummary | undefined = (
    summaryData as { data?: BudgetSummary } | undefined
  )?.data;

  const approveMutation = useMutation({
    mutationFn: () =>
      api.post(`/finance/budgets/${id}/approve`, {}).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Budget approved", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["finance-budget", id] });
      queryClient.invalidateQueries({
        queryKey: ["finance-budget-summary", id],
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to approve budget",
        description: err.message,
        variant: "error",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () =>
      api
        .post(`/finance/budgets/${id}/reject`, { reason: "Rejected" })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Budget rejected", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["finance-budget", id] });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to reject budget",
        description: err.message,
        variant: "error",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="p-8 text-center text-slate-500">Budget not found.</div>
    );
  }

  const approved = summary?.approvedAmount ?? budget.approvedAmount;
  const spent = summary?.totalSpent ?? budget.totalSpent;
  const remaining = summary?.remaining ?? budget.remaining;
  const currency = summary?.currency ?? budget.currency;

  const spentPercent =
    approved > 0 ? Math.min((spent / approved) * 100, 100) : 0;

  const categories = budget.categories ?? [];
  const expenses = budget.expenses ?? [];

  // Progress bar fill colour based on spend %
  const progressFill =
    spentPercent >= 90
      ? "bg-[#c53030]"
      : spentPercent >= 70
        ? "bg-[#d97706]"
        : "bg-[#193441]";

  return (
    <div>
      <PageHeader
        title={budget.researchProject?.title ?? "Budget Detail"}
        actions={
          <Button variant="ghost" onClick={() => navigate("/finance/budgets")}>
            ← Back
          </Button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[#e2e8f0] p-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096] mb-1">
            Approved Amount
          </p>
          <p className="text-[28px] font-bold text-[#193441] leading-none font-mono">
            {formatCurrency(approved, currency)}
          </p>
        </div>
        <div className="bg-white border border-[#e2e8f0] p-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096] mb-1">
            Spent
          </p>
          <p className="text-[28px] font-bold text-[#193441] leading-none font-mono">
            {formatCurrency(spent, currency)}
          </p>
        </div>
        <div className="bg-white border border-[#e2e8f0] p-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096] mb-1">
            Remaining
          </p>
          <p className="text-[28px] font-bold text-[#193441] leading-none font-mono mb-2">
            {formatCurrency(remaining, currency)}
          </p>
          <div className="w-full h-[7px] bg-[#e2e8f0] overflow-hidden">
            <div
              className={`h-full transition-[width] ${progressFill}`}
              style={{ width: `${spentPercent}%` }}
            />
          </div>
          <p className="text-[9px] text-[#718096] mt-1">
            {spentPercent.toFixed(1)}% spent
          </p>
        </div>
      </div>

      {/* Status + approval actions */}
      <div className="bg-white border border-[#e2e8f0] p-5 mb-6 flex flex-wrap items-center gap-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096] mb-1">
            Approval Status
          </p>
          <Badge
            label={budget.approvalStatus}
          />
        </div>
        {budget.fundingSource && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096] mb-1">
              Funding Source
            </p>
            <p className="text-[13px] font-semibold text-[#193441]">
              {budget.fundingSource.name}
            </p>
          </div>
        )}
        {budget.approvalStatus === "PENDING" &&
          hasPermission("finance.approve") && (
            <div className="ml-auto flex gap-2">
              <Button
                variant="primary"
                onClick={() => approveMutation.mutate()}
                loading={approveMutation.isPending}
                disabled={rejectMutation.isPending}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => rejectMutation.mutate()}
                loading={rejectMutation.isPending}
                disabled={approveMutation.isPending}
              >
                Reject
              </Button>
            </div>
          )}
      </div>

      {/* Category breakdown */}
      {categories.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441] border-b-2 border-[#193441] pb-1 mb-3">
            Category Breakdown
          </h2>
          <div className="bg-white border border-[#e2e8f0] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#193441]">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    Name
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    Allocated
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    Spent
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    Remaining
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => {
                  const catRemaining = cat.allocatedAmount - cat.spentAmount;
                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-[#f0f4f7] border-b border-[#e2e8f0]"
                    >
                      <td className="px-4 py-3 text-[#193441] font-medium">
                        {cat.name}
                      </td>
                      <td className="px-4 py-3 text-right text-[#193441]">
                        {formatCurrency(cat.allocatedAmount, currency)}
                      </td>
                      <td className="px-4 py-3 text-right text-[#193441]">
                        {formatCurrency(cat.spentAmount, currency)}
                      </td>
                      <td className="px-4 py-3 text-right text-[#193441]">
                        {formatCurrency(catRemaining, currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expenses */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441] border-b-2 border-[#193441] pb-1">
            Expenses
          </h2>
          <Button size="sm" onClick={() => setExpenseModalOpen(true)}>
            Add Expense
          </Button>
        </div>
        <div className="bg-white border border-[#e2e8f0] overflow-hidden">
          {expenses.length === 0 ? (
            <p className="px-4 py-8 text-sm text-slate-500 text-center">
              No expenses recorded yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#193441]">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className="hover:bg-[#f0f4f7] border-b border-[#e2e8f0]"
                  >
                    <td className="px-4 py-3 text-[#193441]">
                      {exp.description}
                    </td>
                    <td className="px-4 py-3 text-[#193441]">
                      {exp.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[#193441]">
                      {formatCurrency(exp.amount, exp.currency)}
                    </td>
                    <td className="px-4 py-3 text-[#193441]">
                      {formatDate(exp.transactionDate)}
                    </td>
                    <td className="px-4 py-3 font-mono text-[#193441]">
                      {exp.reference ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddExpenseModal
        open={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        budgetId={id!}
        categories={categories}
      />
    </div>
  );
}
