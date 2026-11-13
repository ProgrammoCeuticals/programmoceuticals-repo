import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "./redis.service";
import { EmailService } from "../notifications/email.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UserRole, JwtPayload } from "@pharmintern/shared-types";

const BCRYPT_ROUNDS = 12;
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
    private readonly email: EmailService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ userId: string; message: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      // Do not reveal whether the email exists — use a generic message
      throw new ConflictException(
        "Registration failed. Please check your details and try again.",
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        role: UserRole.APPLICANT,
      },
    });

    // Generate email verification token and store in Redis
    const verificationToken = uuidv4();
    await this.redis.setEx(
      `email_verify:${verificationToken}`,
      24 * 60 * 60, // 24 hours
      user.id,
    );

    await this.email.sendEmailVerification(user.email, verificationToken);

    await this.prisma.auditEvent.create({
      data: {
        eventType: "USER_REGISTERED",
        actorUserId: user.id,
        entityType: "users",
        entityId: user.id,
        payload: { email: user.email },
      },
    });

    return {
      userId: user.id,
      message: "Verification email sent. Please check your inbox.",
    };
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    // Always hash-compare even when user not found to prevent timing attacks
    const passwordHash =
      user?.passwordHash ?? "$2b$12$invalidhashpaddingtomatchtime";
    const valid = await bcrypt.compare(dto.password, passwordHash);

    if (!user || !valid || user.deletedAt) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException(
        "Please verify your email address before logging in",
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        "Your account has been deactivated. Please contact support.",
      );
    }

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role as UserRole,
    );

    await this.prisma.auditEvent.create({
      data: {
        eventType: "USER_LOGIN",
        actorUserId: user.id,
        entityType: "users",
        entityId: user.id,
      },
    });

    return tokens;
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const userId = await this.redis.get(`email_verify:${token}`);
    if (!userId) {
      throw new BadRequestException("Invalid or expired verification token");
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException("User not found");
    }
    if (user.emailVerifiedAt) {
      return { message: "Email already verified" };
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerifiedAt: new Date() },
    });

    await this.redis.del(`email_verify:${token}`);

    await this.prisma.auditEvent.create({
      data: {
        eventType: "EMAIL_VERIFIED",
        actorUserId: userId,
        entityType: "users",
        entityId: userId,
      },
    });

    return { message: "Email verified successfully. You can now log in." };
  }

  async refreshToken(
    rawRefreshToken: string,
  ): Promise<{ accessToken: string }> {
    let payload: JwtPayload;
    try {
      payload = this.jwt.verify<JwtPayload>(rawRefreshToken, {
        secret: process.env["JWT_REFRESH_SECRET"],
      });
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const storedHash = await this.redis.get(`refresh:${payload.sub}`);
    if (!storedHash) {
      throw new UnauthorizedException("Session expired. Please log in again.");
    }

    const valid = await bcrypt.compare(rawRefreshToken, storedHash);
    if (!valid) {
      // Possible token reuse attack — invalidate all sessions for this user
      await this.redis.del(`refresh:${payload.sub}`);
      throw new UnauthorizedException(
        "Refresh token reuse detected. Please log in again.",
      );
    }

    // Rotate: issue new pair, invalidate old
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user || !user.isActive || user.deletedAt) {
      throw new UnauthorizedException("Account unavailable");
    }

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role as UserRole,
    );
    return { accessToken: tokens.accessToken };
  }

  async logout(userId: string): Promise<void> {
    await this.redis.del(`refresh:${userId}`);
    await this.prisma.auditEvent.create({
      data: {
        eventType: "USER_LOGOUT",
        actorUserId: userId,
        entityType: "users",
        entityId: userId,
      },
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Do not reveal whether the email exists
    if (!user || user.deletedAt) {
      return;
    }

    const token = uuidv4();
    await this.redis.setEx(`pwd_reset:${token}`, 60 * 60, user.id); // 1 hour

    await this.email.sendPasswordReset(user.email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const userId = await this.redis.get(`pwd_reset:${token}`);
    if (!userId) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await this.redis.del(`pwd_reset:${token}`);
    // Invalidate all refresh tokens for this user
    await this.redis.del(`refresh:${userId}`);

    await this.prisma.auditEvent.create({
      data: {
        eventType: "PASSWORD_RESET",
        actorUserId: userId,
        entityType: "users",
        entityId: userId,
      },
    });
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private async generateTokens(
    userId: string,
    email: string,
    role: UserRole,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: process.env["JWT_SECRET"],
        expiresIn: process.env["JWT_ACCESS_EXPIRY"] ?? "15m",
      }),
      this.jwt.signAsync(payload, {
        secret: process.env["JWT_REFRESH_SECRET"],
        expiresIn: process.env["JWT_REFRESH_EXPIRY"] ?? "7d",
      }),
    ]);

    // Store hashed refresh token in Redis
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.redis.setEx(
      `refresh:${userId}`,
      REFRESH_TOKEN_TTL_SECONDS,
      hash,
    );

    return { accessToken, refreshToken };
  }
}
