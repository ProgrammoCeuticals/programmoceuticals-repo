import {
  IsString, IsOptional, IsEnum, IsDateString, IsArray, IsUUID, MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InterviewStageType, InterviewEventStatus, InterviewOutcome } from '@pharmintern/shared-types';

export class CreateInterviewStageDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ enum: InterviewStageType })
  @IsEnum(InterviewStageType)
  stageType!: InterviewStageType;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  stageOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class ScheduleInterviewEventDto {
  @ApiProperty({ description: 'Interview stage ID' })
  @IsUUID()
  stageId!: string;

  @ApiProperty({ description: 'ISO8601 datetime' })
  @IsDateString()
  scheduledAt!: string;

  @ApiPropertyOptional({ default: 'Africa/Lagos' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'In-person' })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  locationOrLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  candidateInstructions?: string;
}

export class UpdateInterviewEventDto {
  @ApiPropertyOptional({ enum: InterviewEventStatus })
  @IsOptional()
  @IsEnum(InterviewEventStatus)
  status?: InterviewEventStatus;

  @ApiPropertyOptional({ description: 'ISO8601 datetime — for reschedule' })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  locationOrLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  candidateInstructions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rescheduleReason?: string;
}

export class RecordInterviewOutcomeDto {
  @ApiProperty({ enum: ['PASSED', 'FAILED', 'DEFERRED'] })
  @IsEnum(['PASSED', 'FAILED', 'DEFERRED'])
  outcome!: InterviewOutcome;

  @ApiPropertyOptional({ description: 'Internal notes — never shown to applicant' })
  @IsOptional()
  @IsString()
  outcomeNotes?: string;
}
