import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";

export interface ResolvedTenant {
  id: string;
  name: string;
  slug: string;
  status: string;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await this.resolveTenant(req);
      if (tenant) {
        req.tenant = tenant;
        await this.prisma.setTenantContext(tenant.id);
      }
    } catch (err) {
      // Middleware must not block the request — guards enforce tenant presence
      this.logger.warn(`TenantMiddleware error: ${(err as Error).message}`);
    }
    next();
  }

  private async resolveTenant(req: Request): Promise<ResolvedTenant | null> {
    // ── 1. Try JWT claim ─────────────────────────────────────────────────────
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      try {
        const payload = this.jwtService.verify<{ tenantId?: string }>(token, {
          secret: this.config.getOrThrow<string>("JWT_ACCESS_SECRET"),
        });
        if (payload.tenantId) {
          const tenant = await this.prisma.tenant.findUnique({
            where: { id: payload.tenantId },
            select: { id: true, name: true, slug: true, status: true },
          });
          if (tenant) return tenant;
        }
      } catch {
        // Invalid/expired JWT — fall through to host header resolution
      }
    }

    // ── 2. Try Host header ───────────────────────────────────────────────────
    const host = (req.headers["x-tenant-domain"] as string) || req.hostname;
    if (host) {
      const domainRecord = await this.prisma.tenantDomain.findFirst({
        where: { domain: host, verified: true },
        select: {
          tenant: {
            select: { id: true, name: true, slug: true, status: true },
          },
        },
      });
      if (domainRecord?.tenant) return domainRecord.tenant;
    }

    return null;
  }
}
