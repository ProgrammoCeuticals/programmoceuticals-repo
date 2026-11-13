import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  MaxLength,
  Min,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum WebsitePageTypeDto {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  RESEARCH = 'RESEARCH',
  PUBLICATIONS = 'PUBLICATIONS',
  OPPORTUNITIES = 'OPPORTUNITIES',
  NEWS = 'NEWS',
  EVENTS = 'EVENTS',
  TEAM = 'TEAM',
  PARTNERS = 'PARTNERS',
  RESOURCES = 'RESOURCES',
  CONTACT = 'CONTACT',
  FAQ = 'FAQ',
  CUSTOM = 'CUSTOM',
}

export class CreatePageDto {
  @IsString()
  @MaxLength(300)
  title!: string;

  @IsString()
  @MaxLength(300)
  slug!: string;

  @IsOptional()
  @IsEnum(WebsitePageTypeDto)
  pageType?: WebsitePageTypeDto;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  publicTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  socialImageUrl?: string;
}

export class UpdatePageDto {
  @IsOptional()
  @IsString()
  @MaxLength(300)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  publicTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  socialImageUrl?: string;

  @IsOptional()
  @IsBoolean()
  robotsIndex?: boolean;

  @IsOptional()
  sections?: AddSectionDto[];
}

export class QueryPagesDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  pageType?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;
}

export class AddSectionDto {
  @IsString()
  @MaxLength(100)
  sectionType!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  configJson!: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

export class UpdateSectionDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sectionType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  configJson?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
