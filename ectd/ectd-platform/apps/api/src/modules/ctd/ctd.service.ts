import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import {
  CtdStructureLoader,
  ICH_CTD_MODULES,
  type CtdModuleRecord,
  type CtdSectionRecord,
  type ContextDefinitionRecord,
} from "@ectd/domain";
import type {
  CtdStructurePackage,
  CtdModule,
  CtdSection,
  ContextDefinition,
} from "@prisma/client";

/**
 * CtdService — spec §13.
 *
 * Manages CTD structure packages, modules, sections, and context definitions.
 *
 * Spec §13: CTD structure is configuration.
 * The CtdStructureLoader is the domain service; this NestJS service wires
 * it to Prisma.
 *
 * Seeding CTD structure:
 *   POST /ctd/packages — register a CTD structure package entry
 *   POST /ctd/packages/:id/seed-ich-baseline — seed ICH module-level structure
 *
 * Full section/context-definition seeding requires the official ICH CTD
 * structure package to be imported (Phase 2+).
 *
 * REGULATORY_GAP: Section codes, titles, and context definition codes
 * must come from the authoritative ICH CTD structure package.
 */
@Injectable()
export class CtdService {
  private readonly loader: CtdStructureLoader;

  constructor(private readonly prisma: PrismaService) {
    this.loader = new CtdStructureLoader({
      findModules: (packageId) =>
        this.prisma.ctdModule.findMany({
          where: { packageId },
          orderBy: { displayOrder: "asc" },
        }) as Promise<CtdModuleRecord[]>,

      findSections: (moduleId) =>
        this.prisma.ctdSection.findMany({
          where: { moduleId },
          orderBy: { displayOrder: "asc" },
        }) as Promise<CtdSectionRecord[]>,

      findAllSectionsForPackage: async (packageId) => {
        const modules = await this.prisma.ctdModule.findMany({
          where: { packageId },
          select: { id: true },
        });
        const moduleIds = modules.map((m) => m.id);
        return this.prisma.ctdSection.findMany({
          where: { moduleId: { in: moduleIds } },
          orderBy: [{ moduleId: "asc" }, { displayOrder: "asc" }],
        }) as Promise<CtdSectionRecord[]>;
      },

      findContextDefinitions: (packageId) =>
        this.prisma.contextDefinition.findMany({
          where: { structurePackageId: packageId },
          orderBy: { name: "asc" },
        }) as Promise<ContextDefinitionRecord[]>,

      findContextDefinitionByCode: async (packageId, code, codeSystem) => {
        const def = await this.prisma.contextDefinition.findUnique({
          where: {
            structurePackageId_code_codeSystem: {
              structurePackageId: packageId,
              code,
              codeSystem,
            },
          },
        });
        return def as ContextDefinitionRecord | null;
      },

      findContextDefinitionById: async (id) => {
        const def = await this.prisma.contextDefinition.findUnique({
          where: { id },
        });
        return def as ContextDefinitionRecord | null;
      },
    });
  }

  // ── Package management ───────────────────────────────────────────────

  async getPackages(): Promise<CtdStructurePackage[]> {
    return this.prisma.ctdStructurePackage.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });
  }

  async getPackageById(id: string): Promise<CtdStructurePackage> {
    const pkg = await this.prisma.ctdStructurePackage.findUnique({
      where: { id },
    });
    if (!pkg)
      throw new NotFoundException(`CtdStructurePackage ${id} not found.`);
    return pkg;
  }

  async registerPackage(data: {
    name: string;
    version: string;
    standardId?: string | undefined;
    regionalSpecificationId?: string | undefined;
  }): Promise<CtdStructurePackage> {
    return this.prisma.ctdStructurePackage.create({
      data: {
        name: data.name,
        version: data.version,
        standardId: data.standardId ?? null,
        regionalSpecificationId: data.regionalSpecificationId ?? null,
        status: "ACTIVE",
      },
    });
  }

  // ── Modules ──────────────────────────────────────────────────────────

  async getModules(packageId: string): Promise<CtdModule[]> {
    await this.getPackageById(packageId);
    return this.prisma.ctdModule.findMany({
      where: { packageId },
      orderBy: { displayOrder: "asc" },
    });
  }

  /**
   * seedIchBaselineModules — seeds the five ICH CTD module entries.
   *
   * This seeds only the module level (1–5) with ICH baseline titles.
   * Section and context definition seeding requires the official ICH CTD
   * structure package to be imported.
   *
   * REGULATORY_GAP: Section codes and context definition codes within each
   * module must come from the authoritative ICH package.
   */
  async seedIchBaselineModules(packageId: string): Promise<{ seeded: number }> {
    await this.getPackageById(packageId);

    let seeded = 0;
    for (const mod of ICH_CTD_MODULES) {
      const existing = await this.prisma.ctdModule.findUnique({
        where: {
          packageId_moduleNumber: { packageId, moduleNumber: mod.moduleNumber },
        },
      });
      if (!existing) {
        await this.prisma.ctdModule.create({
          data: {
            packageId,
            moduleNumber: mod.moduleNumber,
            title: mod.title,
            displayOrder: mod.displayOrder,
          },
        });
        seeded++;
      }
    }

    return { seeded };
  }

  // ── Sections ─────────────────────────────────────────────────────────

  async getSections(packageId: string): Promise<CtdSection[]> {
    await this.getPackageById(packageId);
    const sections = await this.loader.loadSections(packageId);
    return sections as unknown as CtdSection[];
  }

  async getSectionTree(packageId: string) {
    await this.getPackageById(packageId);
    const sections = await this.loader.loadSections(packageId);
    return this.loader.buildSectionTree(sections);
  }

  async createSection(data: {
    packageId: string;
    moduleId: string;
    parentId?: string | undefined;
    sectionCode: string;
    title: string;
    level: number;
    displayOrder: number;
  }): Promise<CtdSection> {
    await this.getPackageById(data.packageId);

    // Validate moduleId belongs to package
    const module = await this.prisma.ctdModule.findFirst({
      where: { id: data.moduleId, packageId: data.packageId },
    });
    if (!module) {
      throw new BadRequestException(
        `CtdModule ${data.moduleId} does not belong to package ${data.packageId}.`,
      );
    }

    return this.prisma.ctdSection.create({
      data: {
        moduleId: data.moduleId,
        parentId: data.parentId ?? null,
        sectionCode: data.sectionCode,
        title: data.title,
        level: data.level,
        displayOrder: data.displayOrder,
      },
    });
  }

  // ── Context Definitions ──────────────────────────────────────────────

  async getContextDefinitions(packageId: string): Promise<ContextDefinition[]> {
    await this.getPackageById(packageId);
    return this.loader.loadContextDefinitions(packageId) as unknown as Promise<
      ContextDefinition[]
    >;
  }

  async getContextDefinitionById(id: string): Promise<ContextDefinition> {
    const def = await this.prisma.contextDefinition.findUnique({
      where: { id },
    });
    if (!def) throw new NotFoundException(`ContextDefinition ${id} not found.`);
    return def;
  }

  /**
   * resolveContextDefinition — finds a ContextDefinition by code+codeSystem.
   * Used by the Context of Use service to validate assignments.
   * Throws (fail closed) if not found — spec §4.5.
   */
  async resolveContextDefinition(
    packageId: string,
    code: string,
    codeSystem: string,
  ): Promise<ContextDefinition> {
    const def = await this.loader.resolveContextDefinition(
      packageId,
      code,
      codeSystem,
    );
    return def as unknown as ContextDefinition;
  }

  async createContextDefinition(data: {
    structurePackageId: string;
    ctdSectionId: string;
    code: string;
    codeSystem: string;
    name: string;
    description?: string | undefined;
  }): Promise<ContextDefinition> {
    await this.getPackageById(data.structurePackageId);

    // Validate ctdSectionId belongs to this package
    const modules = await this.prisma.ctdModule.findMany({
      where: { packageId: data.structurePackageId },
      select: { id: true },
    });
    const section = await this.prisma.ctdSection.findFirst({
      where: {
        id: data.ctdSectionId,
        moduleId: { in: modules.map((m) => m.id) },
      },
    });
    if (!section) {
      throw new BadRequestException(
        `CtdSection ${data.ctdSectionId} does not belong to package ${data.structurePackageId}.`,
      );
    }

    return this.prisma.contextDefinition.create({
      data: {
        structurePackageId: data.structurePackageId,
        ctdSectionId: data.ctdSectionId,
        code: data.code,
        codeSystem: data.codeSystem,
        name: data.name,
        description: data.description ?? null,
      },
    });
  }
}
