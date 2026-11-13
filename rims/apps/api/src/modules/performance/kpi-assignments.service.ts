import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, PerformanceCycleStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKpiAssignmentDto } from './dtos/create-kpi-assignment.dto';

@Injectable()
export class KpiAssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateKpiAssignmentDto, tenantId: string) {
    // Validate cycle exists and is in DRAFT or ACTIVE
    const cycle = await this.prisma.performanceCycle.findFirst({
      where: { id: dto.cycleId, tenantId },
    });

    if (!cycle) {
      throw new NotFoundException('Performance cycle not found');
    }

    if (
      cycle.status !== PerformanceCycleStatus.DRAFT &&
      cycle.status !== PerformanceCycleStatus.ACTIVE
    ) {
      throw new BadRequestException(
        'Assignments can only be created for DRAFT or ACTIVE cycles',
      );
    }

    const assignment = await this.prisma.kpiAssignment.create({
      data: {
        tenantId,
        cycleId: dto.cycleId,
        kpiId: dto.kpiId,
        subjectType: dto.subjectType,
        subjectId: dto.subjectId,
        weight: dto.weight,
        ...(dto.targetValue !== undefined ? { targetValue: dto.targetValue } : {}),
      },
    });

    // Calculate total weight for this subject+cycle
    const assignments = await this.prisma.kpiAssignment.findMany({
      where: {
        cycleId: dto.cycleId,
        subjectId: dto.subjectId,
        tenantId,
      },
    });

    const totalWeight = assignments.reduce(
      (sum, a) => sum + Number(a.weight),
      0,
    );

    return {
      data: assignment,
      meta: {
        totalWeight,
        warning: totalWeight > 100 ? 'Total weight exceeds 100' : null,
      },
    };
  }

  async findByCycle(cycleId: string, tenantId: string) {
    return this.prisma.kpiAssignment.findMany({
      where: { cycleId, tenantId },
      include: {
        kpi: { select: { name: true, measurementType: true, directionality: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findBySubject(
    subjectType: string,
    subjectId: string,
    cycleId: string,
    tenantId: string,
  ) {
    return this.prisma.kpiAssignment.findMany({
      where: { subjectType, subjectId, cycleId, tenantId },
      include: {
        kpi: { select: { name: true, measurementType: true, directionality: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
