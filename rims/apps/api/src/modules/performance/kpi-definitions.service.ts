import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, KpiMeasurementType, KpiDirectionality, PerformanceCycleStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKpiDefinitionDto } from './dtos/create-kpi-definition.dto';
import { UpdateKpiDefinitionDto } from './dtos/update-kpi-definition.dto';

@Injectable()
export class KpiDefinitionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    tenantId: string,
    query: {
      category?: string;
      isActive?: boolean;
      measurementType?: string;
      page?: number;
      pageSize?: number;
    },
  ) {
    const { category, isActive, measurementType, page = 1, pageSize = 20 } = query;

    const where: Prisma.KpiDefinitionWhereInput = {
      tenantId,
      ...(category && { category }),
      ...(isActive !== undefined && { isActive }),
      ...(measurementType && {
        measurementType: measurementType as KpiMeasurementType,
      }),
    };

    const [total, data] = await Promise.all([
      this.prisma.kpiDefinition.count({ where }),
      this.prisma.kpiDefinition.findMany({
        where,
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
    dto: CreateKpiDefinitionDto,
    tenantId: string,
    createdById: string,
  ) {
    return this.prisma.kpiDefinition.create({
      data: {
        name: dto.name,
        tenantId,
        createdById,
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.measurementType !== undefined
          ? { measurementType: dto.measurementType as KpiMeasurementType }
          : {}),
        ...(dto.unit !== undefined ? { unit: dto.unit } : {}),
        ...(dto.directionality !== undefined
          ? { directionality: dto.directionality as KpiDirectionality }
          : {}),
        ...(dto.defaultWeight !== undefined ? { defaultWeight: dto.defaultWeight } : {}),
        ...(dto.targetValue !== undefined ? { targetValue: dto.targetValue } : {}),
        ...(dto.evidenceRequired !== undefined
          ? { evidenceRequired: dto.evidenceRequired }
          : {}),
        ...(dto.objectiveId !== undefined ? { objectiveId: dto.objectiveId } : {}),
      },
    });
  }

  async update(id: string, dto: UpdateKpiDefinitionDto, tenantId: string) {
    const kpi = await this.prisma.kpiDefinition.findFirst({
      where: { id, tenantId },
    });

    if (!kpi) {
      throw new NotFoundException('KPI definition not found');
    }

    // Check if this KPI is used in a LOCKED cycle
    const lockedAssignment = await this.prisma.kpiAssignment.findFirst({
      where: {
        kpiId: id,
        tenantId,
        cycle: { status: PerformanceCycleStatus.LOCKED },
      },
    });

    if (lockedAssignment) {
      throw new BadRequestException(
        'Cannot update a KPI that is used in a LOCKED performance cycle',
      );
    }

    const data: Prisma.KpiDefinitionUncheckedUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.measurementType !== undefined)
      data.measurementType = dto.measurementType as KpiMeasurementType;
    if (dto.unit !== undefined) data.unit = dto.unit;
    if (dto.directionality !== undefined)
      data.directionality = dto.directionality as KpiDirectionality;
    if (dto.defaultWeight !== undefined) data.defaultWeight = dto.defaultWeight;
    if (dto.targetValue !== undefined) data.targetValue = dto.targetValue;
    if (dto.evidenceRequired !== undefined)
      data.evidenceRequired = dto.evidenceRequired;
    if (dto.objectiveId !== undefined) data.objectiveId = dto.objectiveId;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return this.prisma.kpiDefinition.update({ where: { id }, data });
  }
}
