import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { AuthService } from "../auth/auth.service";
import { CreateUserDto, UpdateUserDto, AssignRoleDto } from "./dto/user.dto";
import {
  paginate,
  type PaginatedResult,
} from "../../common/dto/pagination.dto";
import type { User } from "@prisma/client";

/**
 * UsersService — spec §6A.1, §42.
 *
 * All user management is org-scoped for ORGANIZATION_ADMIN.
 * SUPER_ADMIN can manage users globally — spec §41.
 * Object-level authorization enforced server-side — spec §42.
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly authService: AuthService,
  ) {}

  async create(
    dto: CreateUserDto,
    actorId?: string | undefined,
    actorOrgId?: string | undefined,
  ): Promise<Omit<User, "passwordHash">> {
    const orgId = dto.organizationId ?? actorOrgId ?? null;

    // Unique email within org
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email, organizationId: orgId },
    });
    if (existing) {
      throw new ConflictException(
        `User with email "${dto.email}" already exists.`,
      );
    }

    const passwordHash = await this.authService.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        organizationId: orgId,
        status: "ACTIVE",
        isSuperAdmin: false,
      },
    });

    if (orgId) {
      await this.audit.record({
        organizationId: orgId,
        userId: actorId,
        eventType: "CREATE_USER",
        entityType: "User",
        entityId: user.id,
        newValue: { email: user.email, organizationId: orgId },
      });
    }

    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async findAll(
    organizationId: string,
    page = 1,
    pageSize = 50,
  ): Promise<PaginatedResult<Omit<User, "passwordHash">>> {
    const where = { organizationId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          isSuperAdmin: true,
          organizationId: true,
          createdAt: true,
          updatedAt: true,
          passwordHash: false,
        },
        orderBy: { name: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.user.count({ where }),
    ]);
    return paginate(
      data as Omit<User, "passwordHash">[],
      total,
      page,
      pageSize,
    );
  }

  async findOne(id: string): Promise<Omit<User, "passwordHash">> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        isSuperAdmin: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false,
        roles: { include: { role: { select: { name: true, scope: true } } } },
      },
    });
    if (!user) throw new NotFoundException(`User ${id} not found.`);
    return user as unknown as Omit<User, "passwordHash">;
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    actorId?: string | undefined,
  ): Promise<Omit<User, "passwordHash">> {
    await this.findOne(id);
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });
    const { passwordHash: _, ...safe } = updated;
    return safe;
  }

  async assignRole(
    userId: string,
    dto: AssignRoleDto,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<void> {
    await this.findOne(userId);
    const role = await this.prisma.role.findUnique({
      where: { id: dto.roleId },
    });
    if (!role) throw new NotFoundException(`Role ${dto.roleId} not found.`);

    // SUPER_ADMIN role must not be assigned through org endpoints — spec §41
    if (role.name === "SUPER_ADMIN") {
      throw new ForbiddenException(
        "SUPER_ADMIN is a system-level role and cannot be assigned via the organization endpoint.",
      );
    }

    await this.prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId: dto.roleId } },
      update: {},
      create: { userId, roleId: dto.roleId },
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "UPDATE_USER_ROLE",
      entityType: "User",
      entityId: userId,
      newValue: { roleName: role.name, action: "ASSIGN" },
    });
  }

  async removeRole(
    userId: string,
    roleId: string,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<void> {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    await this.prisma.userRole
      .delete({
        where: { userId_roleId: { userId, roleId } },
      })
      .catch(() => {});

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "UPDATE_USER_ROLE",
      entityType: "User",
      entityId: userId,
      newValue: { roleName: role?.name, action: "REMOVE" },
    });
  }

  async getUserRoles(userId: string) {
    return this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    });
  }
}
