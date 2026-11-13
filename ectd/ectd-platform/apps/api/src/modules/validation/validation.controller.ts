import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ValidationDomainService } from "./validation-domain.service";
import { RegulatoryService } from "../regulatory/regulatory.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Validation")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ValidationController {
  constructor(
    private readonly service: ValidationDomainService,
    private readonly regulatoryService: RegulatoryService,
  ) {}

  @Get("validation/profiles")
  @ApiOperation({ summary: "List active validation profiles" })
  getProfiles() {
    return this.regulatoryService.getValidationProfiles();
  }

  @Get("validation-runs/:id")
  @ApiOperation({ summary: "Get validation run by ID" })
  getRun(@Param("id") id: string) {
    return this.service.getValidationRun(id);
  }

  @Get("validation-runs/:id/results")
  @ApiOperation({ summary: "List results for a validation run" })
  getResults(@Param("id") id: string) {
    return this.service.getValidationResults(id);
  }

  @Get("validation-results/:id")
  @ApiOperation({ summary: "Get a single validation result" })
  getResult(@Param("id") id: string) {
    return this.service.getValidationResult(id);
  }
}
