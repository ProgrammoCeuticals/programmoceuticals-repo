import { IsInt, IsUUID, IsOptional, IsString, Min, Max } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSubmissionUnitDto {
  @ApiProperty({
    description:
      "Sequence number for this submission unit. " +
      "Sequence number belongs to the Submission Unit — spec §7.9.",
    example: 1,
  })
  @IsInt()
  @Min(0)
  @Max(9999)
  sequenceNumber!: number;

  @ApiProperty({ description: "EctdStandard ID that governs this unit" })
  @IsUUID()
  ectdStandardId!: string;

  @ApiPropertyOptional({
    description: "RegionalSpecification ID for Module 1 compliance",
  })
  @IsOptional()
  @IsUUID()
  regionalSpecificationId?: string;

  @ApiPropertyOptional({ description: "Priority number (region-specific)" })
  @IsOptional()
  @IsInt()
  @Min(1)
  priorityNumber?: number;
}

export class ValidateSubmissionUnitDto {
  @ApiProperty({ description: "ValidationProfile ID to use for this run" })
  @IsUUID()
  validationProfileId!: string;
}

export class PublishSubmissionUnitDto {
  @ApiPropertyOptional({
    description:
      "Reason / notes for this publication (recorded in audit trail)",
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
