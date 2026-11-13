import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

/**
 * Health endpoints — spec §45
 *
 * GET /health/live    — liveness probe
 * GET /health/ready   — readiness probe
 * GET /health         — overall health summary
 * GET /health/regulatory — regulatory package registry health
 */
@ApiTags("Health")
@Controller({ path: "health", version: "1" })
export class HealthController {
  @Get("live")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Liveness probe" })
  live(): { status: string } {
    return { status: "ok" };
  }

  @Get("ready")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Readiness probe" })
  ready(): { status: string } {
    // TODO: check DB connectivity and Redis when PrismaModule is wired
    return { status: "ok" };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Overall health summary" })
  health(): { status: string; timestamp: string } {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  @Get("regulatory")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Regulatory package registry health" })
  regulatory(): { status: string } {
    // TODO: check that at least one ACTIVE regulatory package is registered
    return { status: "ok" };
  }
}
