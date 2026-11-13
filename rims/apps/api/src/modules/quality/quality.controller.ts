import {
  Controller,
  Get,
  Post,
  Patch,
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
import { QualityService } from "./quality.service";
import { QueryReviewsDto } from "./dtos/query-reviews.dto";
import { CreateQualityReviewDto } from "./dtos/create-review.dto";
import { UpdateQualityReviewDto } from "./dtos/update-review.dto";
import { CreateFindingDto } from "./dtos/create-finding.dto";
import { UpdateFindingDto } from "./dtos/update-finding.dto";
import { CreateCorrectiveActionDto } from "./dtos/create-corrective-action.dto";
import { UpdateCorrectiveActionDto } from "./dtos/update-corrective-action.dto";

@Controller("quality")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class QualityController {
  constructor(private readonly qualityService: QualityService) {}

  @Get("reviews")
  @RequirePermissions("quality.reviews.view")
  findReviews(
    @Query() query: QueryReviewsDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.qualityService.findReviews(user.tenantId, query);
  }

  @Post("reviews")
  @RequirePermissions("quality.reviews.manage")
  createReview(
    @Body() dto: CreateQualityReviewDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.qualityService.createReview(dto, user.tenantId);
  }

  @Get("reviews/:id")
  @RequirePermissions("quality.reviews.view")
  findReview(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.qualityService.findReview(id, user.tenantId);
  }

  @Patch("reviews/:id")
  @RequirePermissions("quality.reviews.manage")
  updateReview(
    @Param("id") id: string,
    @Body() dto: UpdateQualityReviewDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.qualityService.updateReview(id, dto, user.tenantId, user.sub);
  }

  @Post("reviews/:id/findings")
  @RequirePermissions("quality.findings.manage")
  createFinding(
    @Param("id") id: string,
    @Body() dto: CreateFindingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.qualityService.createFinding(id, dto, user.tenantId);
  }

  @Patch("findings/:id")
  @RequirePermissions("quality.findings.manage")
  updateFinding(
    @Param("id") id: string,
    @Body() dto: UpdateFindingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.qualityService.updateFinding(id, dto, user.tenantId, user.sub);
  }

  @Post("findings/:id/actions")
  @RequirePermissions("quality.findings.manage")
  createCorrectiveAction(
    @Param("id") id: string,
    @Body() dto: CreateCorrectiveActionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.qualityService.createCorrectiveAction(id, dto, user.tenantId);
  }

  @Patch("actions/:id")
  @RequirePermissions("quality.findings.manage")
  updateCorrectiveAction(
    @Param("id") id: string,
    @Body() dto: UpdateCorrectiveActionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.qualityService.updateCorrectiveAction(
      id,
      dto,
      user.tenantId,
      user.sub,
    );
  }
}
