import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto, RefreshTokenDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { JwtPayload } from "./auth.service";

/**
 * Auth endpoints — spec §29 REST API.
 *
 * POST /auth/login
 * POST /auth/refresh
 * POST /auth/logout
 * GET  /auth/me
 */
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login with email and password" })
  @ApiResponse({
    status: 200,
    description: "Returns access and refresh tokens",
  })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const correlationId = req.headers["x-correlation-id"] as string | undefined;
    return this.authService.login(dto.email, dto.password, {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      correlationId,
    });
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Rotate refresh token and get new token pair" })
  async refresh(
    @Body() dto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Revoke all refresh tokens for current user" })
  async logout(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ): Promise<void> {
    const correlationId = req.headers["x-correlation-id"] as string | undefined;
    await this.authService.logout(user.sub, correlationId);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current authenticated user profile" })
  async me(@CurrentUser() user: JwtPayload): Promise<{
    id: string;
    email: string;
    name: string;
    organizationId: string | null;
    isSuperAdmin: boolean;
  }> {
    return this.authService.getMe(user.sub);
  }
}
