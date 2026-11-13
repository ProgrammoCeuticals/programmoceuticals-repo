import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
  Response,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiQuery,
} from "@nestjs/swagger";
import type { Response as Res } from "express";
import { DocumentsService } from "./documents.service";
import {
  CreateDocumentDto,
  CreateDocumentVersionDto,
  ReuseDocumentDto,
} from "./dto/document.dto";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OrganizationScopeGuard } from "../../common/guards/organization-scope.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtPayload } from "../auth/auth.service";

/**
 * Documents controller — spec §16, §17, §29.
 *
 * File uploads use multipart/form-data.
 * Downloads stream the file — never expose storage paths — spec §16.
 */
@ApiTags("Documents")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, OrganizationScopeGuard)
@Controller("documents")
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a document record (metadata only, no file yet)",
  })
  create(@Body() dto: CreateDocumentDto, @CurrentUser() user: JwtPayload) {
    return this.service.create(user.orgId!, dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: "List documents (paginated, optionally scoped to application)" })
  @ApiQuery({ name: "applicationId", required: false })
  findAll(
    @Query() pagination: PaginationDto,
    @Query("applicationId") applicationId?: string,
  ) {
    return this.service.findAll(pagination.page, pagination.pageSize, applicationId);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get document by ID (includes current version summary)",
  })
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Get(":id/versions")
  @ApiOperation({ summary: "List all immutable versions of a document" })
  getVersions(@Param("id") id: string) {
    return this.service.getVersions(id);
  }

  @Get(":id/history")
  @ApiOperation({ summary: "Audit trail for this document (paginated)" })
  getHistory(@Param("id") id: string, @Query() pagination: PaginationDto) {
    return this.service.getHistory(id, pagination.page, pagination.pageSize);
  }

  /**
   * Upload a new version via multipart/form-data.
   * Pipeline: MIME validation → checksum → immutable store → persist.
   * spec §16.
   */
  @Post(":id/versions")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    summary: "Upload a new immutable document version",
    description:
      "Runs the full upload pipeline: MIME/magic-byte validation, " +
      "checksum computation, immutable storage. Physical file is never " +
      "overwritten once stored.",
  })
  async uploadVersion(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateDocumentVersionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    if (!file) {
      throw new Error('No file uploaded. Send file as multipart field "file".');
    }
    return this.service.uploadVersion(
      id,
      user.orgId!,
      file.buffer,
      dto,
      user.sub,
    );
  }

  @Post(":id/reuse")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      "[Command] Validate and record document reuse in a new submission unit",
    description:
      "Document reuse is distinct from lifecycle replacement — spec §17. " +
      "Validates structural prerequisites before recording.",
  })
  reuse(
    @Param("id") id: string,
    @Body() dto: ReuseDocumentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.reuse(id, user.orgId!, dto, user.sub);
  }

  @Get(":id/download-ref")
  @ApiOperation({
    summary:
      "Get download reference metadata (availability check, no raw path exposed)",
    description:
      "Returns file metadata and availability. " +
      "Never exposes storage paths — spec §16.",
  })
  getDownloadRef(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.service.getDownloadRef(id, user.orgId!, user.sub);
  }

  @Get(":id/download")
  @ApiOperation({ summary: "Stream document file content (current version)" })
  async download(
    @Param("id") id: string,
    @CurrentUser() user: JwtPayload,
    @Response({ passthrough: true }) res: Res,
  ): Promise<StreamableFile> {
    const { stream, filename, mimeType } = await this.service.stream(
      id,
      user.orgId!,
      user.sub,
    );

    res.set({
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      // No Cache-Control public — documents are controlled access — spec §43
      "Cache-Control": "private, no-store",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new StreamableFile(stream as any);
  }
}
