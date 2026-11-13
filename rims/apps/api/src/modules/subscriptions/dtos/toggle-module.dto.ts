import { IsNotEmpty, IsString } from 'class-validator';

export class ToggleModuleDto {
  @IsString()
  @IsNotEmpty()
  moduleCode!: string;
}
