import { IsString, IsNotEmpty } from 'class-validator';

export class ReturnKpiResultDto {
  @IsString()
  @IsNotEmpty()
  reviewNotes!: string;
}
