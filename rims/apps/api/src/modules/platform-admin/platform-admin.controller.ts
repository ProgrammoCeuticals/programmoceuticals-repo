import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "@rims/shared-types";
import { PlatformAdminGuard } from "./guards/platform-admin.guard";
import { PlatformAdminService } from "./platform-admin.service";

@Controller("platform")
@UseGuards(JwtAuthGuard, PlatformAdminGuard)
export class PlatformAdminController {
  constructor(private readonly platformAdminService: PlatformAdminService) {}

  @Get("tenants")
  listTenants(
    @Query("status") status: string | undefined,
    @Query("search") search: string | undefined,
    @Query("page") page: string | undefined,
    @Query("pageSize") pageSize: string | undefined,
  ) : Promise<unknown> {
    return this.platformAdminService.listTenants({
      ...(status !== undefined ? { status } : {}),
      ...(search !== undefined ? { search } : {}),
      ...(page !== undefined ? { page: parseInt(page, 10) } : {}),
      ...(pageSize !== undefined ? { pageSize: parseInt(pageSize, 10) } : {}),
    });
  }

  @Get("tenants/:id")
  getTenantOverview(@Param("id") id: string) : Promise<unknown> {
    return this.platformAdminService.getTenantOverview(id);
  }

  @Post("tenants/:id/suspend")
  suspendTenant(
    @Param("id") id: string,
    @Body() body: { reason: string },
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.platformAdminService.suspendTenant(id, body.reason, user.sub);
  }

  @Post("tenants/:id/activate")
  activateTenant(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.platformAdminService.activateTenant(id, user.sub);
  }

  @Get("system/health")
  getSystemHealth() : Promise<unknown> {
    return this.platformAdminService.getSystemHealth();
  }
}
