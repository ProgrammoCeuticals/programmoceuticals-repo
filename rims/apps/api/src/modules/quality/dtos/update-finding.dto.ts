import { IsString, IsOptional } from 'class-validator';

export class UpdateFindingDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() severity?: string;
  @IsOptional() @IsString() status?: string;
}
