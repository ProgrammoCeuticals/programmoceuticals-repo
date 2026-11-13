import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '@rims/shared-types';
import { PublicationsService } from './publications.service';
import { QueryManuscriptsDto } from './dtos/query-manuscripts.dto';
import { CreateManuscriptDto } from './dtos/create-manuscript.dto';
import { UpdateManuscriptDto } from './dtos/update-manuscript.dto';
import { AddAuthorDto } from './dtos/add-author.dto';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';

@Controller('publications')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Get()
  @RequirePermissions('publications.view')
  findAll(
    @Query() query: QueryManuscriptsDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.publicationsService.findAll(user.tenantId, query);
  }

  @Post()
  @RequirePermissions('publications.create')
  create(
    @Body() dto: CreateManuscriptDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.publicationsService.create(dto, user.tenantId, user.sub);
  }

  @Get(':id')
  @RequirePermissions('publications.view')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.publicationsService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  @RequirePermissions('publications.update')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateManuscriptDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.publicationsService.update(id, dto, user.tenantId, user.sub);
  }

  @Post(':id/authors')
  @RequirePermissions('publications.update')
  addAuthor(
    @Param('id') id: string,
    @Body() dto: AddAuthorDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.publicationsService.addAuthor(id, dto, user.tenantId);
  }

  @Delete(':id/authors/:employeeId')
  @RequirePermissions('publications.update')
  removeAuthor(
    @Param('id') id: string,
    @Param('employeeId') employeeId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.publicationsService.removeAuthor(id, employeeId, user.tenantId);
  }

  @Post(':id/reviews')
  @RequirePermissions('publications.update')
  addReview(
    @Param('id') id: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.publicationsService.addReview(id, dto, user.tenantId);
  }

  @Patch(':id/reviews/:reviewId')
  @RequirePermissions('publications.update')
  updateReview(
    @Param('id') id: string,
    @Param('reviewId') reviewId: string,
    @Body() dto: UpdateReviewDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.publicationsService.updateReview(
      id,
      reviewId,
      dto,
      user.tenantId,
    );
  }
}
