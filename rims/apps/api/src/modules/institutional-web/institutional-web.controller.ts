import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
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
import { WebsiteService } from "./website.service";
import { PagesService } from "./pages.service";
import { ContentService } from "./content.service";
import { NavigationService } from "./navigation.service";
import { MediaService } from "./media.service";
import { DomainsService } from "./domains.service";
import { PublicationLinksService } from "./publication-links.service";
import {
  UpdateWebsiteSettingsDto,
  UpdateBrandingDto,
} from "./dtos/website.dto";
import {
  CreatePageDto,
  UpdatePageDto,
  QueryPagesDto,
  AddSectionDto,
  UpdateSectionDto,
} from "./dtos/pages.dto";
import {
  CreateNewsDto,
  UpdateNewsDto,
  CreateEventDto,
  UpdateEventDto,
  CreateOpportunityDto,
  UpdateOpportunityDto,
  CreateTeamProfileDto,
  UpdateTeamProfileDto,
  CreatePartnerDto,
  UpdatePartnerDto,
  CreateResourceDto,
  UpdateResourceDto,
  CreateFaqDto,
  UpdateFaqDto,
} from "./dtos/content.dto";
import { ReplaceNavigationItemsDto } from "./dtos/navigation.dto";
import {
  CreateMediaDto,
  UpdateMediaDto,
  QueryMediaDto,
} from "./dtos/media.dto";
import { CreateDomainDto } from "./dtos/domains.dto";
import { LinkManuscriptDto } from "./dtos/publication-links.dto";
import { QueryContactSubmissionsDto } from "./dtos/contact.dto";

@Controller("institutional-web")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InstitutionalWebController {
  constructor(
    private readonly websiteService: WebsiteService,
    private readonly pagesService: PagesService,
    private readonly contentService: ContentService,
    private readonly navigationService: NavigationService,
    private readonly mediaService: MediaService,
    private readonly domainsService: DomainsService,
    private readonly publicationLinksService: PublicationLinksService,
  ) {}

  // ─── Website ─────────────────────────────────────────────────────────────

  @Get()
  @RequirePermissions("website.view")
  getWebsite(@CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.websiteService.getWebsite(user.tenantId);
  }

  @Post("provision")
  @RequirePermissions("website.settings.manage")
  provisionWebsite(@CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.websiteService.provisionWebsite(user.tenantId);
  }

  @Patch("settings")
  @RequirePermissions("website.settings.manage")
  updateSettings(
    @Body() dto: UpdateWebsiteSettingsDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.websiteService.updateSettings(user.tenantId, dto, user.sub);
  }

  @Get("branding")
  @RequirePermissions("website.view")
  getBranding(@CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.websiteService.getBranding(user.tenantId);
  }

  @Patch("branding")
  @RequirePermissions("website.branding.manage")
  updateBranding(
    @Body() dto: UpdateBrandingDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.websiteService.updateBranding(user.tenantId, dto, user.sub);
  }

  @Post("publish")
  @RequirePermissions("website.content.publish")
  publishWebsite(@CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.websiteService.publishWebsite(user.tenantId, user.sub);
  }

  // ─── Pages ───────────────────────────────────────────────────────────────

  @Get("pages")
  @RequirePermissions("website.view")
  findPages(@Query() query: QueryPagesDto, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.pagesService.findAll(user.tenantId, query);
  }

  @Post("pages")
  @RequirePermissions("website.pages.create")
  createPage(@Body() dto: CreatePageDto, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.pagesService.create(user.tenantId, dto, user.sub);
  }

  @Get("pages/:id")
  @RequirePermissions("website.view")
  findPage(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.pagesService.findOne(id, user.tenantId);
  }

  @Patch("pages/:id")
  @RequirePermissions("website.pages.edit")
  updatePage(
    @Param("id") id: string,
    @Body() dto: UpdatePageDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.pagesService.update(id, user.tenantId, dto, user.sub);
  }

  @Delete("pages/:id")
  @RequirePermissions("website.pages.delete")
  archivePage(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.pagesService.archive(id, user.tenantId, user.sub);
  }

  @Post("pages/:id/submit")
  @RequirePermissions("website.content.submit")
  submitPage(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.pagesService.submit(id, user.tenantId, user.sub);
  }

  @Post("pages/:id/approve")
  @RequirePermissions("website.content.approve")
  approvePage(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.pagesService.approve(id, user.tenantId, user.sub);
  }

  @Post("pages/:id/publish")
  @RequirePermissions("website.content.publish")
  publishPage(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.pagesService.publish(id, user.tenantId, user.sub);
  }

  @Post("pages/:id/unpublish")
  @RequirePermissions("website.content.unpublish")
  unpublishPage(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.pagesService.unpublish(id, user.tenantId, user.sub);
  }

  @Get("pages/:id/sections")
  @RequirePermissions("website.view")
  getSections(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.pagesService.getSections(id, user.tenantId);
  }

  @Post("pages/:id/sections")
  @RequirePermissions("website.pages.edit")
  addSection(
    @Param("id") id: string,
    @Body() dto: AddSectionDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.pagesService.addSection(id, user.tenantId, dto, user.sub);
  }

  @Patch("pages/:id/sections/:sid")
  @RequirePermissions("website.pages.edit")
  updateSection(
    @Param("id") id: string,
    @Param("sid") sid: string,
    @Body() dto: UpdateSectionDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.pagesService.updateSection(
      sid,
      id,
      user.tenantId,
      dto,
      user.sub,
    );
  }

  @Delete("pages/:id/sections/:sid")
  @RequirePermissions("website.pages.edit")
  removeSection(
    @Param("id") id: string,
    @Param("sid") sid: string,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.pagesService.removeSection(sid, id, user.tenantId, user.sub);
  }

  @Get("pages/:id/revisions")
  @RequirePermissions("website.view")
  getRevisions(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.pagesService.getRevisions(id, user.tenantId);
  }

  // ─── Navigation ──────────────────────────────────────────────────────────

  @Get("navigation")
  @RequirePermissions("website.view")
  getNavigation(@CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.navigationService.findAll(user.tenantId);
  }

  @Put("navigation/:id/items")
  @RequirePermissions("website.navigation.manage")
  replaceNavigationItems(
    @Param("id") id: string,
    @Body() dto: ReplaceNavigationItemsDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.navigationService.replaceItems(
      id,
      user.tenantId,
      dto,
      user.sub,
    );
  }

  // ─── Media ───────────────────────────────────────────────────────────────

  @Get("media")
  @RequirePermissions("website.view")
  findMedia(@Query() query: QueryMediaDto, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.mediaService.findAll(user.tenantId, query);
  }

  @Post("media/upload-url")
  @RequirePermissions("website.media.upload")
  getMediaUploadUrl(
    @Body() dto: { fileName: string; mimeType: string },
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.mediaService.getUploadUrl(user.tenantId, dto.fileName, dto.mimeType);
  }

  @Post("media")
  @RequirePermissions("website.media.upload")
  createMedia(@Body() dto: CreateMediaDto, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.mediaService.create(user.tenantId, dto, user.sub);
  }

  @Patch("media/:id")
  @RequirePermissions("website.media.upload")
  updateMedia(
    @Param("id") id: string,
    @Body() dto: UpdateMediaDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.mediaService.update(id, user.tenantId, dto, user.sub);
  }

  @Delete("media/:id")
  @RequirePermissions("website.media.delete")
  deleteMedia(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.mediaService.delete(id, user.tenantId, user.sub);
  }

  // ─── Domains ─────────────────────────────────────────────────────────────

  @Get("domains")
  @RequirePermissions("website.domains.manage")
  findDomains(@CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.domainsService.findAll(user.tenantId);
  }

  @Post("domains")
  @RequirePermissions("website.domains.manage")
  createDomain(@Body() dto: CreateDomainDto, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.domainsService.create(user.tenantId, dto, user.sub);
  }

  @Post("domains/:id/verify")
  @RequirePermissions("website.domains.manage")
  verifyDomain(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.domainsService.verify(id, user.tenantId, user.sub);
  }

  @Post("domains/:id/set-primary")
  @RequirePermissions("website.domains.manage")
  setPrimaryDomain(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.domainsService.setPrimary(id, user.tenantId, user.sub);
  }

  // ─── News ────────────────────────────────────────────────────────────────

  @Get("news")
  @RequirePermissions("website.view")
  findNews(
    @Query() query: { page?: number; pageSize?: number; status?: string },
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.findNews(user.tenantId, query);
  }

  @Post("news")
  @RequirePermissions("website.content.submit")
  createNews(@Body() dto: CreateNewsDto, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.contentService.createNews(user.tenantId, dto, user.sub);
  }

  @Patch("news/:id")
  @RequirePermissions("website.pages.edit")
  updateNews(
    @Param("id") id: string,
    @Body() dto: UpdateNewsDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.updateNews(id, user.tenantId, dto, user.sub);
  }

  @Post("news/:id/publish")
  @RequirePermissions("website.content.publish")
  publishNews(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.contentService.publishContent(
      "news",
      id,
      user.tenantId,
      user.sub,
    );
  }

  @Post("news/:id/unpublish")
  @RequirePermissions("website.content.unpublish")
  unpublishNews(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.contentService.unpublishContent(
      "news",
      id,
      user.tenantId,
      user.sub,
    );
  }

  // ─── Events ──────────────────────────────────────────────────────────────

  @Get("events")
  @RequirePermissions("website.view")
  findEvents(
    @Query() query: { page?: number; pageSize?: number; status?: string },
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.findEvents(user.tenantId, query);
  }

  @Post("events")
  @RequirePermissions("website.content.submit")
  createEvent(@Body() dto: CreateEventDto, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.contentService.createEvent(user.tenantId, dto, user.sub);
  }

  @Patch("events/:id")
  @RequirePermissions("website.pages.edit")
  updateEvent(
    @Param("id") id: string,
    @Body() dto: UpdateEventDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.updateEvent(id, user.tenantId, dto, user.sub);
  }

  @Post("events/:id/publish")
  @RequirePermissions("website.content.publish")
  publishEvent(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.contentService.publishContent(
      "event",
      id,
      user.tenantId,
      user.sub,
    );
  }

  @Post("events/:id/unpublish")
  @RequirePermissions("website.content.unpublish")
  unpublishEvent(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.contentService.unpublishContent(
      "event",
      id,
      user.tenantId,
      user.sub,
    );
  }

  // ─── Opportunities ───────────────────────────────────────────────────────

  @Get("opportunities")
  @RequirePermissions("website.view")
  findOpportunities(
    @Query()
    query: { page?: number; pageSize?: number; status?: string; type?: string },
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.findOpportunities(user.tenantId, query);
  }

  @Post("opportunities")
  @RequirePermissions("website.content.submit")
  createOpportunity(
    @Body() dto: CreateOpportunityDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.createOpportunity(user.tenantId, dto, user.sub);
  }

  @Patch("opportunities/:id")
  @RequirePermissions("website.pages.edit")
  updateOpportunity(
    @Param("id") id: string,
    @Body() dto: UpdateOpportunityDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.updateOpportunity(
      id,
      user.tenantId,
      dto,
      user.sub,
    );
  }

  @Post("opportunities/:id/publish")
  @RequirePermissions("website.content.publish")
  publishOpportunity(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.contentService.publishContent(
      "opportunity",
      id,
      user.tenantId,
      user.sub,
    );
  }

  @Post("opportunities/:id/unpublish")
  @RequirePermissions("website.content.unpublish")
  unpublishOpportunity(
    @Param("id") id: string,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.unpublishContent(
      "opportunity",
      id,
      user.tenantId,
      user.sub,
    );
  }

  // ─── Team ────────────────────────────────────────────────────────────────

  @Get("team")
  @RequirePermissions("website.view")
  findTeam(
    @Query() query: { page?: number; pageSize?: number; status?: string },
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.findTeamProfiles(user.tenantId, query);
  }

  @Post("team")
  @RequirePermissions("website.content.submit")
  createTeamProfile(
    @Body() dto: CreateTeamProfileDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.createTeamProfile(user.tenantId, dto, user.sub);
  }

  @Patch("team/:id")
  @RequirePermissions("website.pages.edit")
  updateTeamProfile(
    @Param("id") id: string,
    @Body() dto: UpdateTeamProfileDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.updateTeamProfile(
      id,
      user.tenantId,
      dto,
      user.sub,
    );
  }

  @Post("team/:id/publish")
  @RequirePermissions("website.content.publish")
  publishTeamProfile(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.contentService.publishContent(
      "team",
      id,
      user.tenantId,
      user.sub,
    );
  }

  // ─── Partners ────────────────────────────────────────────────────────────

  @Get("partners")
  @RequirePermissions("website.view")
  findPartners(
    @Query() query: { page?: number; pageSize?: number; status?: string },
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.findPartners(user.tenantId, query);
  }

  @Post("partners")
  @RequirePermissions("website.content.submit")
  createPartner(
    @Body() dto: CreatePartnerDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.createPartner(user.tenantId, dto, user.sub);
  }

  @Patch("partners/:id")
  @RequirePermissions("website.pages.edit")
  updatePartner(
    @Param("id") id: string,
    @Body() dto: UpdatePartnerDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.updatePartner(id, user.tenantId, dto, user.sub);
  }

  @Post("partners/:id/publish")
  @RequirePermissions("website.content.publish")
  publishPartner(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.contentService.publishContent(
      "partner",
      id,
      user.tenantId,
      user.sub,
    );
  }

  // ─── Resources ───────────────────────────────────────────────────────────

  @Get("resources")
  @RequirePermissions("website.view")
  findResources(
    @Query() query: { page?: number; pageSize?: number; status?: string },
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.findResources(user.tenantId, query);
  }

  @Post("resources")
  @RequirePermissions("website.content.submit")
  createResource(
    @Body() dto: CreateResourceDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.createResource(user.tenantId, dto, user.sub);
  }

  @Patch("resources/:id")
  @RequirePermissions("website.pages.edit")
  updateResource(
    @Param("id") id: string,
    @Body() dto: UpdateResourceDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.updateResource(id, user.tenantId, dto, user.sub);
  }

  @Post("resources/:id/publish")
  @RequirePermissions("website.content.publish")
  publishResource(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.contentService.publishContent(
      "resource",
      id,
      user.tenantId,
      user.sub,
    );
  }

  // ─── FAQs ────────────────────────────────────────────────────────────────

  @Get("faqs")
  @RequirePermissions("website.view")
  findFaqs(
    @Query() query: { page?: number; pageSize?: number; status?: string },
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.findFaqs(user.tenantId, query);
  }

  @Post("faqs")
  @RequirePermissions("website.content.submit")
  createFaq(@Body() dto: CreateFaqDto, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.contentService.createFaq(user.tenantId, dto, user.sub);
  }

  @Patch("faqs/:id")
  @RequirePermissions("website.pages.edit")
  updateFaq(
    @Param("id") id: string,
    @Body() dto: UpdateFaqDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.contentService.updateFaq(id, user.tenantId, dto, user.sub);
  }

  @Post("faqs/:id/publish")
  @RequirePermissions("website.content.publish")
  publishFaq(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.contentService.publishContent(
      "faq",
      id,
      user.tenantId,
      user.sub,
    );
  }

  // ─── Publication Links ───────────────────────────────────────────────────

  @Get("publication-links")
  @RequirePermissions("website.view")
  findPublicationLinks(
    @Query() query: { page?: number; pageSize?: number; status?: string },
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.publicationLinksService.findAll(user.tenantId, query);
  }

  @Post("publication-links")
  @RequirePermissions("website.content.submit")
  linkPublication(
    @Body() dto: LinkManuscriptDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.publicationLinksService.link(user.tenantId, dto, user.sub);
  }

  @Post("publication-links/:id/approve")
  @RequirePermissions("website.content.approve")
  approvePublication(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.publicationLinksService.approve(id, user.tenantId, user.sub);
  }

  @Post("publication-links/:id/publish")
  @RequirePermissions("website.content.publish")
  publishPublication(@Param("id") id: string, @CurrentUser() user: JwtPayload) : Promise<unknown> {
    return this.publicationLinksService.publish(id, user.tenantId, user.sub);
  }

  @Post("publication-links/:id/unpublish")
  @RequirePermissions("website.content.unpublish")
  unpublishPublication(
    @Param("id") id: string,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.publicationLinksService.unpublish(id, user.tenantId, user.sub);
  }

  // ─── Contact Submissions (authenticated only, never public) ──────────────

  @Get("contact-submissions")
  @RequirePermissions("website.content.review")
  findContactSubmissions(
    @Query() query: QueryContactSubmissionsDto,
    @CurrentUser() user: JwtPayload,
  ) : Promise<unknown> {
    return this.websiteService.findContactSubmissions(user.tenantId, query);
  }
}
