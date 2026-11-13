import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "../../common/decorators/public.decorator";

@ApiTags("health")
@Controller("health")
export class HealthController {
  /**
   * Public health check — no authentication required.
   * Returns API uptime and current timestamp.
   */
  @Get()
  @Public()
  @ApiOperation({ summary: "API health check" })
  check(): { status: string; uptime: number; timestamp: string } {
    return {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
