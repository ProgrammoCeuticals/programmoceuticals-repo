import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';

export class UpdateWebsiteSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  defaultLocale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  timezone?: string;
}

export class UpdateBrandingDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoDarkUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  faviconUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  tagline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  shortDescription?: string;

  @IsOptional()
  @IsString()
  fullDescription?: string;

  @IsOptional()
  @IsString()
  mission?: string;

  @IsOptional()
  @IsString()
  vision?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  primaryColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  secondaryColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  accentColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  typographyPreset?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @IsOptional()
  socialLinksJson?: Record<string, string>;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  copyrightStatement?: string;
}

export class SelectThemeDto {
  @IsString()
  @MaxLength(100)
  themeKey!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  themeVersion?: string;

  @IsOptional()
  configJson?: Record<string, unknown>;
}
