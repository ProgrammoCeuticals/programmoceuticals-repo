import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "@rims/shared-types";
import { FinanceService } from "./finance.service";
import { QueryFundingSourcesDto } from "./dtos/query-funding-sources.dto";
import { CreateFundingSourceDto } from "./dtos/create-funding-source.dto";
import { QueryBudgetsDto } from "./dtos/query-budgets.dto";
import { CreateBudgetDto } from "./dtos/create-budget.dto";
import { RejectBudgetDto } from "./dtos/reject-budget.dto";
import { QueryExpensesDto } from "./dtos/query-expenses.dto";
import { CreateExpenseDto } from "./dtos/create-expense.dto";

@Controller("finance")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // ── Funding Sources ────────────────────────────────────────────────────────

  @Get("funding-sources")
  @RequirePermissions("finance.view")
  findFundingSources(
    @Query() query: QueryFundingSourcesDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.financeService.findFundingSources(user.tenantId, query);
  }

  @Post("funding-sources")
  @RequirePermissions("finance.create")
  createFundingSource(
    @Body() dto: CreateFundingSourceDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.financeService.createFundingSource(dto, user.tenantId);
  }

  // ── Budgets ────────────────────────────────────────────────────────────────

  @Get("budgets")
  @RequirePermissions("finance.view")
  findBudgets(
    @Query() query: QueryBudgetsDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.financeService.findBudgets(user.tenantId, query);
  }

  @Post("budgets")
  @RequirePermissions("finance.create")
  createBudget(
    @Body() dto: CreateBudgetDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.financeService.createBudget(dto, user.tenantId, user.sub);
  }

  @Get("budgets/:id")
  @RequirePermissions("finance.view")
  findBudget(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.financeService.findBudget(id, user.tenantId);
  }

  @Post("budgets/:id/approve")
  @RequirePermissions("finance.approve")
  approveBudget(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.financeService.approveBudget(id, user.tenantId, user.sub);
  }

  @Post("budgets/:id/reject")
  @RequirePermissions("finance.approve")
  rejectBudget(
    @Param("id") id: string,
    @Body() body: RejectBudgetDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.financeService.rejectBudget(
      id,
      user.tenantId,
      user.sub,
      body.reason,
    );
  }

  @Get("budgets/:id/summary")
  @RequirePermissions("finance.view")
  getBudgetSummary(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.financeService.getBudgetSummary(id, user.tenantId);
  }

  // ── Expenses ───────────────────────────────────────────────────────────────

  @Get("expenses")
  @RequirePermissions("finance.view")
  findExpenses(
    @Query() query: QueryExpensesDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.financeService.findExpenses(user.tenantId, query);
  }

  @Post("expenses")
  @RequirePermissions("finance.create")
  createExpense(
    @Body() dto: CreateExpenseDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.financeService.createExpense(dto, user.tenantId, user.sub);
  }
}
