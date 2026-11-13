import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateDomainDto {
  @IsString()
  @MaxLength(253)
  hostname!: string;
}

export class UpdateDomainDto {
  @IsOptional()
  @IsString()
  @MaxLength(253)
  hostname?: string;
}
