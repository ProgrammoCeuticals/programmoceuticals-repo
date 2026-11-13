import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUrl,
  MaxLength,
  IsDateString,
  IsArray,
} from 'class-validator';

// ─── News ────────────────────────────────────────────────────────────────────

export class CreateNewsDto {
  @IsString()
  @MaxLength(500)
  title!: string;

  @IsString()
  @MaxLength(300)
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  featuredImageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(300)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;
}

export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  featuredImageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(300)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;
}

// ─── Events ──────────────────────────────────────────────────────────────────

export class CreateEventDto {
  @IsString()
  @MaxLength(500)
  title!: string;

  @IsString()
  @MaxLength(300)
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDatetime!: string;

  @IsOptional()
  @IsDateString()
  endDatetime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  timezone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  venue?: string;

  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  registrationUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  featuredImageUrl?: string;
}

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDatetime?: string;

  @IsOptional()
  @IsDateString()
  endDatetime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  timezone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  venue?: string;

  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  registrationUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  featuredImageUrl?: string;
}

// ─── Opportunities ───────────────────────────────────────────────────────────

export class CreateOpportunityDto {
  @IsString()
  opportunityType!: string;

  @IsString()
  @MaxLength(500)
  title!: string;

  @IsString()
  @MaxLength(300)
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  department?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  applicationUrl?: string;

  @IsOptional()
  @IsDateString()
  openingDate?: string;

  @IsOptional()
  @IsDateString()
  closingDate?: string;
}

export class UpdateOpportunityDto {
  @IsOptional()
  @IsString()
  opportunityType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  department?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  applicationUrl?: string;

  @IsOptional()
  @IsDateString()
  closingDate?: string;
}

// ─── Team Profiles ───────────────────────────────────────────────────────────

export class CreateTeamProfileDto {
  @IsString()
  @MaxLength(300)
  displayName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  role?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  department?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  photoUrl?: string;

  @IsOptional()
  @IsString()
  qualifications?: string;

  @IsOptional()
  professionalLinksJson?: Record<string, string>;

  @IsOptional()
  sortOrder?: number;
}

export class UpdateTeamProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(300)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  role?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  department?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  photoUrl?: string;

  @IsOptional()
  @IsString()
  qualifications?: string;

  @IsOptional()
  professionalLinksJson?: Record<string, string>;

  @IsOptional()
  sortOrder?: number;
}

// ─── Partners ────────────────────────────────────────────────────────────────

export class CreatePartnerDto {
  @IsString()
  @MaxLength(300)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  partnershipType?: string;

  @IsOptional()
  sortOrder?: number;
}

export class UpdatePartnerDto {
  @IsOptional()
  @IsString()
  @MaxLength(300)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  partnershipType?: string;

  @IsOptional()
  sortOrder?: number;
}

// ─── Resources ───────────────────────────────────────────────────────────────

export class CreateResourceDto {
  @IsString()
  @MaxLength(500)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  fileKey?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  fileName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  mimeType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  publicDownload?: boolean;
}

export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  publicDownload?: boolean;
}

// ─── FAQs ────────────────────────────────────────────────────────────────────

export class CreateFaqDto {
  @IsString()
  question!: string;

  @IsString()
  answer!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  sortOrder?: number;
}

export class UpdateFaqDto {
  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  answer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  sortOrder?: number;
}
