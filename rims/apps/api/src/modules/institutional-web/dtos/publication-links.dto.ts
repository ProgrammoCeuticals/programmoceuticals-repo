import { IsString, IsOptional } from 'class-validator';

export class LinkManuscriptDto {
  @IsString()
  manuscriptId!: string;

  @IsOptional()
  @IsString()
  publicSummaryOverride?: string;
}
