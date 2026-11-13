import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFindingDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() severity?: string;
}
