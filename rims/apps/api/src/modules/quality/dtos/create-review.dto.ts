import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateQualityReviewDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsString() @IsNotEmpty() reviewType!: string;
  @IsOptional() @IsDateString() scheduledDate?: string;
  @IsOptional() @IsString() departmentId?: string;
  @IsOptional() @IsString() leadReviewerId?: string;
  @IsOptional() @IsString() summary?: string;
}
