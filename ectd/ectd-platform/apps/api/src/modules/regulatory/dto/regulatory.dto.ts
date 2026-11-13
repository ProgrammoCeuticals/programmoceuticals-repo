import {
  IsString,
  IsOptional,
  IsIn,
  IsDateString,
  IsUrl,
  Length,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { RegulatoryPackageType } from "@ectd/standards";

const PACKAGE_TYPES = Object.values(RegulatoryPackageType) as string[];

export class ImportPackageDto {
  @ApiProperty({ description: "SHA-256 checksum (hex) of the archive" })
  @IsString()
  @Length(64, 64)
  expectedChecksum!: string;

  @ApiProperty({
    description: "Logical storage key where the archive was pre-uploaded",
  })
  @IsString()
  storageKey!: string;

  @ApiProperty({ description: "Original source filename" })
  @IsString()
  sourceFilename!: string;

  @ApiProperty({ enum: PACKAGE_TYPES, description: "Regulatory package type" })
  @IsIn(PACKAGE_TYPES)
  packageType!: string;

  @ApiProperty({
    description: 'Package name (e.g. "ICH eCTD v4.0 Implementation Guide")',
  })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Package version (e.g. "1.7")' })
  @IsString()
  version!: string;

  @ApiPropertyOptional({ description: "Source URI (e.g. ICH website URL)" })
  @IsOptional()
  @IsString()
  sourceUri?: string;

  @ApiPropertyOptional({ description: 'Authority code (e.g. "ICH", "FDA")' })
  @IsOptional()
  @IsString()
  authority?: string;

  @ApiPropertyOptional({ description: 'Region code (e.g. "US", "ICH")' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ description: "ISO 8601 effective date" })
  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @ApiPropertyOptional({ description: "Idempotency key for retry safety" })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

export class ActivatePackageDto {
  @ApiPropertyOptional({ description: "Reason for activation (audit trail)" })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class SupersedePackageDto {
  @ApiProperty({ description: "ID of the package being superseded" })
  @IsString()
  supersededPackageId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

export class RegisterEctdStandardDto {
  @ApiProperty({ example: "ICH eCTD v4.0" })
  @IsString()
  name!: string;

  @ApiProperty({ example: "4.0" })
  @IsString()
  version!: string;

  @ApiPropertyOptional({ example: "1.7" })
  @IsOptional()
  @IsString()
  implementationGuideVersion?: string;

  @ApiPropertyOptional({ example: "1.0.3" })
  @IsOptional()
  @IsString()
  controlledVocabularyVersion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;
}

export class RegisterRegionalSpecDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  version!: string;

  @ApiProperty({ description: "RegulatoryRegion.id" })
  @IsString()
  regionId!: string;

  @ApiPropertyOptional({ description: "RegulatoryAuthority.id" })
  @IsOptional()
  @IsString()
  authorityId?: string;

  @ApiProperty({ description: "EctdStandard.id this spec is based on" })
  @IsString()
  ectdStandardId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;
}
