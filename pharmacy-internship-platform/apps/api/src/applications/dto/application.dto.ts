import {
  IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApplicationAnswerDto {
  @ApiProperty({ description: 'Question ID from vacancy questions' })
  @IsUUID()
  questionId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  answerText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  answerBoolean?: boolean;
}

export class SubmitApplicationDto {
  @ApiProperty({ description: 'Vacancy ID to apply to' })
  @IsUUID()
  vacancyId!: string;

  @ApiPropertyOptional({ default: false, description: 'Save as draft instead of submitting' })
  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;

  @ApiPropertyOptional({ type: [ApplicationAnswerDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicationAnswerDto)
  answers?: ApplicationAnswerDto[];

  @ApiPropertyOptional({ description: 'Client idempotency key (UUID)' })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

export class UpdateApplicationStatusDto {
  @ApiProperty({
    enum: [
      'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEWING',
      'WAITLISTED', 'REJECTED',
    ],
  })
  @IsString()
  status!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}

export class AddApplicationNoteDto {
  @ApiProperty()
  @IsString()
  note!: string;
}
