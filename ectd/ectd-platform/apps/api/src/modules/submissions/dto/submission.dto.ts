import { IsString, IsOptional, MaxLength, IsUUID } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSubmissionDto {
  @ApiPropertyOptional({
    example: "ORIGINAL",
    description:
      "Submission type. REGULATORY_GAP: valid types are authority-specific. " +
      "Will be validated against regional spec controlled vocabulary in Phase 8.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  submissionType?: string;

  @ApiPropertyOptional({
    description: "Human-readable description of this submission",
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class UpdateSubmissionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  submissionType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
