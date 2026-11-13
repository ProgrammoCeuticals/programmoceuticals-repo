import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMediaDto {
  @IsString()
  @MaxLength(300)
  fileName!: string;

  @IsString()
  @MaxLength(100)
  mimeType!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  fileSizeBytes?: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  altText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  credit?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdateMediaDto {
  @IsOptional()
  @IsString()
  @MaxLength(300)
  altText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  credit?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class QueryMediaDto {
  @IsOptional()
  @IsString()
  mimeType?: string;

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
