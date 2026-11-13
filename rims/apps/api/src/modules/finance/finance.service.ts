import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { Prisma, BudgetApprovalStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { NotificationDispatcher } from "../notifications/notification-dispatcher";
import { QueryFundingSourcesDto } from "./dtos/query-funding-sources.dto";
import { CreateFundingSourceDto } from "./dtos/create-funding-source.dto";
import { QueryBudgetsDto } from "./dtos/query-budgets.dto";
import { CreateBudgetDto } from "./dtos/create-budget.dto";
import { QueryExpensesDto } from "./dtos/query-expenses.dto";
import { CreateExpenseDto } from "./dtos/create-expense.dto";

// Suppress unused-import warning for ForbiddenException — kept for future use
void ForbiddenException;
void BadRequestException;

@Injectable()
export class FinanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly dispatcher: NotificationDispatcher,
  ) {}

  // ── Funding Sources ────────────────────────────────────────────────────────

  async findFundingSources(tenantId: string, query: QueryFundingSourcesDto) {
    const where: Prisma.FundingSourceWhereInput = { tenantId };

    if (query.search) {
      where.name = { contains: query.search, mode: "insensitive" };
    }
    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    return this.prisma.fundingSource.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async createFundingSource(
    dto: CreateFundingSourceDto,
    tenantId: string,
  ) {
    return this.prisma.fundingSource.create({
      data: {
        tenantId,
        name: dto.name,
        ...(dto.funderName !== undefined ? { funderName: dto.funderName } : {}),
        ...(dto.grantRef !== undefined ? { grantRef: dto.grantRef } : {}),
        ...(dto.totalAmount !== undefined
          ? { totalAmount: new Prisma.Decimal(dto.totalAmount) }
          : {}),
        ...(dto.currency !== undefined ? { currency: dto.currency } : {}),
        ...(dto.startDate !== undefined
          ? { startDate: new Date(dto.startDate) }
          : {}),
        ...(dto.endDate !== undefined
          ? { endDate: new Date(dto.endDate) }
          : {}),
      },
    });
  }

  // ── Budgets ────────────────────────────────────────────────────────────────

  async findBudgets(tenantId: string, query: QueryBudgetsDto) {
    const where: Prisma.ProjectBudgetWhereInput = { tenantId };

    if (query.researchProjectId) {
      where.researchProjectId = query.researchProjectId;
    }
    if (query.approvalStatus) {
      where.approvalStatus = query.approvalStatus as BudgetApprovalStatus;
    }

    const budgets = await this.prisma.projectBudget.findMany({
      where,
      include: {
        fundingSource: { select: { id: true, name: true } },
        researchProject: { select: { id: true, title: true } },
        _count: { select: { expenses: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Aggregate total spent per budget
    const spentRows = await this.prisma.expense.groupBy({
      by: ["budgetId"],
      where: { tenantId },
      _sum: { amount: true },
    });

    const spentMap = new Map<string, number>();
    for (const row of spentRows) {
      spentMap.set(row.budgetId, row._sum.amount?.toNumber() ?? 0);
    }

    return budgets.map((budget) => {
      const totalSpent = spentMap.get(budget.id) ?? 0;
      const remaining = budget.approvedAmount.toNumber() - totalSpent;
      return { ...budget, totalSpent, remaining };
    });
  }

  async findBudget(id: string, tenantId: string) {
    const budget = await this.prisma.projectBudget.findFirst({
      where: { id, tenantId },
      include: {
        categories: true,
        expenses: {
          include: {
            category: { select: { id: true, name: true } },
          },
          orderBy: { transactionDate: "desc" },
        },
        fundingSource: { select: { id: true, name: true } },
        researchProject: { select: { id: true, title: true } },
      },
    });

    if (!budget) {
      throw new NotFoundException("Budget not found");
    }

    return budget;
  }

  async createBudget(
    dto: CreateBudgetDto,
    tenantId: string,
    createdById: string,
  ) {
    const project = await this.prisma.researchProject.findFirst({
      where: { id: dto.researchProjectId, tenantId },
    });

    if (!project) {
      throw new NotFoundException("Research project not found");
    }

    const budget = await this.prisma.projectBudget.create({
      data: {
        tenantId,
        researchProjectId: dto.researchProjectId,
        approvedAmount: new Prisma.Decimal(dto.approvedAmount),
        ...(dto.fundingSourceId !== undefined
          ? { fundingSourceId: dto.fundingSourceId }
          : {}),
        ...(dto.currency !== undefined ? { currency: dto.currency } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId: createdById,
      action: "budget.created",
      resourceType: "ProjectBudget",
      resourceId: budget.id,
      outcome: "SUCCESS",
    });

    // Notify approvers
    await this.dispatcher.dispatchToPermission(
      "budget.pending_approval",
      "finance.budgets.approve",
      {
        tenantId,
        title: "Budget awaiting approval",
        body: `A new budget of ${dto.approvedAmount} ${dto.currency ?? "USD"} has been submitted for approval.`,
        resourceType: "ProjectBudget",
        resourceId: budget.id,
        actionUrl: `/finance/budgets/${budget.id}`,
      },
    );

    return budget;
  }

  async approveBudget(id: string, tenantId: string, actorId: string) {
    const budget = await this.prisma.projectBudget.findFirst({
      where: { id, tenantId },
    });

    if (!budget) {
      throw new NotFoundException("Budget not found");
    }

    const updated = await this.prisma.projectBudget.update({
      where: { id },
      data: {
        approvalStatus: BudgetApprovalStatus.APPROVED,
        approvedById: actorId,
        approvedAt: new Date(),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "budget.approved",
      resourceType: "ProjectBudget",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async rejectBudget(
    id: string,
    tenantId: string,
    actorId: string,
    reason: string,
  ) {
    const budget = await this.prisma.projectBudget.findFirst({
      where: { id, tenantId },
    });

    if (!budget) {
      throw new NotFoundException("Budget not found");
    }

    const updated = await this.prisma.projectBudget.update({
      where: { id },
      data: {
        approvalStatus: BudgetApprovalStatus.REJECTED,
        notes: reason,
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "budget.rejected",
      resourceType: "ProjectBudget",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  // ── Expenses ───────────────────────────────────────────────────────────────

  async findExpenses(tenantId: string, query: QueryExpensesDto) {
    const { budgetId, categoryId, dateFrom, dateTo, page = 1, pageSize = 20 } =
      query;

    const where: Prisma.ExpenseWhereInput = { tenantId };

    if (budgetId) where.budgetId = budgetId;
    if (categoryId) where.categoryId = categoryId;
    if (dateFrom ?? dateTo) {
      where.transactionDate = {};
      if (dateFrom) (where.transactionDate as Prisma.DateTimeFilter).gte = new Date(dateFrom);
      if (dateTo) (where.transactionDate as Prisma.DateTimeFilter).lte = new Date(dateTo);
    }

    const [total, data] = await Promise.all([
      this.prisma.expense.count({ where }),
      this.prisma.expense.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
        },
        orderBy: { transactionDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async createExpense(
    dto: CreateExpenseDto,
    tenantId: string,
    submittedById: string,
  ) {
    const budget = await this.prisma.projectBudget.findFirst({
      where: { id: dto.budgetId, tenantId },
    });

    if (!budget) {
      throw new NotFoundException("Budget not found");
    }

    const expense = await this.prisma.expense.create({
      data: {
        tenantId,
        budgetId: dto.budgetId,
        description: dto.description,
        amount: new Prisma.Decimal(dto.amount),
        transactionDate: new Date(dto.transactionDate),
        submittedById,
        ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
        ...(dto.currency !== undefined ? { currency: dto.currency } : {}),
        ...(dto.reference !== undefined ? { reference: dto.reference } : {}),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId: submittedById,
      action: "expense.created",
      resourceType: "Expense",
      resourceId: expense.id,
      outcome: "SUCCESS",
    });

    return expense;
  }

  // ── Budget Summary ─────────────────────────────────────────────────────────

  async getBudgetSummary(budgetId: string, tenantId: string) {
    const budget = await this.prisma.projectBudget.findFirst({
      where: { id: budgetId, tenantId },
      include: {
        categories: true,
        expenses: true,
      },
    });

    if (!budget) {
      throw new NotFoundException("Budget not found");
    }

    const totalSpent = budget.expenses.reduce(
      (sum, e) => sum + e.amount.toNumber(),
      0,
    );

    const categorySummary = budget.categories.map((cat) => {
      const spent = budget.expenses
        .filter((e) => e.categoryId === cat.id)
        .reduce((sum, e) => sum + e.amount.toNumber(), 0);
      return {
        name: cat.name,
        allocated: cat.allocated.toNumber(),
        spent,
      };
    });

    const approvedAmount = budget.approvedAmount.toNumber();
    const remaining = approvedAmount - totalSpent;

    return {
      approvedAmount,
      totalSpent,
      committed: 0,
      remaining,
      currency: budget.currency,
      categorySummary,
    };
  }
}
