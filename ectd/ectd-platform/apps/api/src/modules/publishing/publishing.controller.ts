import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { PublishingDomainService } from "./publishing-domain.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard, RequirePermission } from "../../common/guards/permission.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtPayload } from "../auth/auth.service";

@ApiTags("Publishing")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller()
export class PublishingController {
  constructor(private readonly service: PublishingDomainService) {}

  @Get("submission-units/:id/packages")
  @ApiOperation({ summary: "List submission packages for a submission unit" })
  getPackagesForUnit(@Param("id") id: string) {
    return this.service.getPackagesForUnit(id);
  }

  @Get("submission-packages/:id")
  @ApiOperation({ summary: "Get submission package by ID" })
  getPackage(@Param("id") id: string) {
    return this.service.getPackage(id);
  }

  @Get("submission-packages/:id/download")
  @ApiOperation({ summary: "Get controlled download reference for package" })
  getDownload(@Param("id") id: string) {
    return this.service.getDownloadRef(id);
  }

  @Get("submission-packages/:id/manifest")
  @ApiOperation({ summary: "Get package manifest" })
  getManifest(@Param("id") id: string) {
    return this.service.getManifest(id);
  }

  @Post("submission-packages/:id/invalidate")
  @HttpCode(HttpStatus.OK)
  @RequirePermission("PUBLISH")
  @ApiOperation({ summary: "[Command] Invalidate a submission package" })
  invalidate(
    @Param("id") id: string,
    @Body() body: { reason: string },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.invalidate(id, user.orgId ?? "", body.reason, user.sub);
  }
}
