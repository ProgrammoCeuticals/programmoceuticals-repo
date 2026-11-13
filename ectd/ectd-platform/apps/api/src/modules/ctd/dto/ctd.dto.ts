import {
  IsString,
  IsOptional,
  IsInt,
  IsUUID,
  Min,
  Max,
  MaxLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterCtdPackageDto {
  @ApiProperty({ example: "ICH eCTD v4.0 CTD Structure" })
  @IsString()
  @MaxLength(500)
  name!: string;

  @ApiProperty({ example: "1.0" })
  @IsString()
  @MaxLength(50)
  version!: string;

  @ApiPropertyOptional({ description: "EctdStandard.id this package is for" })
  @IsOptional()
  @IsUUID()
  standardId?: string;

  @ApiPropertyOptional({
    description: "RegionalSpecification.id if region-specific",
  })
  @IsOptional()
  @IsUUID()
  regionalSpecificationId?: string;
}

export class CreateCtdSectionDto {
  @ApiProperty({ description: "CtdModule.id this section belongs to" })
  @IsUUID()
  moduleId!: string;

  @ApiPropertyOptional({ description: "Parent section ID for nested sections" })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({
    example: "3.2.P.1",
    description:
      "Section code — must come from authoritative CTD structure package. " +
      "REGULATORY_GAP: do not invent codes.",
  })
  @IsString()
  @MaxLength(100)
  sectionCode!: string;

  @ApiProperty({ example: "Description of Drug Product" })
  @IsString()
  @MaxLength(500)
  title!: string;

  @ApiProperty({
    example: 3,
    description: "Nesting level (1 = module, 2 = top-level section, etc.)",
  })
  @IsInt()
  @Min(1)
  @Max(10)
  level!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  displayOrder!: number;
}

export class CreateContextDefinitionDto {
  @ApiProperty({ description: "CtdSection.id" })
  @IsUUID()
  ctdSectionId!: string;

  @ApiProperty({
    description:
      "Context code — must come from authoritative ICH eCTD v4.0 controlled vocabulary. " +
      "REGULATORY_GAP: do not invent codes.",
  })
  @IsString()
  @MaxLength(200)
  code!: string;

  @ApiProperty({
    description: "Code system OID or identifier",
    example: "2.16.840.1.113883.3.26.1.1",
  })
  @IsString()
  @MaxLength(200)
  codeSystem!: string;

  @ApiProperty({ example: "Drug Product Description" })
  @IsString()
  @MaxLength(500)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
