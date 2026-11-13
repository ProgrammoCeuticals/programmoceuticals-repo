import type { AxiosInstance } from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types';

export interface FundingSource {
  id: string;
  tenantId: string;
  name: string;
  funderName: string | null;
  grantRef: string | null;
  totalAmount: string | null;
  currency: string;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectBudget {
  id: string;
  tenantId: string;
  researchProjectId: string;
  fundingSourceId: string | null;
  approvedAmount: string;
  currency: string;
  approvalStatus: string;
  approvedById: string | null;
  approvedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  totalSpent?: number;
  remaining?: number;
  fundingSource?: { id: string; name: string } | null;
  researchProject?: { id: string; title: string } | null;
}

export interface Expense {
  id: string;
  tenantId: string;
  budgetId: string;
  categoryId: string | null;
  description: string;
  amount: string;
  currency: string;
  transactionDate: string;
  reference: string | null;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string } | null;
}

export interface BudgetSummary {
  approvedAmount: string;
  totalSpent: number;
  committed: number;
  remaining: number;
  currency: string;
  categorySummary: Array<{ name: string; allocated: string; spent: number }>;
}

export interface CreateFundingSourcePayload {
  name: string;
  funderName?: string;
  grantRef?: string;
  totalAmount?: string;
  currency?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateBudgetPayload {
  researchProjectId: string;
  fundingSourceId?: string;
  approvedAmount: string;
  currency?: string;
  notes?: string;
}

export interface CreateExpensePayload {
  budgetId: string;
  categoryId?: string;
  description: string;
  amount: string;
  currency?: string;
  transactionDate: string;
  reference?: string;
}

export const listFundingSources = (
  client: AxiosInstance,
  params?: { search?: string; isActive?: boolean },
) =>
  client
    .get<ApiResponse<FundingSource[]>>('/finance/funding-sources', { params })
    .then((r) => r.data);

export const createFundingSource = (client: AxiosInstance, payload: CreateFundingSourcePayload) =>
  client
    .post<ApiResponse<FundingSource>>('/finance/funding-sources', payload)
    .then((r) => r.data);

export const listBudgets = (
  client: AxiosInstance,
  params?: { researchProjectId?: string; approvalStatus?: string },
) =>
  client.get<ApiResponse<ProjectBudget[]>>('/finance/budgets', { params }).then((r) => r.data);

export const createBudget = (client: AxiosInstance, payload: CreateBudgetPayload) =>
  client.post<ApiResponse<ProjectBudget>>('/finance/budgets', payload).then((r) => r.data);

export const getBudget = (client: AxiosInstance, id: string) =>
  client.get<ApiResponse<ProjectBudget>>(`/finance/budgets/${id}`).then((r) => r.data);

export const approveBudget = (client: AxiosInstance, id: string) =>
  client
    .post<ApiResponse<ProjectBudget>>(`/finance/budgets/${id}/approve`)
    .then((r) => r.data);

export const rejectBudget = (client: AxiosInstance, id: string, reason: string) =>
  client
    .post<ApiResponse<ProjectBudget>>(`/finance/budgets/${id}/reject`, { reason })
    .then((r) => r.data);

export const getBudgetSummary = (client: AxiosInstance, id: string) =>
  client
    .get<ApiResponse<BudgetSummary>>(`/finance/budgets/${id}/summary`)
    .then((r) => r.data);

export const listExpenses = (
  client: AxiosInstance,
  params?: {
    budgetId?: string;
    categoryId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    pageSize?: number;
  },
) =>
  client.get<PaginatedResponse<Expense>>('/finance/expenses', { params }).then((r) => r.data);

export const createExpense = (client: AxiosInstance, payload: CreateExpensePayload) =>
  client.post<ApiResponse<Expense>>('/finance/expenses', payload).then((r) => r.data);
