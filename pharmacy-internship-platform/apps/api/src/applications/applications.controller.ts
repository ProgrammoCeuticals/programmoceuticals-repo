import {
  Controller, Get, Post, Param, Body, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { SubmitApplicationDto, UpdateApplicationStatusDto, AddApplicationNoteDto } from './dto/application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '@pharmintern/shared-types';

@ApiTags('applications')
@Controller({ version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // ── Applicant routes ──────────────────────────────────────────────────────

  @Post('applications')
  @ApiOperation({ summary: 'Submit an application (or save as draft)' })
  submit(@CurrentUser() user: JwtPayload, @Body() dto: SubmitApplicationDto) {
    return this.applicationsService.submit(user.sub, dto);
  }

  @Get('applications/mine')
  @ApiOperation({ summary: "List own applications" })
  listMine(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.applicationsService.listMine(user.sub, page, pageSize);
  }

  @Get('applications/:id')
  @ApiOperation({ summary: 'Get own application detail' })
  getForApplicant(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.applicationsService.getForApplicant(id, user.sub);
  }

  @Post('applications/:id/withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Withdraw own application' })
  withdraw(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.applicationsService.withdraw(id, user.sub);
  }

  // ── Employer routes ───────────────────────────────────────────────────────

  @Get('organisations/:orgId/vacancies/:vacancyId/applications')
  @ApiOperation({ summary: 'List applications for a vacancy (employer)' })
  listForVacancy(
    @Param('orgId') orgId: string,
    @Param('vacancyId') vacancyId: string,
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.applicationsService.listForVacancy(vacancyId, orgId, user.sub, { status, page, pageSize });
  }

  @Get('organisations/:orgId/applications/:id')
  @ApiOperation({ summary: 'Get application detail (employer view — includes credential checks)' })
  getForEmployer(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.getForEmployer(id, orgId, user.sub);
  }

  @Post('organisations/:orgId/applications/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update application status (shortlist, reject, etc.)' })
  updateStatus(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, orgId, user.sub, dto);
  }

  @Post('organisations/:orgId/applications/:id/notes')
  @ApiOperation({ summary: 'Add internal note to application (never visible to applicant)' })
  addNote(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: AddApplicationNoteDto,
  ) {
    return this.applicationsService.addNote(id, orgId, user.sub, dto.note);
  }

  @Get('organisations/:orgId/applications/:id/notes')
  @ApiOperation({ summary: 'Get internal notes for application (employer only)' })
  getNotes(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.getNotes(id, orgId, user.sub);
  }
}
