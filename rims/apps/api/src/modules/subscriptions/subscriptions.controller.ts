import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { JwtPayload } from "@rims/shared-types";
import { SubscriptionsService } from "./subscriptions.service";
import { ProvisionTenantDto } from "./dtos/provision-tenant.dto";
import { ToggleModuleDto } from "./dtos/toggle-module.dto";

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get("subscriptions/plans")
  @Public()
  getPlans() : Promise<unknown> {
    return this.subscriptionsService.getPlans();
  }

  @Get("subscriptions/current")
  getCurrentSubscription(@CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.subscriptionsService.getCurrentSubscription(user.tenantId);
  }

  @Get("subscriptions/entitlements")
  getEntitlements(@CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.subscriptionsService.getEntitlements(user.tenantId);
  }

  @Post("subscriptions/modules/enable")
  @RequirePermissions("institution.settings.manage")
  enableModule(@Body() dto: ToggleModuleDto, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.subscriptionsService.enableModule(
      user.tenantId,
      dto.moduleCode,
      user.sub,
    );
  }

  @Post("subscriptions/modules/disable")
  @RequirePermissions("institution.settings.manage")
  disableModule(@Body() dto: ToggleModuleDto, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.subscriptionsService.disableModule(
      user.tenantId,
      dto.moduleCode,
      user.sub,
    );
  }

  @Post("subscriptions/plans/seed")
  @RequirePermissions("institution.settings.manage")
  @HttpCode(HttpStatus.CREATED)
  seedPlans() : Promise<unknown> {
    return this.subscriptionsService.seedPlans();
  }

  @Post("platform/tenants/provision")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async provisionTrial(@Body() dto: ProvisionTenantDto) : Promise<unknown> {
    if (process.env.NODE_ENV === "production") {
      throw new NotFoundException("Not found");
    }
    return this.subscriptionsService.provisionTrial(dto);
  }
}
