import { IsOptional, IsString, IsDateString } from "class-validator";

export class UpdateResearchProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  researchArea?: string;

  @IsOptional()
  @IsString()
  methodology?: string;

  @IsOptional()
  @IsString()
  principalInvestigatorId?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  ethicsApprovalStatus?: string;

  @IsOptional()
  @IsString()
  ethicsReferenceNo?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
