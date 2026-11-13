import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { InterviewsService } from "./interviews.service";
import {
  CreateInterviewStageDto,
  ScheduleInterviewEventDto,
  UpdateInterviewEventDto,
  RecordInterviewOutcomeDto,
} from "./dto/interview.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtPayload } from "@pharmintern/shared-types";

@ApiTags("interviews")
@Controller({ version: "1" })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  // ── Stages ────────────────────────────────────────────────────────────────

  @Post("organisations/:orgId/vacancies/:vacancyId/stages")
  @ApiOperation({ summary: "Create an interview stage for a vacancy" })
  createStage(
    @Param("orgId") orgId: string,
    @Param("vacancyId") vacancyId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateInterviewStageDto,
  ) {
    return this.interviewsService.createStage(vacancyId, orgId, user.sub, dto);
  }

  @Get("vacancies/:vacancyId/stages")
  @ApiOperation({ summary: "List interview stages for a vacancy (public)" })
  listStages(@Param("vacancyId") vacancyId: string) {
    return this.interviewsService.listStages(vacancyId);
  }

  // ── Events ────────────────────────────────────────────────────────────────

  @Post("organisations/:orgId/applications/:applicationId/interviews")
  @ApiOperation({ summary: "Schedule an interview event for a candidate" })
  scheduleEvent(
    @Param("orgId") orgId: string,
    @Param("applicationId") applicationId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: ScheduleInterviewEventDto,
  ) {
    return this.interviewsService.scheduleEvent(
      applicationId,
      orgId,
      user.sub,
      dto,
    );
  }

  @Patch("organisations/:orgId/applications/:applicationId/interviews/:eventId")
  @ApiOperation({ summary: "Reschedule or cancel an interview event" })
  updateEvent(
    @Param("orgId") orgId: string,
    @Param("applicationId") applicationId: string,
    @Param("eventId") eventId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateInterviewEventDto,
  ) {
    return this.interviewsService.updateEvent(
      applicationId,
      eventId,
      orgId,
      user.sub,
      dto,
    );
  }

  @Post(
    "organisations/:orgId/applications/:applicationId/interviews/:eventId/outcome",
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Record interview outcome (internal — not shown to applicant)",
  })
  recordOutcome(
    @Param("orgId") orgId: string,
    @Param("applicationId") applicationId: string,
    @Param("eventId") eventId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: RecordInterviewOutcomeDto,
  ) {
    return this.interviewsService.recordOutcome(
      applicationId,
      eventId,
      orgId,
      user.sub,
      dto,
    );
  }

  // Applicant view of own interviews
  @Get("applications/:applicationId/interviews")
  @ApiOperation({
    summary:
      "List own application's interview events (applicant view — no internal notes)",
  })
  listForApplicant(
    @Param("applicationId") applicationId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.interviewsService.listForApplication(
      applicationId,
      user.sub,
      false,
    );
  }

  // Employer view
  @Get("organisations/:orgId/applications/:applicationId/interviews")
  @ApiOperation({
    summary:
      "List interview events for an application (employer view — includes notes)",
  })
  listForEmployer(
    @Param("orgId") orgId: string,
    @Param("applicationId") applicationId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.interviewsService.listForApplication(
      applicationId,
      user.sub,
      true,
      orgId,
    );
  }
}
