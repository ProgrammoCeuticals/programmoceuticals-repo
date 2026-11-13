import { IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryTeamsDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  departmentId?: string;
}
