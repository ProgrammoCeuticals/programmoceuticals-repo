import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePreferenceDto {
  @IsString()
  @IsNotEmpty()
  eventType!: string;

  @IsBoolean()
  inAppEnabled!: boolean;

  @IsBoolean()
  emailEnabled!: boolean;
}
