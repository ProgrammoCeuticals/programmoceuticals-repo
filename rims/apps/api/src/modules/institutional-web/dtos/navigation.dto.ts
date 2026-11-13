import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class NavigationItemDto {
  @IsOptional()
  @IsString()
  parentId?: string;

  @IsString()
  @MaxLength(200)
  label!: string;

  @IsString()
  @MaxLength(20)
  linkType!: string;

  @IsOptional()
  @IsString()
  pageId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  externalUrl?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

export class ReplaceNavigationItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavigationItemDto)
  items!: NavigationItemDto[];
}
