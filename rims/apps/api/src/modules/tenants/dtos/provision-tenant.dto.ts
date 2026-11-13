import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
} from "class-validator";

export class ProvisionTenantDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  slug!: string;

  @IsEmail()
  adminEmail!: string;

  @IsString()
  @IsOptional()
  institutionName?: string;
}
