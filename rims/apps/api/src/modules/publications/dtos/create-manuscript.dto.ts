import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateManuscriptDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  abstract?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @IsOptional()
  @IsString()
  researchProjectId?: string;

  @IsOptional()
  @IsString()
  targetJournal?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  doi?: string;

  @IsOptional()
  @IsString()
  url?: string;
}
