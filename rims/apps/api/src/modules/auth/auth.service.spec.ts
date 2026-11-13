import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { getQueueToken } from "@nestjs/bullmq";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";
import * as argon2 from "argon2";

// ── Helpers ────────────────────────────────────────────────────────────────

function makePrismaMock() {
  return {
    user: {
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    session: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    invitation: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((ops: unknown[]) =>
      Promise.all(ops as Promise<unknown>[]),
    ),
  };
}

const ACTIVE_USER = {
  id: "user-uuid",
  email: "test@example.com",
  passwordHash: "", // filled in individual tests
  firstName: "Jane",
  lastName: "Doe",
  tenantId: "tenant-uuid",
  status: "ACTIVE",
  roleAssignments: [],
};

describe("AuthService", () => {
  let service: AuthService;
  let prisma: ReturnType<typeof makePrismaMock>;

  beforeEach(async () => {
    prisma = makePrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue("mock.jwt.token"),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, def?: unknown) => {
              if (key === "JWT_ACCESS_EXPIRY") return "15m";
              if (key === "JWT_REFRESH_EXPIRY") return "7d";
              return def;
            }),
            getOrThrow: jest.fn((key: string) => {
              if (key === "JWT_ACCESS_SECRET")
                return "test-secret-at-least-32-chars-long!!";
              throw new Error(`Config key not found: ${key}`);
            }),
          },
        },
        {
          provide: getQueueToken("email"),
          useValue: { add: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // ── loginFull ─────────────────────────────────────────────────────────────

  describe("loginFull", () => {
    it("returns access + refresh tokens on valid credentials", async () => {
      const hash = await argon2.hash("correct-password");
      const user = { ...ACTIVE_USER, passwordHash: hash };
      prisma.user.findFirst.mockResolvedValue(user);
      prisma.session.create.mockResolvedValue({ id: "session-id" });

      const result = await service.loginFull(
        { email: user.email, password: "correct-password" },
        "127.0.0.1",
        "jest",
      );

      expect(result.accessToken).toBe("mock.jwt.token");
      expect(typeof result.refreshToken).toBe("string");
      expect(result.user.id).toBe(user.id);
    });

    it("throws UnauthorizedException when user not found", async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(
        service.loginFull({ email: "nobody@example.com", password: "x" }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it("throws UnauthorizedException on wrong password", async () => {
      const hash = await argon2.hash("correct-password");
      prisma.user.findFirst.mockResolvedValue({
        ...ACTIVE_USER,
        passwordHash: hash,
      });

      await expect(
        service.loginFull({
          email: ACTIVE_USER.email,
          password: "wrong-password",
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it("verifies password against the stored hash (correct vs wrong)", async () => {
      // argon2 native module has non-configurable bindings — verify indirectly:
      // correct password must resolve; wrong password must reject
      const hash = await argon2.hash("my-secret-pass");
      prisma.user.findFirst.mockResolvedValue({
        ...ACTIVE_USER,
        passwordHash: hash,
      });
      prisma.session.create.mockResolvedValue({ id: "session-id" });

      await expect(
        service.loginFull({ email: ACTIVE_USER.email, password: "wrong-pass" }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      const result = await service.loginFull({
        email: ACTIVE_USER.email,
        password: "my-secret-pass",
      });
      expect(result.user.id).toBe(ACTIVE_USER.id);
    });
  });

  // ── refreshFull ───────────────────────────────────────────────────────────

  describe("refreshFull", () => {
    it("rotates refresh token and returns new access token", async () => {
      const rawToken = "a".repeat(80);
      const session = {
        id: "session-id",
        userId: "user-uuid",
        tenantId: "tenant-uuid",
        user: {
          email: "test@example.com",
          status: "ACTIVE",
          roleAssignments: [],
        },
      };

      prisma.session.findFirst.mockResolvedValue(session);
      prisma.session.update.mockResolvedValue({
        id: "session-id",
        revokedAt: new Date(),
      });
      prisma.session.create.mockResolvedValue({ id: "new-session-id" });

      const result = await service.refreshFull(rawToken);

      expect(result.accessToken).toBe("mock.jwt.token");
      expect(typeof result.newRefreshToken).toBe("string");
      expect(result.newRefreshToken).not.toBe(rawToken);
      expect(prisma.session.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "session-id" } }),
      );
    });

    it("throws UnauthorizedException for invalid token", async () => {
      prisma.session.findFirst.mockResolvedValue(null);
      await expect(service.refreshFull("bad-token")).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  // ── logoutByToken ─────────────────────────────────────────────────────────

  describe("logoutByToken", () => {
    it("revokes the session matching the token hash", async () => {
      prisma.session.updateMany.mockResolvedValue({ count: 1 });
      const token = "some-refresh-token";
      await service.logoutByToken(token);

      expect(prisma.session.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tokenHash: service.hashToken(token),
            revokedAt: null,
          }),
        }),
      );
    });
  });

  // ── resetPassword ─────────────────────────────────────────────────────────

  describe("resetPassword", () => {
    it("throws BadRequestException for expired/invalid token", async () => {
      prisma.invitation.findFirst.mockResolvedValue(null);
      await expect(
        service.resetPassword({ token: "bad", newPassword: "newpass123" }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
