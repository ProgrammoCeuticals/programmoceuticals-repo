import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "@rims/shared-types";
import { ReportsService } from "./reports.service";

@Controller("reports")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("executive-overview")
  @RequirePermissions("reports.view")
  executiveOverview(@CurrentUser() user: JwtPayload) {
    return this.reportsService.executiveOverview(user.tenantId);
  }

  @Get("performance")
  @RequirePermissions("performance.reports.view")
  performanceSummary(
    @Query("cycleId") cycleId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reportsService.performanceSummary(user.tenantId, cycleId);
  }

  @Get("research")
  @RequirePermissions("reports.view")
  researchPortfolio(
    @Query()
    query: {
      departmentId?: string;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reportsService.researchPortfolio(user.tenantId, query);
  }

  @Get("workforce")
  @RequirePermissions("reports.view")
  workforceReport(
    @Query() query: { departmentId?: string },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reportsService.workforceReport(user.tenantId, query);
  }

  @Get("publications")
  @RequirePermissions("publications.view")
  publicationsSummary(@CurrentUser() user: JwtPayload) {
    return this.reportsService.publicationsSummary(user.tenantId);
  }
}
