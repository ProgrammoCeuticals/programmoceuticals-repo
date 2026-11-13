import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import * as argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { createHash } from "crypto";

/**
 * AuthService — spec §40.
 *
 * - Argon2id password hashing.
 * - Short-lived access tokens (JWT).
 * - Refresh token rotation.
 * - Revocable sessions/tokens.
 * - Tokens are never logged. Never print passwords, tokens, or secrets.
 */

export interface JwtPayload {
  sub: string; // user id
  email: string;
  orgId: string | null;
  isSuperAdmin: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
  ) {}

  async login(
    email: string,
    password: string,
    meta: {
      ipAddress?: string | undefined;
      userAgent?: string | undefined;
      correlationId?: string | undefined;
    },
  ): Promise<AuthTokens> {
    const user = await this.prisma.user.findFirst({
      where: { email, status: "ACTIVE" },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const tokens = await this.issueTokens(user.id);

    // Create session record
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.session.create({
      data: {
        userId: user.id,
        sessionToken,
        ipAddress: meta.ipAddress ?? null,
        userAgent: meta.userAgent ?? null,
        expiresAt,
      },
    });

    // Audit — spec §44
    if (user.organizationId) {
      await this.auditService.record({
        organizationId: user.organizationId,
        userId: user.id,
        eventType: "LOGIN",
        entityType: "User",
        entityId: user.id,
        correlationId: meta.correlationId,
      });
    }

    return tokens;
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const tokenHash = this.hashToken(refreshToken);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired refresh token.");
    }

    if (stored.user.status !== "ACTIVE") {
      throw new UnauthorizedException("User account is inactive.");
    }

    // Rotation — revoke old token, issue new pair
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(stored.user.id);
  }

  async logout(userId: string, correlationId?: string): Promise<void> {
    // Revoke all active refresh tokens for this user
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (user?.organizationId) {
      await this.auditService.record({
        organizationId: user.organizationId,
        userId,
        eventType: "LOGOUT",
        entityType: "User",
        entityId: userId,
        correlationId,
      });
    }
  }

  async getMe(userId: string): Promise<{
    id: string;
    email: string;
    name: string;
    organizationId: string | null;
    isSuperAdmin: boolean;
  }> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        organizationId: true,
        isSuperAdmin: true,
      },
    });
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    // Argon2id — spec §40
    return argon2.hash(password, { type: argon2.argon2id });
  }

  private async issueTokens(userId: string): Promise<AuthTokens> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      orgId: user.organizationId ?? null,
      isSuperAdmin: user.isSuperAdmin,
    };

    const accessToken = this.jwtService.sign(payload);

    // Refresh token — store hashed, never plaintext
    const refreshToken = uuidv4();
    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });

    return { accessToken, refreshToken };
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
