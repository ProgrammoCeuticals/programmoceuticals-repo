import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class AddVersionDto {
  @IsString() @IsNotEmpty() fileKey!: string;
  @IsString() @IsNotEmpty() fileName!: string;
  @IsOptional() @IsInt() @Min(0) fileSizeBytes?: number;
  @IsOptional() @IsString() checksum?: string;
  @IsOptional() @IsString() notes?: string;
}
