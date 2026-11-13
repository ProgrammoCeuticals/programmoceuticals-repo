import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateDocumentDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() folderId?: string;
  @IsOptional() @IsString() fileKey?: string;
  @IsOptional() @IsString() fileName?: string;
  @IsOptional() @IsString() mimeType?: string;
  @IsOptional() @IsInt() @Min(0) fileSizeBytes?: number;
  @IsOptional() @IsString() checksum?: string;
}
