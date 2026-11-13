import {
  IsString,
  IsOptional,
  IsIn,
  IsUUID,
  MaxLength,
  IsArray,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

const DATA_TYPES = ["STRING", "CODE", "DATE", "INTEGER", "BOOLEAN"] as const;

export class CreateKeywordDefinitionDto {
  @ApiProperty({
    description:
      "Keyword code — must be unique within the application. " +
      "REGULATORY_GAP: keyword codes and semantics should align with " +
      "the applicable eCTD v4.0 keyword definitions.",
  })
  @IsString()
  @MaxLength(100)
  code!: string;

  @ApiProperty({ example: "Drug Substance Name" })
  @IsString()
  @MaxLength(500)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ enum: DATA_TYPES, example: "STRING" })
  @IsIn(DATA_TYPES)
  dataType!: string;

  @ApiPropertyOptional({
    description: "Allowed values for CODE type keywords",
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedValues?: string[];
}

export class AssignKeywordDto {
  @ApiProperty({ description: "KeywordDefinition.id" })
  @IsUUID()
  keywordDefinitionId!: string;

  @ApiProperty({ description: "Keyword value" })
  @IsString()
  @MaxLength(2000)
  value!: string;
}
