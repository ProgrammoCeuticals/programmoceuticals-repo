import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateQualityReviewDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() reviewType?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsDateString() scheduledDate?: string;
  @IsOptional() @IsString() departmentId?: string;
  @IsOptional() @IsString() leadReviewerId?: string;
  @IsOptional() @IsString() summary?: string;
}
