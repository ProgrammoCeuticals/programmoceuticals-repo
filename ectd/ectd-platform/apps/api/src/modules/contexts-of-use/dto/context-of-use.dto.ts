import {
  IsString,
  IsOptional,
  IsInt,
  IsUUID,
  Min,
  MaxLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateContextOfUseDto {
  @ApiProperty({ description: "Document.id to assign to this context" })
  @IsUUID()
  documentId!: string;

  @ApiProperty({
    description:
      "ContextDefinition.id — must be from the CTD structure package " +
      "linked to the SubmissionUnit's standard.",
  })
  @IsUUID()
  contextDefinitionId!: string;

  @ApiPropertyOptional({
    description: "Priority number (region-specific ordering)",
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  priorityNumber?: number;
}

export class SuspendContextOfUseDto {
  @ApiProperty({
    description:
      "Reason for suspension — recorded in audit trail. " +
      "Suspension is irreversible under the ICH lifecycle model — spec §15.",
  })
  @IsString()
  @MaxLength(2000)
  reason!: string;
}

export class ReplaceContextOfUseDto {
  @ApiProperty({
    description: "ID of the ContextOfUse that is replacing this one",
  })
  @IsUUID()
  replacingContextOfUseId!: string;

  @ApiPropertyOptional({ description: "Reason for replacement" })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string;
}
