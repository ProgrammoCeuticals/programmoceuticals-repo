import {
  Controller, Get, Post, Patch, Param, Body, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto, UpdateVacancyDto, VacancySearchQueryDto } from './dto/vacancy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '@pharmintern/shared-types';

@ApiTags('vacancies')
@Controller({ path: 'vacancies', version: '1' })
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  // ── Public ────────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Search published vacancies (public)' })
  search(@Query() query: VacancySearchQueryDto) {
    return this.vacanciesService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'View vacancy details (public)' })
  findOne(@Param('id') id: string) {
    return this.vacanciesService.getPublicById(id);
  }

  @Get(':id/counts')
  @ApiOperation({ summary: 'Get authoritative vacancy position counts (public)' })
  getCounts(@Param('id') id: string) {
    return this.vacanciesService.getCounts(id);
  }

  // ── Employer ──────────────────────────────────────────────────────────────

  @Post('organisations/:orgId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create vacancy draft' })
  create(
    @Param('orgId') orgId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateVacancyDto,
  ) {
    return this.vacanciesService.create(orgId, user.sub, dto);
  }

  @Patch(':id/organisations/:orgId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vacancy' })
  update(
    @Param('id') id: string,
    @Param('orgId') orgId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateVacancyDto,
  ) {
    return this.vacanciesService.update(id, orgId, user.sub, dto);
  }

  @Post(':id/organisations/:orgId/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish vacancy (org must be APPROVED)' })
  publish(
    @Param('id') id: string,
    @Param('orgId') orgId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.vacanciesService.publish(id, orgId, user.sub);
  }

  @Post(':id/organisations/:orgId/pause')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pause vacancy' })
  pause(
    @Param('id') id: string,
    @Param('orgId') orgId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.vacanciesService.pause(id, orgId, user.sub);
  }

  @Post(':id/organisations/:orgId/close')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Close vacancy' })
  close(
    @Param('id') id: string,
    @Param('orgId') orgId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.vacanciesService.close(id, orgId, user.sub);
  }

  @Post(':id/organisations/:orgId/archive')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive vacancy' })
  archive(
    @Param('id') id: string,
    @Param('orgId') orgId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.vacanciesService.archive(id, orgId, user.sub);
  }
}
