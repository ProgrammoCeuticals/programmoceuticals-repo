import {
  Injectable,
  Optional,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import * as argon2 from "argon2";
import * as crypto from "crypto";
import { Queue } from "bullmq";
import { InjectQueue } from "@nestjs/bullmq";
import { LoginDto } from "./dtos/login.dto";
import { ForgotPasswordDto } from "./dtos/forgot-password.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { AcceptInvitationDto } from "./dtos/accept-invitation.dto";
import { JwtPayload } from "@rims/shared-types";

export interface LoginFullResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    tenantId: string;
  };
}

export interface RefreshFullResult {
  accessToken: string;
  newRefreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Optional() @InjectQueue("email") private readonly emailQueue: Queue | null,
  ) {}

  // ─── Login ─────────────────────────────────────────────────────────────────

  async loginFull(
    dto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<LoginFullResult> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, status: "ACTIVE" },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        tenantId: true,
        roleAssignments: {
          select: {
            scopeType: true,
            scopeId: true,
            role: {
              select: {
                id: true,
                name: true,
                rolePermissions: {
                  select: { permission: { select: { code: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      // Constant-time guard — prevents timing-based user enumeration
      await argon2.hash("dummy_password_for_timing");
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const permissions = user.roleAssignments.flatMap((ra) =>
      ra.role.rolePermissions.map((rp) => rp.permission.code),
    );
    const uniquePermissions = [...new Set(permissions)];

    const scopes = user.roleAssignments.map((ra) => ({
      roleId: ra.role.id,
      roleName: ra.role.name,
      scopeType: (ra.scopeType ?? "INSTITUTION") as
        | "INSTITUTION"
        | "DEPARTMENT"
        | "TEAM"
        | "PROJECT",
      scopeId: ra.scopeId ?? null,
    }));

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken({
        sub: user.id,
        email: user.email,
        tenantId: user.tenantId,
        permissions: uniquePermissions,
        scopes,
      }),
      this.createSession(user.id, user.tenantId, ipAddress, userAgent),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tenantId: user.tenantId,
      },
    };
  }

  // ─── Refresh ───────────────────────────────────────────────────────────────

  async refreshFull(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<RefreshFullResult> {
    const tokenHash = this.hashToken(refreshToken);

    const session = await this.prisma.session.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        userId: true,
        tenantId: true,
        user: {
          select: {
            email: true,
            status: true,
            roleAssignments: {
              select: {
                scopeType: true,
                scopeId: true,
                role: {
                  select: {
                    id: true,
                    name: true,
                    rolePermissions: {
                      select: { permission: { select: { code: true } } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session || session.user.status !== "ACTIVE") {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const permissions = session.user.roleAssignments.flatMap((ra) =>
      ra.role.rolePermissions.map((rp) => rp.permission.code),
    );
    const uniquePermissions = [...new Set(permissions)];

    const scopes = session.user.roleAssignments.map((ra) => ({
      roleId: ra.role.id,
      roleName: ra.role.name,
      scopeType: (ra.scopeType ?? "INSTITUTION") as
        | "INSTITUTION"
        | "DEPARTMENT"
        | "TEAM"
        | "PROJECT",
      scopeId: ra.scopeId ?? null,
    }));

    // Rotate: revoke old session then create new one
    await this.prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    const [accessToken, newRefreshToken] = await Promise.all([
      this.signAccessToken({
        sub: session.userId,
        email: session.user.email,
        tenantId: session.tenantId,
        permissions: uniquePermissions,
        scopes,
      }),
      this.createSession(
        session.userId,
        session.tenantId,
        ipAddress,
        userAgent,
      ),
    ]);

    return { accessToken, newRefreshToken };
  }

  // ─── Logout ────────────────────────────────────────────────────────────────

  async logout(sessionId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { id: sessionId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async logoutByToken(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);
    await this.prisma.session.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async logoutAll(userId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // ─── Forgot password ───────────────────────────────────────────────────────

  async forgotPassword(
    dto: ForgotPasswordDto,
    tenantId: string,
  ): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, tenantId },
      select: { id: true },
    });

    // Always return 200 — never reveal whether the email exists
    if (!user) return;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.invitation.create({
      data: {
        tenantId,
        email: dto.email,
        token: rawToken,
        tokenHash,
        type: "STAFF",
        status: "PENDING",
        expiresAt,
        invitedByUserId: user.id,
      },
    });

    // Enqueue email — fire-and-forget; queue unavailability must not fail the response
    try {
      await this.emailQueue?.add("password-reset", {
        to: dto.email,
        token: rawToken,
      });
    } catch (err) {
      this.logger.warn(
        `Failed to enqueue password-reset email: ${(err as Error).message}`,
      );
    }
  }

  // ─── Reset password ────────────────────────────────────────────────────────

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const tokenHash = this.hashToken(dto.token);

    const invitation = await this.prisma.invitation.findFirst({
      where: {
        tokenHash,
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
      select: { id: true, tenantId: true, email: true },
    });

    if (!invitation) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    const user = await this.prisma.user.findFirst({
      where: { email: invitation.email, tenantId: invitation.tenantId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const passwordHash = await argon2.hash(dto.newPassword);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED", usedAt: new Date() },
      }),
      this.prisma.session.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
  }

  // ─── Accept invitation ─────────────────────────────────────────────────────

  async acceptInvitation(dto: AcceptInvitationDto): Promise<void> {
    const tokenHash = this.hashToken(dto.token);

    const invitation = await this.prisma.invitation.findFirst({
      where: {
        tokenHash,
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
      select: { id: true, tenantId: true, email: true },
    });

    if (!invitation) {
      throw new BadRequestException("Invalid or expired invitation token");
    }

    const passwordHash = await argon2.hash(dto.password);
    const nameUpdate = dto.name ? this.parseName(dto.name) : {};

    await this.prisma.$transaction([
      this.prisma.user.updateMany({
        where: { email: invitation.email, tenantId: invitation.tenantId },
        data: { status: "ACTIVE", passwordHash, ...nameUpdate },
      }),
      this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED", usedAt: new Date() },
      }),
    ]);
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private async signAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.config.getOrThrow<string>("JWT_ACCESS_SECRET"),
      expiresIn: this.config.get<string>("JWT_ACCESS_EXPIRY", "15m"),
    });
  }

  hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  private async createSession(
    userId: string,
    tenantId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<string> {
    const refreshToken = crypto.randomBytes(40).toString("hex");
    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date(
      Date.now() +
        this.parseExpiry(this.config.get<string>("JWT_REFRESH_EXPIRY", "7d")),
    );

    await this.prisma.session.create({
      data: {
        userId,
        tenantId,
        tokenHash,
        expiresAt,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      },
    });

    return refreshToken;
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000;
    const value = parseInt(match[1] ?? "7", 10);
    const unit = match[2] ?? "d";
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return value * (multipliers[unit] ?? 24 * 60 * 60 * 1000);
  }

  private parseName(fullName: string): { firstName: string; lastName: string } {
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ");
    return { firstName, lastName };
  }
}
