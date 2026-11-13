import { IsString, IsOptional, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProductDto {
  @ApiProperty({
    description: "Full product name",
    example: "Amoxicillin Capsules",
  })
  @IsString()
  @MaxLength(500)
  productName!: string;

  @ApiPropertyOptional({ example: "Amoxicillin" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  genericName?: string;

  @ApiPropertyOptional({ example: "Amoxil" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  brandName?: string;

  @ApiPropertyOptional({ example: "Amoxicillin trihydrate" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  activeIngredient?: string;

  @ApiPropertyOptional({ example: "Capsule" })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  dosageForm?: string;

  @ApiPropertyOptional({ example: "500 mg" })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  strength?: string;

  @ApiPropertyOptional({ example: "Oral" })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  routeOfAdministration?: string;

  @ApiPropertyOptional({ description: "Internal product code" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  productCode?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  productName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  genericName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  brandName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  dosageForm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  strength?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  routeOfAdministration?: string;
}
