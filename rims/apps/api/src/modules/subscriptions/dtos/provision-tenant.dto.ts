import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class ProvisionTenantDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'tenantSlug must contain only lowercase letters, numbers, and hyphens',
  })
  @MaxLength(63)
  tenantSlug!: string;

  @IsString()
  @IsNotEmpty()
  tenantName!: string;

  @IsEmail()
  adminEmail!: string;

  @IsString()
  @IsNotEmpty()
  adminFirstName!: string;

  @IsString()
  @IsNotEmpty()
  adminLastName!: string;

  @IsString()
  @IsNotEmpty()
  institutionName!: string;
}
