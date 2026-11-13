import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import {
  paginate,
  type PaginatedResult,
} from "../../common/dto/pagination.dto";
import type { Product } from "@prisma/client";

/**
 * ProductsService — spec §7.2.
 *
 * Products are organisation-scoped — spec §42.
 * All queries filter by organizationId except for Super Admins.
 *
 * Spec §7.2: Do not over-model pharmaceutical regulatory details until
 * the applicable product-domain requirements are explicitly defined.
 */
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    organizationId: string,
    dto: CreateProductDto,
  ): Promise<Product> {
    return this.prisma.product.create({
      data: {
        organizationId,
        productName: dto.productName,
        genericName: dto.genericName ?? null,
        brandName: dto.brandName ?? null,
        activeIngredient: dto.activeIngredient ?? null,
        dosageForm: dto.dosageForm ?? null,
        strength: dto.strength ?? null,
        routeOfAdministration: dto.routeOfAdministration ?? null,
        productCode: dto.productCode ?? null,
        status: "ACTIVE",
      },
    });
  }

  async findAll(
    organizationId: string,
    page = 1,
    pageSize = 50,
  ): Promise<PaginatedResult<Product>> {
    const where = { organizationId, status: "ACTIVE" };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy: { productName: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);
    return paginate(data, total, page, pageSize);
  }

  async findOne(id: string, organizationId: string): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: { id, organizationId },
    });
    if (!product) throw new NotFoundException(`Product ${id} not found.`);
    return product;
  }

  async update(
    id: string,
    organizationId: string,
    dto: UpdateProductDto,
  ): Promise<Product> {
    await this.findOne(id, organizationId);
    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.productName !== undefined && { productName: dto.productName }),
        ...(dto.genericName !== undefined && { genericName: dto.genericName }),
        ...(dto.brandName !== undefined && { brandName: dto.brandName }),
        ...(dto.dosageForm !== undefined && { dosageForm: dto.dosageForm }),
        ...(dto.strength !== undefined && { strength: dto.strength }),
        ...(dto.routeOfAdministration !== undefined && {
          routeOfAdministration: dto.routeOfAdministration,
        }),
      },
    });
  }

  /** Verify product belongs to the requesting organization — spec §42 */
  async assertOwnership(
    productId: string,
    organizationId: string,
  ): Promise<void> {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, organizationId },
      select: { id: true },
    });
    if (!product) {
      throw new ForbiddenException(
        `Product ${productId} does not belong to this organization.`,
      );
    }
  }
}
