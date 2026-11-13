import { IsString, IsOptional, MaxLength, IsUUID } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateApplicationDto {
  @ApiProperty({ description: "Product ID this application is for" })
  @IsUUID()
  productId!: string;

  @ApiProperty({ description: "RegulatoryAuthority ID (e.g. FDA)" })
  @IsUUID()
  authorityId!: string;

  @ApiProperty({ description: "RegulatoryRegion ID (e.g. US)" })
  @IsUUID()
  regionId!: string;

  @ApiProperty({ description: "EctdStandard ID to use for this application" })
  @IsUUID()
  ectdStandardId!: string;

  @ApiProperty({ description: "RegionalSpecification ID for Module 1" })
  @IsUUID()
  regionalSpecificationId!: string;

  @ApiPropertyOptional({
    example: "NDA123456",
    description: "Regulator-assigned application number",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  applicationNumber?: string;

  @ApiPropertyOptional({
    example: "NDA",
    description:
      "Application type (e.g. NDA, ANDA, BLA, MAA). " +
      "REGULATORY_GAP: valid types are authority-specific — loaded from regional spec in Phase 2.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  applicationType?: string;
}

export class UpdateApplicationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  applicationNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  applicationType?: string;
}
