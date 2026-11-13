import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos/login.dto";
import { ForgotPasswordDto } from "./dtos/forgot-password.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { AcceptInvitationDto } from "./dtos/accept-invitation.dto";
import { Public } from "../../common/decorators/public.decorator";
import { TenantGuard } from "../../common/guards/tenant.guard";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "@rims/shared-types";

const REFRESH_COOKIE = "refresh_token";

function refreshCookieOptions(maxAgeMs: number) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env["NODE_ENV"] === "production",
    path: "/api/v1/auth",
    maxAge: maxAgeMs,
  };
}

@ApiTags("auth")
@Controller("auth")
@Throttle({ default: { ttl: 60_000, limit: 5 } })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── POST /auth/login ────────────────────────────────────────────────────

  @Public()
    @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Authenticate with email + password" })
  @ApiResponse({
    status: 200,
    description: "Returns access token; sets HttpOnly refresh cookie",
  })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user, refreshToken } =
      await this.authService.loginFull(dto, req.ip, req.headers["user-agent"]);

    res.cookie(
      REFRESH_COOKIE,
      refreshToken,
      refreshCookieOptions(7 * 24 * 60 * 60 * 1000),
    );

    return { accessToken, user };
  }

  // ─── POST /auth/refresh ───────────────────────────────────────────────────

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Rotate refresh token and issue new access token" })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!oldRefreshToken) {
      throw new UnauthorizedException("Refresh token cookie missing");
    }

    const { accessToken, newRefreshToken } = await this.authService.refreshFull(
      oldRefreshToken,
      req.ip,
      req.headers["user-agent"],
    );

    res.cookie(
      REFRESH_COOKIE,
      newRefreshToken,
      refreshCookieOptions(7 * 24 * 60 * 60 * 1000),
    );

    return { accessToken };
  }

  // ─── POST /auth/logout ────────────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Revoke current session" })
  async logout(
    @CurrentUser() _user: JwtPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (refreshToken) {
      await this.authService.logoutByToken(refreshToken);
    }
    res.clearCookie(REFRESH_COOKIE, refreshCookieOptions(0));
  }

  // ─── POST /auth/forgot-password ───────────────────────────────────────────

  @Public()
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Request password reset email" })
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req: Request) {
    const tenantId = req.tenant?.id ?? "";
    await this.authService.forgotPassword(dto, tenantId);
    return { message: "If that email exists, a reset link has been sent." };
  }

  // ─── POST /auth/reset-password ────────────────────────────────────────────

  @Public()
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reset password using token from email" })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return { message: "Password updated successfully." };
  }

  // ─── POST /auth/accept-invitation ─────────────────────────────────────────

  @Public()
  @Post("accept-invitation")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Accept user invitation and set password" })
  async acceptInvitation(@Body() dto: AcceptInvitationDto) {
    await this.authService.acceptInvitation(dto);
    return { message: "Invitation accepted. You can now log in." };
  }

  // ─── GET /auth/me ──────────────────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("me")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Return current user info and permissions from JWT" })
  getMe(@CurrentUser() user: JwtPayload) {
    return {
      id: user.sub,
      email: user.email,
      tenantId: user.tenantId,
      permissions: user.permissions ?? [],
    };
  }
}
