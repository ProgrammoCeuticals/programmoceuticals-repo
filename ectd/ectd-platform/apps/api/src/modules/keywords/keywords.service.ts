import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { validateKeywordValue } from "@ectd/domain";
import {
  CreateKeywordDefinitionDto,
  AssignKeywordDto,
} from "./dto/keyword.dto";
import type { KeywordDefinition, ContextKeyword } from "@prisma/client";

/**
 * KeywordsService — spec §19.
 *
 * KeywordDefinition is application-scoped — unique per applicationId+code.
 * ContextKeyword assigns a keyword value to a Context of Use.
 *
 * Keyword identity is part of context group normalization — spec §15.
 * Normalization is handled in packages/ectd-domain via normalizeContextGroup().
 *
 * REGULATORY_GAP: Keyword codes/semantics should align with the applicable
 * eCTD v4.0 controlled vocabulary. Full CV-based validation is Phase 8.
 */
@Injectable()
export class KeywordsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Keyword Definitions ──────────────────────────────────────────────

  async createDefinition(
    applicationId: string,
    dto: CreateKeywordDefinitionDto,
  ): Promise<KeywordDefinition> {
    // Verify application exists
    const app = await this.prisma.regulatoryApplication.findUnique({
      where: { id: applicationId },
      select: { id: true },
    });
    if (!app)
      throw new NotFoundException(`Application ${applicationId} not found.`);

    // Check uniqueness
    const existing = await this.prisma.keywordDefinition.findUnique({
      where: { applicationId_code: { applicationId, code: dto.code } },
    });
    if (existing) {
      throw new ConflictException(
        `KeywordDefinition with code "${dto.code}" already exists for application ${applicationId}.`,
      );
    }

    return this.prisma.keywordDefinition.create({
      data: {
        applicationId,
        code: dto.code,
        name: dto.name,
        description: dto.description ?? null,
        dataType: dto.dataType,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        allowedValues: (dto.allowedValues ?? null) as any,
      },
    });
  }

  async getDefinitions(applicationId: string): Promise<KeywordDefinition[]> {
    return this.prisma.keywordDefinition.findMany({
      where: { applicationId },
      orderBy: { code: "asc" },
    });
  }

  async getDefinitionById(id: string): Promise<KeywordDefinition> {
    const def = await this.prisma.keywordDefinition.findUnique({
      where: { id },
    });
    if (!def) throw new NotFoundException(`KeywordDefinition ${id} not found.`);
    return def;
  }

  // ── Context Keywords ─────────────────────────────────────────────────

  /**
   * assignKeyword — assigns a keyword value to a Context of Use.
   *
   * Validates the value against the KeywordDefinition rules.
   * Keyword identity contributes to context group identity — spec §15.
   */
  async assignKeyword(
    contextOfUseId: string,
    dto: AssignKeywordDto,
  ): Promise<ContextKeyword> {
    // Verify CoU exists
    const cou = await this.prisma.contextOfUse.findUnique({
      where: { id: contextOfUseId },
      select: { id: true, status: true },
    });
    if (!cou)
      throw new NotFoundException(`ContextOfUse ${contextOfUseId} not found.`);

    if (cou.status === "SUSPENDED") {
      throw new ConflictException(
        "Keywords cannot be assigned to a SUSPENDED ContextOfUse.",
      );
    }

    // Verify keyword definition exists
    const definition = await this.prisma.keywordDefinition.findUnique({
      where: { id: dto.keywordDefinitionId },
    });
    if (!definition) {
      throw new NotFoundException(
        `KeywordDefinition ${dto.keywordDefinitionId} not found.`,
      );
    }

    // Validate value
    const validation = validateKeywordValue(dto.value, {
      id: definition.id,
      applicationId: definition.applicationId,
      code: definition.code,
      name: definition.name,
      description: definition.description,
      dataType: definition.dataType as import("@ectd/domain").KeywordDataType,
      allowedValues: definition.allowedValues,
    });

    if (!validation.valid) {
      throw new BadRequestException(
        validation.message ?? `Invalid value for keyword "${definition.code}".`,
      );
    }

    // Upsert — a CoU can only have one value per keyword definition
    return this.prisma.contextKeyword.upsert({
      where: {
        contextOfUseId_keywordDefinitionId: {
          contextOfUseId,
          keywordDefinitionId: dto.keywordDefinitionId,
        },
      },
      update: { value: dto.value },
      create: {
        contextOfUseId,
        keywordDefinitionId: dto.keywordDefinitionId,
        value: dto.value,
      },
    });
  }

  async getKeywordsForCou(contextOfUseId: string): Promise<ContextKeyword[]> {
    return this.prisma.contextKeyword.findMany({
      where: { contextOfUseId },
      include: { keywordDefinition: true },
      orderBy: { keywordDefinition: { code: "asc" } },
    });
  }

  async removeKeyword(
    contextOfUseId: string,
    keywordDefinitionId: string,
  ): Promise<void> {
    const existing = await this.prisma.contextKeyword.findUnique({
      where: {
        contextOfUseId_keywordDefinitionId: {
          contextOfUseId,
          keywordDefinitionId,
        },
      },
    });
    if (!existing) {
      throw new NotFoundException(
        `Keyword assignment not found for CoU ${contextOfUseId} / definition ${keywordDefinitionId}.`,
      );
    }

    // Check CoU is not SUSPENDED
    const cou = await this.prisma.contextOfUse.findUnique({
      where: { id: contextOfUseId },
      select: { status: true },
    });
    if (cou?.status === "SUSPENDED") {
      throw new ConflictException(
        "Keywords cannot be removed from a SUSPENDED ContextOfUse.",
      );
    }

    await this.prisma.contextKeyword.delete({
      where: {
        contextOfUseId_keywordDefinitionId: {
          contextOfUseId,
          keywordDefinitionId,
        },
      },
    });
  }
}
