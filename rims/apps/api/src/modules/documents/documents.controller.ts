import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "@rims/shared-types";
import { DocumentsService } from "./documents.service";
import { CreateFolderDto } from "./dtos/create-folder.dto";
import { QueryDocumentsDto } from "./dtos/query-documents.dto";
import { CreateDocumentDto } from "./dtos/create-document.dto";
import { UpdateDocumentDto } from "./dtos/update-document.dto";
import { AddVersionDto } from "./dtos/add-version.dto";

@Controller("documents")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // NOTE: /folders must be declared before /:id to prevent NestJS treating
  // 'folders' as an :id param value.
  @Get("folders")
  @RequirePermissions("documents.view")
  findFolders(
    @Query("parentId") parentId: string | undefined,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.documentsService.findFolders(user.tenantId, parentId);
  }

  @Post("folders")
  @RequirePermissions("documents.upload")
  createFolder(
    @Body() dto: CreateFolderDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.documentsService.createFolder(dto, user.tenantId);
  }

  @Get()
  @RequirePermissions("documents.view")
  findAll(
    @Query() query: QueryDocumentsDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.documentsService.findAll(user.tenantId, query);
  }

  @Post()
  @RequirePermissions("documents.upload")
  create(
    @Body() dto: CreateDocumentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.documentsService.create(dto, user.tenantId, user.sub);
  }

  @Get(":id")
  @RequirePermissions("documents.view")
  findOne(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.documentsService.findOne(id, user.tenantId);
  }

  @Patch(":id")
  @RequirePermissions("documents.upload")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateDocumentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.documentsService.update(id, dto, user.tenantId, user.sub);
  }

  @Post(":id/approve")
  @RequirePermissions("documents.approve")
  approve(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.documentsService.approve(id, user.tenantId, user.sub);
  }

  @Post(":id/archive")
  @RequirePermissions("documents.archive")
  archive(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.documentsService.archive(id, user.tenantId, user.sub);
  }

  @Post(":id/versions")
  @RequirePermissions("documents.upload")
  addVersion(
    @Param("id") id: string,
    @Body() dto: AddVersionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.documentsService.addVersion(id, dto, user.tenantId, user.sub);
  }

  @Get(":id/download-url")
  @RequirePermissions("documents.view")
  getDownloadUrl(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.documentsService.getDownloadUrl(id, user.tenantId);
  }
}
