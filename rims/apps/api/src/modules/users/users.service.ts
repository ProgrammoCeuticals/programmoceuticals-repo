import {
  Injectable,
  Optional,
  Logger,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import * as crypto from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { QueryUsersDto } from "./dtos/query-users.dto";
import { InviteUserDto } from "./dtos/invite-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    @Optional() @InjectQueue("email") private readonly emailQueue: Queue | null,
  ) {}

  async findMe(userId: string, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
      include: {
        roleAssignments: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const permissions = [
      ...new Set(
        user.roleAssignments.flatMap((ra) =>
          ra.role.rolePermissions.map((rp) => rp.permission.code),
        ),
      ),
    ];

    const roleAssignments = user.roleAssignments.map((ra) => ({
      id: ra.id,
      scopeType: ra.scopeType,
      scopeId: ra.scopeId,
      role: {
        id: ra.role.id,
        name: ra.role.name,
      },
    }));

    return { ...user, permissions, roleAssignments };
  }

  async findAll(query: QueryUsersDto, tenantId: string) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    const where: Record<string, unknown> = { tenantId };

    if (query.status) {
      where["status"] = query.status;
    }

    if (query.search) {
      where["OR"] = [
        { email: { contains: query.search, mode: "insensitive" } },
        { firstName: { contains: query.search, mode: "insensitive" } },
        { lastName: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.roleId) {
      where["roleAssignments"] = {
        some: { roleId: query.roleId },
      };
    }

    const [total, data] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async inviteUser(dto: InviteUserDto, tenantId: string, actorId: string) {
    // 1. Check if user already active
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email, tenantId },
    });

    if (existing?.status === "ACTIVE") {
      throw new ConflictException("User already active");
    }

    // 2. Upsert user
    let user: { id: string; email: string };
    if (!existing) {
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          tenantId,
          status: "PENDING_VERIFICATION",
          passwordHash: "",
          firstName: dto.firstName ?? "",
          lastName: dto.lastName ?? "",
        },
        select: { id: true, email: true },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
          ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
        },
        select: { id: true, email: true },
      });
    }

    // 3. Create UserTenantMembership if not exists
    await this.prisma.userTenantMembership.upsert({
      where: { userId_tenantId: { userId: user.id, tenantId } },
      create: { userId: user.id, tenantId },
      update: {},
    });

    // 4. Assign role
    const existingAssignment = await this.prisma.userRoleAssignment.findFirst({
      where: {
        userId: user.id,
        roleId: dto.roleId,
        scopeType: "INSTITUTION",
        scopeId: null,
      },
    });
    if (!existingAssignment) {
      await this.prisma.userRoleAssignment.create({
        data: {
          userId: user.id,
          roleId: dto.roleId,
          scopeType: "INSTITUTION",
          scopeId: null,
        },
      });
    }

    // 5. Create invitation token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invitation = await this.prisma.invitation.create({
      data: {
        tenantId,
        email: dto.email,
        token,
        tokenHash,
        type: "STAFF",
        status: "PENDING",
        expiresAt,
        invitedByUserId: actorId,
      },
    });

    // 6. Enqueue invitation email (fire-and-forget)
    try {
      await this.emailQueue?.add("invitation-email", {
        to: dto.email,
        token,
        tenantId,
      });
    } catch (err) {
      this.logger.warn(
        `Failed to enqueue invitation-email: ${(err as Error).message}`,
      );
    }

    // 7. Audit log
    await this.auditService.log({
      tenantId,
      actorId,
      action: "user.invited",
      resourceType: "User",
      resourceId: user.id,
      outcome: "SUCCESS",
    });

    return invitation;
  }

  async updateUser(
    id: string,
    dto: UpdateUserDto,
    tenantId: string,
    actorId: string,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.status !== undefined ? { status: dto.status as never } : {}),
        ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
        ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
      },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: "user.updated",
      resourceType: "User",
      resourceId: id,
      outcome: "SUCCESS",
    });

    return updated;
  }

  async findOne(id: string, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
      include: {
        roleAssignments: {
          include: { role: { select: { id: true, name: true } } },
          orderBy: { assignedAt: "asc" },
        },
      },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
