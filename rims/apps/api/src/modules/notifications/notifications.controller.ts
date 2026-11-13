import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "@rims/shared-types";
import { NotificationsService } from "./notifications.service";
import { UpdatePreferenceDto } from "./dtos/update-preference.dto";

@Controller("notifications")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // NOTE: Literal routes ('unread-count', 'read-all', 'preferences') are
  // declared before /:id routes to prevent NestJS treating the literal
  // segment as a param value.

  @Get("unread-count")
  getUnreadCount(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.getUnreadCount(user.sub, user.tenantId);
  }

  @Post("read-all")
  markAllRead(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.markAllRead(user.sub, user.tenantId);
  }

  @Get("preferences")
  getPreferences(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.getPreferences(user.sub, user.tenantId);
  }

  @Patch("preferences")
  updatePreference(
    @Body() dto: UpdatePreferenceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.notificationsService.updatePreference(
      user.sub,
      user.tenantId,
      dto.eventType,
      dto.inAppEnabled,
      dto.emailEnabled,
    );
  }

  @Get()
  findAll(
    @Query("status") status: string | undefined,
    @Query("page") page: string | undefined,
    @Query("pageSize") pageSize: string | undefined,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.notificationsService.findForUser(user.sub, user.tenantId, {
      ...(status !== undefined ? { status } : {}),
      ...(page !== undefined ? { page: parseInt(page, 10) } : {}),
      ...(pageSize !== undefined ? { pageSize: parseInt(pageSize, 10) } : {}),
    });
  }

  @Post(":id/read")
  markRead(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.notificationsService.markRead(id, user.sub, user.tenantId);
  }

  @Post(":id/dismiss")
  dismiss(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.notificationsService.dismiss(id, user.sub, user.tenantId);
  }
}
