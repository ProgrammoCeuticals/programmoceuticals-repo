import { IsString, IsOptional, IsUUID, MaxLength, IsIn } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

const ALLOWED_LANGUAGES = ["en", "fr", "de", "es", "ja", "zh"] as const;

export class CreateDocumentDto {
  @ApiProperty({
    description: "Document title",
    example: "Drug Product Description",
  })
  @IsString()
  @MaxLength(1000)
  title!: string;

  @ApiProperty({
    description: "Original filename",
    example: "drug-product-description.pdf",
  })
  @IsString()
  @MaxLength(500)
  filename!: string;

  @ApiProperty({ description: "MIME type", example: "application/pdf" })
  @IsString()
  @MaxLength(200)
  mimeType!: string;

  @ApiPropertyOptional({ description: "Language code", example: "en" })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: string;
}

export class CreateDocumentVersionDto {
  @ApiProperty({ description: "Original filename for this version" })
  @IsString()
  @MaxLength(500)
  filename!: string;

  @ApiProperty({ description: "MIME type of this version" })
  @IsString()
  @MaxLength(200)
  mimeType!: string;

  @ApiPropertyOptional({ description: "Language for this version" })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: string;

  // fileSize, checksum, storageKey are computed by the upload pipeline,
  // not accepted from the client — they are set server-side after storage.
}

export class ReuseDocumentDto {
  @ApiProperty({ description: "SubmissionUnit.id to reuse the document in" })
  @IsUUID()
  targetSubmissionUnitId!: string;

  @ApiProperty({ description: "ContextDefinition.id for the target context" })
  @IsUUID()
  targetContextDefinitionId!: string;

  @ApiPropertyOptional({ description: "Reason for reuse (audit trail)" })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string;
}
