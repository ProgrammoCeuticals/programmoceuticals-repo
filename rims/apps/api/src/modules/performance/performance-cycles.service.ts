import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, PerformanceCycleStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreatePerformanceCycleDto } from './dtos/create-performance-cycle.dto';
import { UpdatePerformanceCycleDto } from './dtos/update-performance-cycle.dto';

const CYCLE_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['ACTIVE'],
  ACTIVE: ['CLOSED'],
  CLOSED: ['LOCKED'],
  LOCKED: [],
};

@Injectable()
export class PerformanceCyclesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(
    tenantId: string,
    query: { page?: number; pageSize?: number; status?: string },
  ) {
    const { page = 1, pageSize = 20, status } = query;

    const where: Prisma.PerformanceCycleWhereInput = {
      tenantId,
      ...(status && { status: status as PerformanceCycleStatus }),
    };

    const [total, data] = await Promise.all([
      this.prisma.performanceCycle.count({ where }),
      this.prisma.performanceCycle.findMany({
        where,
        include: {
          _count: { select: { kpiAssignments: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
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

  async create(
    dto: CreatePerformanceCycleDto,
    tenantId: string,
    createdById: string,
  ) {
    return this.prisma.performanceCycle.create({
      data: {
        name: dto.name,
        tenantId,
        createdById,
        status: PerformanceCycleStatus.DRAFT,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const cycle = await this.prisma.performanceCycle.findFirst({
      where: { id, tenantId },
      include: {
        objectives: {
          include: { kpiDefinitions: true },
        },
        kpiAssignments: {
          include: {
            kpi: { select: { name: true, measurementType: true } },
          },
        },
      },
    });

    if (!cycle) {
      throw new NotFoundException('Performance cycle not found');
    }

    return cycle;
  }

  async update(
    id: string,
    dto: UpdatePerformanceCycleDto,
    tenantId: string,
  ) {
    const existing = await this.prisma.performanceCycle.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundException('Performance cycle not found');
    }

    if (existing.status === PerformanceCycleStatus.LOCKED) {
      throw new BadRequestException('Cannot update a LOCKED performance cycle');
    }

    if (dto.status !== undefined) {
      const allowedNext = CYCLE_TRANSITIONS[existing.status] ?? [];
      if (!allowedNext.includes(dto.status)) {
        throw new BadRequestException(
          `Invalid status transition from ${existing.status} to ${dto.status}`,
        );
      }
    }

    const data: Prisma.PerformanceCycleUncheckedUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.startDate !== undefined) data.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) data.endDate = new Date(dto.endDate);
    if (dto.status !== undefined)
      data.status = dto.status as PerformanceCycleStatus;

    return this.prisma.performanceCycle.update({ where: { id }, data });
  }

  async activate(id: string, tenantId: string, actorId: string) {
    const cycle = await this.prisma.performanceCycle.findFirst({
      where: { id, tenantId },
    });

    if (!cycle) {
      throw new NotFoundException('Performance cycle not found');
    }

    if (cycle.status !== PerformanceCycleStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT cycles can be activated');
    }

    const updated = await this.prisma.performanceCycle.update({
      where: { id },
      data: { status: PerformanceCycleStatus.ACTIVE },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'performance.cycle.activated',
      resourceType: 'PerformanceCycle',
      resourceId: id,
      outcome: 'SUCCESS',
    });

    return updated;
  }

  async close(id: string, tenantId: string, actorId: string) {
    const cycle = await this.prisma.performanceCycle.findFirst({
      where: { id, tenantId },
    });

    if (!cycle) {
      throw new NotFoundException('Performance cycle not found');
    }

    if (cycle.status !== PerformanceCycleStatus.ACTIVE) {
      throw new BadRequestException('Only ACTIVE cycles can be closed');
    }

    const updated = await this.prisma.performanceCycle.update({
      where: { id },
      data: { status: PerformanceCycleStatus.CLOSED },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'performance.cycle.closed',
      resourceType: 'PerformanceCycle',
      resourceId: id,
      outcome: 'SUCCESS',
    });

    return updated;
  }

  async lock(id: string, tenantId: string, actorId: string) {
    const cycle = await this.prisma.performanceCycle.findFirst({
      where: { id, tenantId },
    });

    if (!cycle) {
      throw new NotFoundException('Performance cycle not found');
    }

    if (cycle.status !== PerformanceCycleStatus.CLOSED) {
      throw new BadRequestException('Only CLOSED cycles can be locked');
    }

    const updated = await this.prisma.performanceCycle.update({
      where: { id },
      data: { status: PerformanceCycleStatus.LOCKED },
    });

    await this.auditService.log({
      tenantId,
      actorId,
      action: 'performance.cycle.locked',
      resourceType: 'PerformanceCycle',
      resourceId: id,
      outcome: 'SUCCESS',
    });

    return updated;
  }
}
