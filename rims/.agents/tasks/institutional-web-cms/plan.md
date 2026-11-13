# Implementation Plan — RIMS Institutional Web Presence & CMS

> Repo root: `/Users/macbookpro/Desktop/ProgrammoCeuticals/rims`
> Spec: `docs/RIMS_Institutional_Web_Presence_CMS_Specification.md`
> Build: `pnpm turbo run build` (root) · `pnpm prisma:validate` (schema) · `pnpm prisma:seed` (seed)
> Test: `pnpm turbo run test` · per-app: `pnpm --filter @rims/api test` · `pnpm --filter @rims/web test`

---

## Step 1 — Prisma schema: new enums, back-relations and all CMS models

Add the new enums, the two back-relations on existing models, and all
new models to `prisma/schema.prisma`.  Do **not** touch or rename any
existing model or field.

### 1a  Add back-relations to existing models

In `Tenant` (after the existing `analyticsSnapshots` relation line):
```
  institutionWebsite InstitutionWebsite?
```
In `Manuscript` (after the existing `reviews` relation line):
```
  websitePublicationLinks WebsitePublicationLink[]
```

### 1b  New enums (append after the existing `DocumentStatus` enum block)

```prisma
enum WebsiteStatus {
  SETUP
  DRAFT
  PUBLISHED
  SUSPENDED

  @@map("website_status")
}

enum WebsitePageStatus {
  DRAFT
  SUBMITTED
  CHANGES_REQUESTED
  APPROVED
  SCHEDULED
  PUBLISHED
  UNPUBLISHED
  ARCHIVED

  @@map("website_page_status")
}

enum WebsitePageType {
  HOME
  ABOUT
  RESEARCH
  PUBLICATIONS
  OPPORTUNITIES
  NEWS
  EVENTS
  TEAM
  PARTNERS
  RESOURCES
  CONTACT
  FAQ
  CUSTOM

  @@map("website_page_type")
}

enum WebsiteContentStatus {
  DRAFT
  SUBMITTED
  CHANGES_REQUESTED
  APPROVED
  PUBLISHED
  UNPUBLISHED
  ARCHIVED

  @@map("website_content_status")
}

enum OpportunityType {
  VACANCY
  RESEARCH_ASSISTANT
  INTERNSHIP
  FELLOWSHIP
  GRADUATE
  VOLUNTEER
  CALL_FOR_PAPERS
  CALL_FOR_COLLABORATION
  OTHER

  @@map("opportunity_type")
}

enum DomainVerificationStatus {
  PENDING
  VERIFIED
  FAILED

  @@map("domain_verification_status")
}
```

### 1c  New models (append after the last existing model, `AnalyticsSnapshot`)

Append all models in this exact order.  Every model that owns a
`websiteId` FK must also carry `tenantId String @map("tenant_id")` for
direct RLS queries (the website itself carries the root tenant FK; all
children duplicate it for performance and isolation safety).

```prisma
// ─── Institutional Web Presence ───────────────────────────────────────────────

model InstitutionWebsite {
  id               String        @id @default(uuid())
  tenantId         String        @unique @map("tenant_id")
  name             String
  status           WebsiteStatus @default(SETUP)
  defaultLocale    String        @default("en") @map("default_locale")
  timezone         String        @default("UTC")
  primaryDomainId  String?       @map("primary_domain_id")
  createdAt        DateTime      @default(now()) @map("created_at")
  updatedAt        DateTime      @updatedAt @map("updated_at")

  tenant            Tenant                   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  branding          WebsiteBranding?
  themeSelection    WebsiteThemeSelection?
  pages             WebsitePage[]
  navigations       WebsiteNavigation[]
  media             WebsiteMedia[]
  domains           WebsiteDomain[]
  news              WebsiteNews[]
  events            WebsiteEvent[]
  opportunities     WebsiteOpportunity[]
  teamProfiles      WebsiteTeamProfile[]
  partners          WebsitePartner[]
  resources         WebsiteResource[]
  faqs              WebsiteFaq[]
  publicationLinks  WebsitePublicationLink[]
  opportunityLinks  WebsiteOpportunityLink[]
  contactSubmissions WebsiteContactSubmission[]

  @@map("institution_websites")
}

model WebsiteBranding {
  id                 String   @id @default(uuid())
  tenantId           String   @map("tenant_id")
  websiteId          String   @unique @map("website_id")
  logoUrl            String?  @map("logo_url")
  logoDarkUrl        String?  @map("logo_dark_url")
  faviconUrl         String?  @map("favicon_url")
  tagline            String?
  shortDescription   String?  @map("short_description")
  fullDescription    String?  @map("full_description")
  mission            String?
  vision             String?
  primaryColor       String?  @map("primary_color")
  secondaryColor     String?  @map("secondary_color")
  accentColor        String?  @map("accent_color")
  typographyPreset   String?  @map("typography_preset")
  contactEmail       String?  @map("contact_email")
  contactPhone       String?  @map("contact_phone")
  address            String?
  socialLinksJson    Json?    @map("social_links_json")
  copyrightStatement String?  @map("copyright_statement")
  updatedById        String?  @map("updated_by_id")
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  website InstitutionWebsite @relation(fields: [websiteId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@map("website_brandings")
}

model WebsiteThemeSelection {
  id           String   @id @default(uuid())
  tenantId     String   @map("tenant_id")
  websiteId    String   @unique @map("website_id")
  themeKey     String   @map("theme_key")
  themeVersion String   @default("1.0") @map("theme_version")
  configJson   Json?    @map("config_json")
  appliedById  String?  @map("applied_by_id")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  website InstitutionWebsite @relation(fields: [websiteId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@map("website_theme_selections")
}

model WebsitePage {
  id                String            @id @default(uuid())
  tenantId          String            @map("tenant_id")
  websiteId         String            @map("website_id")
  title             String
  publicTitle       String?           @map("public_title")
  slug              String
  pageType          WebsitePageType   @default(CUSTOM) @map("page_type")
  summary           String?
  featuredMediaId   String?           @map("featured_media_id")
  status            WebsitePageStatus @default(DRAFT)
  seoTitle          String?           @map("seo_title")
  seoDescription    String?           @map("seo_description")
  socialImageUrl    String?           @map("social_image_url")
  robotsIndex       Boolean           @default(true) @map("robots_index")
  authorId          String?           @map("author_id")
  reviewerId        String?           @map("reviewer_id")
  approverId        String?           @map("approver_id")
  publisherId       String?           @map("publisher_id")
  publishedAt       DateTime?         @map("published_at")
  scheduledAt       DateTime?         @map("scheduled_at")
  unpublishedAt     DateTime?         @map("unpublished_at")
  archivedAt        DateTime?         @map("archived_at")
  createdAt         DateTime          @default(now()) @map("created_at")
  updatedAt         DateTime          @updatedAt @map("updated_at")

  website   InstitutionWebsite     @relation(fields: [websiteId], references: [id], onDelete: Cascade)
  sections  WebsitePageSection[]
  revisions WebsitePageRevision[]

  @@unique([websiteId, slug])
  @@index([tenantId, websiteId, status])
  @@map("website_pages")
}

model WebsitePageSection {
  id         String   @id @default(uuid())
  tenantId   String   @map("tenant_id")
  pageId     String   @map("page_id")
  sectionType String  @map("section_type")
  sortOrder  Int      @default(0) @map("sort_order")
  configJson Json     @map("config_json")
  isVisible  Boolean  @default(true) @map("is_visible")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  page WebsitePage @relation(fields: [pageId], references: [id], onDelete: Cascade)

  @@index([tenantId, pageId])
  @@map("website_page_sections")
}

model WebsitePageRevision {
  id              String   @id @default(uuid())
  tenantId        String   @map("tenant_id")
  pageId          String   @map("page_id")
  revisionNumber  Int      @map("revision_number")
  contentSnapshot Json     @map("content_snapshot")
  changeSummary   String?  @map("change_summary")
  createdById     String?  @map("created_by_id")
  createdAt       DateTime @default(now()) @map("created_at")

  page WebsitePage @relation(fields: [pageId], references: [id], onDelete: Cascade)

  @@unique([pageId, revisionNumber])
  @@index([tenantId, pageId])
  @@map("website_page_revisions")
}

model WebsiteNavigation {
  id        String   @id @default(uuid())
  tenantId  String   @map("tenant_id")
  websiteId String   @map("website_id")
  name      String
  location  String   // primary | footer | utility
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  website InstitutionWebsite      @relation(fields: [websiteId], references: [id], onDelete: Cascade)
  items   WebsiteNavigationItem[]

  @@unique([websiteId, location])
  @@index([tenantId, websiteId])
  @@map("website_navigations")
}

model WebsiteNavigationItem {
  id           String   @id @default(uuid())
  tenantId     String   @map("tenant_id")
  navigationId String   @map("navigation_id")
  parentId     String?  @map("parent_id")
  label        String
  linkType     String   @map("link_type")  // internal | external
  pageId       String?  @map("page_id")
  externalUrl  String?  @map("external_url")
  sortOrder    Int      @default(0) @map("sort_order")
  isVisible    Boolean  @default(true) @map("is_visible")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  navigation WebsiteNavigation      @relation(fields: [navigationId], references: [id], onDelete: Cascade)
  parent     WebsiteNavigationItem? @relation("NavItemParent", fields: [parentId], references: [id])
  children   WebsiteNavigationItem[] @relation("NavItemParent")

  @@index([tenantId, navigationId])
  @@map("website_navigation_items")
}

model WebsiteMedia {
  id            String   @id @default(uuid())
  tenantId      String   @map("tenant_id")
  websiteId     String   @map("website_id")
  storageKey    String   @map("storage_key")
  fileName      String   @map("file_name")
  mimeType      String   @map("mime_type")
  fileSizeBytes Int      @map("file_size_bytes")
  width         Int?
  height        Int?
  altText       String?  @map("alt_text")
  caption       String?
  credit        String?
  isPublic      Boolean  @default(false) @map("is_public")
  uploadedById  String?  @map("uploaded_by_id")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  website InstitutionWebsite @relation(fields: [websiteId], references: [id], onDelete: Cascade)

  @@index([tenantId, websiteId])
  @@map("website_media")
}

model WebsiteDomain {
  id                  String                   @id @default(uuid())
  tenantId            String                   @map("tenant_id")
  websiteId           String                   @map("website_id")
  hostname            String                   @unique
  verificationStatus  DomainVerificationStatus @default(PENDING) @map("verification_status")
  verificationToken   String?                  @map("verification_token")
  isPrimary           Boolean                  @default(false) @map("is_primary")
  tlsStatus           String?                  @map("tls_status")
  verifiedAt          DateTime?                @map("verified_at")
  createdAt           DateTime                 @default(now()) @map("created_at")
  updatedAt           DateTime                 @updatedAt @map("updated_at")

  website InstitutionWebsite @relation(fields: [websiteId], references: [id], onDelete: Cascade)

  @@index([tenantId, websiteId])
  @@map("website_domains")
}

model WebsiteNews {
  id              String               @id @default(uuid())
  tenantId        String               @map("tenant_id")
  websiteId       String               @map("website_id")
  title           String
  slug            String
  summary         String?
  body            String?
  featuredImageUrl String?             @map("featured_image_url")
  category        String?
  tags            String[]
  authorId        String?              @map("author_id")
  status          WebsiteContentStatus @default(DRAFT)
  publishedAt     DateTime?            @map("published_at")
  seoTitle        String?              @map("seo_title")
  seoDescription  String?              @map("seo_description")
  createdAt       DateTime             @default(now()) @map("created_at")
  updatedAt       DateTime             @updatedAt @map("updated_at")

  website InstitutionWebsite @relation(fields: [websiteId], references: [id], onDelete: Cascade)

  @@unique([websiteId, slug])
  @@index([tenantId, websiteId, status])
  @@map("website_news")
}

model WebsiteEvent {
  id                String               @id @default(uuid())
  tenantId          String               @map("tenant_id")
  websiteId         String               @map("website_id")
  title             String
  slug              String
  summary           String?
  description       String?
  category          String?
  startDatetime     DateTime             @map("start_datetime")
  endDatetime       DateTime?            @map("end_datetime")
  timezone          String               @default("UTC")
  venue             String?
  isOnline          Boolean              @default(false) @map("is_online")
  registrationUrl   String?              @map("registration_url")
  featuredImageUrl  String?              @map("featured_image_url")
  status            WebsiteContentStatus @default(DRAFT)
  publishedAt       DateTime?            @map("published_at")
  createdAt         DateTime             @default(now()) @map("created_at")
  updatedAt         DateTime             @updatedAt @map("updated_at")

  website InstitutionWebsite @relation(fields: [websiteId], references: [id], onDelete: Cascade)

  @@unique([websiteId, slug])
  @@index([tenantId, websiteId, status])
  @@map("website_events")
}

model WebsiteOpportunity {
  id                  String               @id @default(uuid())
  tenantId            String               @map("tenant_id")
  websiteId           String               @map("website_id")
  title               String
  slug                String
  opportunityType     OpportunityType      @map("opportunity_type")
  summary             String?
  body                String?
  department          String?
  location            String?
  isRemote            Boolean              @default(false) @map("is_remote")
  applicationUrl      String?              @map("application_url")
  openingDate         DateTime?            @map("opening_date") @db.Date
  closingDate         DateTime?            @map("closing_date") @db.Date
  status              WebsiteContentStatus @default(DRAFT)
  publishedAt         DateTime?            @map("published_at")
  createdAt           DateTime             @default(now()) @map("created_at")
  updatedAt           DateTime             @updatedAt @map("updated_at")

  website InstitutionWebsite @relation(fields: [websiteId], references: [id], onDelete: Cascade)

  @@unique([websiteId, slug])
  @@index([tenantId, websiteId, status, opportunityType])
  @@map("website_opportunities")
}

model WebsiteTeamProfile {
  id               String               @id @default(uuid())
  tenantId         String               @map("tenant_id")
  websiteId        String               @map("website_id")
  employeeId       String?              @map("employee_id")
  displayName      String               @map("display_name")
  role             String?
  department       String?
  biography        String?
  photoUrl         String?              @map("photo_url")
  qualifications   String?
  professionalLinksJson Json?           @map("professional_links_json")
  sortOrder        Int                  @default(0) @map("sort_order")
  status           WebsiteContentStatus @default(DRAFT)
  publishedAt      DateTime?            @map("published_at")
  createdAt        DateTime             @default(now()) @map("created_at")
  updatedAt        DateTime             @updatedAt @map("updated_at")

  website InstitutionWebsite @relation(fields: [websiteId], references: [id], onDelete: Cascade)

  @@index([tenantId, websiteId, status])
  @@map("website_team_profiles")
}

model WebsitePartner {
  id              String               @id @default(uuid())
  tenantId        String               @map("tenant_id")
  websiteId       String               @map("website_id")
  name            String
  logoUrl         String?              @map("logo_url")
  description     String?
  websiteUrl      String?              @map("website_url")
  partnershipType String?              @map("partnership_type")
  sortOrder       Int                  @default(0) @map("sort_order")
  status          WebsiteContentStatus @default(DRAFT)
  publishedAt     DateTime?            @map("published_at")
  createdAt       DateTime             @default(now()) @map("created_at")
  updatedAt       DateTime             @updatedAt @map("updated_at")

  website InstitutionWebsite @relation(fields: [websiteId], references: [id], onDelete: Cascade)

  @@index([tenantId, websiteId, status])
  @@map("website_partners")
}

model WebsiteResource {
  id              String               @id @default(uuid())
  tenantId        String               @map("tenant_id")
  websiteId       String               @map("website_id")
  title           String
  description     String?
  fileKey         String?              @map("file_key")
  fileName        String?              @map("file_name")
  mimeType        String?              @map("mime_type")
  fileSizeBytes   Int?                 @map("file_size_bytes")
  category        String?
  publicDownload  Boolean              @default(false) @map("public_download")
  status          WebsiteContentStatus @default(DRAFT)
  publishedAt     DateTime?            @map("published_at")
  createdAt       DateTime             @default(now()) @map("created_at")
  updatedAt       DateTime             @updatedAt @map("updated_at")

  website InstitutionWebsite @relation(fields: [websiteId], references: [id], onDelete: Cascade)

  @@index([tenantId, websiteId, status])
  @@map("website_resources")
}

model WebsiteFaq {
  id        String               @id @default(uuid())
  tenantId  String               @map("tenant_id")
  websiteId String               @map("website_id")
  question  String
  answer    String
  category  String?
  sortOrder Int                  @default(0) @map("sort_order")
  status    WebsiteContentStatus @default(DRAFT)
  createdAt DateTime             @default(now()) @map("created_at")
  updatedAt DateTime             @updatedAt @map("updated_at")

  website InstitutionWebsite @relation(fields: [websiteId], references: [id], onDelete: Cascade)

  @@index([tenantId, websiteId, status])
  @@map("website_faqs")
}

model WebsitePublicationLink {
  id                  String               @id @default(uuid())
  tenantId            String               @map("tenant_id")
  websiteId           String               @map("website_id")
  manuscriptId        String               @map("manuscript_id")
  publicSummaryOverride String?            @map("public_summary_override")
  status              WebsiteContentStatus @default(DRAFT)
  approverId          String?              @map("approver_id")
  approvedAt          DateTime?            @map("approved_at")
  publishedAt         DateTime?            @map("published_at")
  createdAt           DateTime             @default(now()) @map("created_at")
  updatedAt           DateTime             @updatedAt @map("updated_at")

  website    InstitutionWebsite @relation(fields: [websiteId], references: [id], onDelete: Cascade)
  manuscript Manuscript         @relation(fields: [manuscriptId], references: [id], onDelete: Cascade)

  @@unique([websiteId, manuscriptId])
  @@index([tenantId, websiteId, status])
  @@map("website_publication_links")
}

model WebsiteOpportunityLink {
  id           String               @id @default(uuid())
  tenantId     String               @map("tenant_id")
  websiteId    String               @map("website_id")
  sourceType   String               @map("source_type")
  sourceId     String               @map("source_id")
  status       WebsiteContentStatus @default(DRAFT)
  approverId   String?              @map("approver_id")
  approvedAt   DateTime?            @map("approved_at")
  publishedAt  DateTime?            @map("published_at")
  createdAt    DateTime             @default(now()) @map("created_at")
  updatedAt    DateTime             @updatedAt @map("updated_at")

  website InstitutionWebsite @relation(fields: [websiteId], references: [id], onDelete: Cascade)

  @@unique([websiteId, sourceType, sourceId])
  @@index([tenantId, websiteId, status])
  @@map("website_opportunity_links")
}

model WebsiteContactSubmission {
  id              String   @id @default(uuid())
  tenantId        String   @map("tenant_id")
  websiteId       String   @map("website_id")
  name            String
  email           String
  subject         String?
  message         String
  consentGiven    Boolean  @default(false) @map("consent_given")
  spamStatus      String   @default("CLEAN") @map("spam_status")
  processingStatus String  @default("NEW") @map("processing_status")
  retentionExpiresAt DateTime? @map("retention_expires_at")
  receivedAt      DateTime @default(now()) @map("received_at")
  createdAt       DateTime @default(now()) @map("created_at")

  website InstitutionWebsite @relation(fields: [websiteId], references: [id], onDelete: Cascade)

  // Contact submissions contain personal data.
  // Access is ONLY via authenticated CMS (website.view + website.content.review).
  // NEVER expose through any public API route.
  @@index([tenantId, websiteId, processingStatus])
  @@map("website_contact_submissions")
}
```

**Files:** `prisma/schema.prisma`

**Verify:**
```
cd /Users/macbookpro/Desktop/ProgrammoCeuticals/rims && pnpm prisma:validate
```
Expected: `The schema at prisma/schema.prisma is valid 🎉`

---

- [ ] 1. **Schema: add back-relations and all CMS models** (as described in Step 1 above)
      Append new enums and models; add `institutionWebsite` and `websitePublicationLinks` back-relations.
      Files: `prisma/schema.prisma`
      Verify: `pnpm prisma:validate` — prints "The schema … is valid 🎉"

---

- [ ] 2. **Permissions: add website.* codes to roles.service.ts and seed.ts**

      Add all 17 permission codes to `ALL_PERMISSION_CODES` in both files.
      Also update the `Institution Admin` role's `permissions` array in both files
      to spread all permissions (it already uses `ALL_PERMISSION_CODES` directly,
      so adding the codes to the constant is sufficient in both files).

      The 17 new codes (append after `"documents.archive"`):
      ```
      "website.view",
      "website.settings.manage",
      "website.branding.manage",
      "website.pages.create",
      "website.pages.edit",
      "website.pages.delete",
      "website.navigation.manage",
      "website.media.upload",
      "website.media.delete",
      "website.content.submit",
      "website.content.review",
      "website.content.approve",
      "website.content.publish",
      "website.content.unpublish",
      "website.domains.manage",
      "website.analytics.view",
      "website.audit.view",
      ```

      Files:
      - `apps/api/src/modules/roles/roles.service.ts` — extend `ALL_PERMISSION_CODES`
      - `prisma/seed.ts` — extend `ALL_PERMISSION_CODES` identically

      Verify: `pnpm --filter @rims/api type-check` — exits 0; after running the seed
      (`pnpm prisma:seed`) the `Permission` table will have 17 more rows (verified
      by checking the seed console output shows no errors).

---

- [ ] 3. **Backend: create the `institutional-web` NestJS module**

      Create the directory `apps/api/src/modules/institutional-web/` with the
      following files.  All services follow the same constructor pattern as
      `PublicationsService` and `DocumentsService`: inject `PrismaService` and
      `AuditService`; throw `NotFoundException` for missing tenant-scoped records;
      always filter every Prisma query with `tenantId`.

      **3.1 `institutional-web.module.ts`**
      ```ts
      @Module({
        imports: [AuditModule],
        providers: [
          WebsiteService,
          PagesService,
          ContentService,
          NavigationService,
          MediaService,
          DomainsService,
          PublicationLinksService,
          PublicApiService,
        ],
        controllers: [InstitutionalWebController, PublicController],
        exports: [WebsiteService, PublicApiService],
      })
      export class InstitutionalWebModule {}
      ```

      **3.2 `dtos/` directory** — create one DTO file per entity group:
      - `website.dto.ts` — `UpdateWebsiteSettingsDto`, `UpdateBrandingDto`, `SelectThemeDto`
      - `pages.dto.ts` — `CreatePageDto`, `UpdatePageDto`, `QueryPagesDto`, `AddSectionDto`, `UpdateSectionDto`
      - `content.dto.ts` — `CreateNewsDto`, `UpdateNewsDto`, `CreateEventDto`, `UpdateEventDto`, `CreateOpportunityDto`, `UpdateOpportunityDto`, `CreateTeamProfileDto`, `UpdateTeamProfileDto`, `CreatePartnerDto`, `UpdatePartnerDto`, `CreateResourceDto`, `UpdateResourceDto`, `CreateFaqDto`, `UpdateFaqDto`
      - `navigation.dto.ts` — `ReplaceNavigationItemsDto` with a nested `NavigationItemDto`
      - `media.dto.ts` — `CreateMediaDto`, `UpdateMediaDto`, `QueryMediaDto`
      - `domains.dto.ts` — `CreateDomainDto`, `UpdateDomainDto`
      - `publication-links.dto.ts` — `LinkManuscriptDto`
      - `contact.dto.ts` — `CreateContactSubmissionDto` (public form), `QueryContactSubmissionsDto`

      All DTOs use `class-validator` decorators (`@IsString()`, `@IsOptional()`,
      `@IsEnum()`, `@IsInt()`, `@IsBoolean()`, `@IsUrl()`, `@IsEmail()`,
      `@MaxLength()`) matching the patterns in
      `publications/dtos/create-manuscript.dto.ts`.

      **3.3 `website.service.ts`** — methods:
      - `provisionWebsite(tenantId)`: upsert `InstitutionWebsite` (idempotent)
      - `getWebsite(tenantId)`: find by tenantId, throw 404 if absent
      - `updateSettings(tenantId, dto, actorId)`: patch locale/timezone/name + audit
      - `updateBranding(tenantId, dto, actorId)`: upsert `WebsiteBranding` + audit
      - `publishWebsite(tenantId, actorId)`: set status=PUBLISHED + audit

      **3.4 `pages.service.ts`** — methods:
      - `findAll(websiteId, tenantId, query)` — paginated
      - `create(websiteId, tenantId, dto, actorId)` — enforce unique slug within website
      - `findOne(id, tenantId)` — include sections
      - `update(id, tenantId, dto, actorId)` — patch fields, audit
      - `submit(id, tenantId, actorId)` — transition DRAFT→SUBMITTED
      - `approve(id, tenantId, actorId)` — transition SUBMITTED|CHANGES_REQUESTED→APPROVED
      - `publish(id, tenantId, actorId)` — transition APPROVED→PUBLISHED; set publishedAt; **create `WebsitePageRevision`** snapshotting current sections JSON; emit audit event `website_page.published`
      - `unpublish(id, tenantId, actorId)` — set status=UNPUBLISHED, set unpublishedAt, audit
      - `archive(id, tenantId, actorId)` — set status=ARCHIVED, set archivedAt
      - `addSection(pageId, tenantId, dto, actorId)` — create `WebsitePageSection`; create revision
      - `updateSection(sectionId, pageId, tenantId, dto, actorId)` — update section; create revision
      - `removeSection(sectionId, pageId, tenantId, actorId)` — delete section; create revision
      - `getRevisions(pageId, tenantId)` — list revisions ordered by number desc

      Status transitions validated server-side; throw `BadRequestException` on
      invalid transition (same pattern as `PublicationsService`).

      **3.5 `content.service.ts`** — generic CRUD+lifecycle for all 7 typed
      content models (`WebsiteNews`, `WebsiteEvent`, `WebsiteOpportunity`,
      `WebsiteTeamProfile`, `WebsitePartner`, `WebsiteResource`, `WebsiteFaq`).
      Method signature pattern:
      - `createContent(model, websiteId, tenantId, dto, actorId)`
      - `updateContent(model, id, tenantId, dto, actorId)`
      - `publishContent(model, id, tenantId, actorId)` — set status=PUBLISHED, set publishedAt, audit `website_content.published`
      - `unpublishContent(model, id, tenantId, actorId)` — set status=UNPUBLISHED, audit
      - `archiveContent(model, id, tenantId, actorId)` — set status=ARCHIVED, audit

      **NEVER** expose `WebsiteTeamProfile` HR-linked private fields through
      any public-facing method.  The public output strips `employeeId`.

      **3.6 `navigation.service.ts`** — methods:
      - `getNavigations(websiteId, tenantId)` — all navigations with items
      - `replaceItems(navigationId, websiteId, tenantId, dto, actorId)` — delete all existing items, bulk-insert new ones in a transaction

      **3.7 `media.service.ts`** — methods:
      - `createMedia(websiteId, tenantId, dto, actorId)` — create `WebsiteMedia`; do not accept `storageKey` from client; generate a safe internal key
      - `listMedia(websiteId, tenantId, query)` — paginated
      - `updateMedia(id, tenantId, dto, actorId)` — patch altText/caption/credit
      - `deleteMedia(id, tenantId, actorId)` — hard delete + audit

      **3.8 `domains.service.ts`** — methods:
      - `createDomain(websiteId, tenantId, dto, actorId)` — create `WebsiteDomain`; generate a random `verificationToken` (crypto.randomBytes(32).toString('hex')); status=PENDING
      - `verifyDomain(id, tenantId, actorId)` — stub: set status=VERIFIED, set verifiedAt; audit `website_domain.verified`
      - `setPrimary(id, websiteId, tenantId, actorId)` — in transaction: clear isPrimary on all website domains, set isPrimary=true on this one, set primaryDomainId on InstitutionWebsite; audit

      **3.9 `publication-links.service.ts`** — methods:
      - `linkManuscript(websiteId, tenantId, dto, actorId)` — create `WebsitePublicationLink` with status=DRAFT; verify manuscript belongs to same tenant
      - `approve(id, tenantId, actorId)` — set status=APPROVED + approverId + approvedAt; audit
      - `publish(id, tenantId, actorId)` — set status=PUBLISHED + publishedAt; audit `website_publication_link.published`
      - `unpublish(id, tenantId, actorId)` — set status=UNPUBLISHED; audit
      - `findAll(websiteId, tenantId, query)` — paginated

      **3.10 `public-api.service.ts`** — methods:
      - `resolveTenantFromHostname(hostname)`: query `WebsiteDomain` where hostname=hostname AND verificationStatus=VERIFIED; join to `InstitutionWebsite`; throw `NotFoundException` if not found or website status ≠ PUBLISHED. **Never trust client-supplied tenantId.**
      - `getSiteInfo(websiteId)` — returns website + branding (no internal fields)
      - `getNavigation(websiteId)` — returns all navigations with items
      - `getPage(websiteId, slug)` — returns page where status=PUBLISHED only; returns sections; returns 404 if draft
      - `listNews(websiteId, query)` — paginated, status=PUBLISHED only
      - `getNews(websiteId, slug)` — status=PUBLISHED only or 404
      - `listEvents(websiteId, query)` — PUBLISHED, ordered by startDatetime asc
      - `getEvent(websiteId, slug)` — PUBLISHED only
      - `listPublications(websiteId, query)` — join `WebsitePublicationLink` where status=PUBLISHED; return only public manuscript fields (title, abstract, authors, doi, url, publishedAt, targetJournal); **never** return internal notes or unpublished manuscripts
      - `getPublication(websiteId, manuscriptId)` — PUBLISHED link only
      - `listOpportunities(websiteId, query)` — PUBLISHED, optionally filtered by opportunityType
      - `getOpportunity(websiteId, slug)` — PUBLISHED only
      - `listTeamProfiles(websiteId)` — PUBLISHED; strip employeeId from response
      - `listPartners(websiteId)` — PUBLISHED
      - `listResources(websiteId)` — PUBLISHED, publicDownload=true
      - `createContactSubmission(websiteId, dto)` — persist `WebsiteContactSubmission`; **never** return this data via any public GET

      **3.11 `institutional-web.controller.ts`** — authenticated CMS routes at
      `/institutional-web`.  Decorators: `@Controller('institutional-web')`,
      `@UseGuards(JwtAuthGuard, PermissionsGuard)`.  Derive `tenantId` from
      `@CurrentUser() user: JwtPayload` on every handler — **never** from the
      request body.

      Routes (one `@Get`/`@Post`/`@Patch`/`@Delete` per line):
      ```
      GET    /                         @RequirePermissions('website.view')           → websiteService.getWebsite
      PATCH  /settings                 @RequirePermissions('website.settings.manage')→ websiteService.updateSettings
      PATCH  /branding                 @RequirePermissions('website.branding.manage')→ websiteService.updateBranding
      POST   /publish                  @RequirePermissions('website.content.publish') → websiteService.publishWebsite
      GET    /pages                    @RequirePermissions('website.view')
      POST   /pages                    @RequirePermissions('website.pages.create')
      GET    /pages/:id                @RequirePermissions('website.view')
      PATCH  /pages/:id                @RequirePermissions('website.pages.edit')
      POST   /pages/:id/submit         @RequirePermissions('website.content.submit')
      POST   /pages/:id/approve        @RequirePermissions('website.content.approve')
      POST   /pages/:id/publish        @RequirePermissions('website.content.publish')
      POST   /pages/:id/unpublish      @RequirePermissions('website.content.unpublish')
      GET    /pages/:id/sections       @RequirePermissions('website.view')
      POST   /pages/:id/sections       @RequirePermissions('website.pages.edit')
      PATCH  /pages/:id/sections/:sid  @RequirePermissions('website.pages.edit')
      DELETE /pages/:id/sections/:sid  @RequirePermissions('website.pages.edit')
      GET    /pages/:id/revisions      @RequirePermissions('website.view')
      GET    /navigation               @RequirePermissions('website.view')
      PUT    /navigation/:id/items     @RequirePermissions('website.navigation.manage')
      GET    /media                    @RequirePermissions('website.view')
      POST   /media                    @RequirePermissions('website.media.upload')
      PATCH  /media/:id                @RequirePermissions('website.media.upload')
      DELETE /media/:id                @RequirePermissions('website.media.delete')
      GET    /news                     @RequirePermissions('website.view')
      POST   /news                     @RequirePermissions('website.content.submit')
      PATCH  /news/:id                 @RequirePermissions('website.pages.edit')
      POST   /news/:id/publish         @RequirePermissions('website.content.publish')
      POST   /news/:id/unpublish       @RequirePermissions('website.content.unpublish')
      GET    /events                   @RequirePermissions('website.view')
      POST   /events                   @RequirePermissions('website.content.submit')
      PATCH  /events/:id               @RequirePermissions('website.pages.edit')
      POST   /events/:id/publish       @RequirePermissions('website.content.publish')
      POST   /events/:id/unpublish     @RequirePermissions('website.content.unpublish')
      GET    /opportunities            @RequirePermissions('website.view')
      POST   /opportunities            @RequirePermissions('website.content.submit')
      PATCH  /opportunities/:id        @RequirePermissions('website.pages.edit')
      POST   /opportunities/:id/publish   @RequirePermissions('website.content.publish')
      POST   /opportunities/:id/unpublish @RequirePermissions('website.content.unpublish')
      GET    /team                     @RequirePermissions('website.view')
      POST   /team                     @RequirePermissions('website.content.submit')
      PATCH  /team/:id                 @RequirePermissions('website.pages.edit')
      POST   /team/:id/publish         @RequirePermissions('website.content.publish')
      GET    /partners                 @RequirePermissions('website.view')
      POST   /partners                 @RequirePermissions('website.content.submit')
      PATCH  /partners/:id             @RequirePermissions('website.pages.edit')
      POST   /partners/:id/publish     @RequirePermissions('website.content.publish')
      GET    /resources                @RequirePermissions('website.view')
      POST   /resources                @RequirePermissions('website.content.submit')
      PATCH  /resources/:id            @RequirePermissions('website.pages.edit')
      POST   /resources/:id/publish    @RequirePermissions('website.content.publish')
      GET    /faqs                     @RequirePermissions('website.view')
      POST   /faqs                     @RequirePermissions('website.content.submit')
      PATCH  /faqs/:id                 @RequirePermissions('website.pages.edit')
      GET    /publication-links        @RequirePermissions('website.view')
      POST   /publication-links        @RequirePermissions('website.content.submit')
      POST   /publication-links/:id/approve  @RequirePermissions('website.content.approve')
      POST   /publication-links/:id/publish  @RequirePermissions('website.content.publish')
      POST   /publication-links/:id/unpublish @RequirePermissions('website.content.unpublish')
      GET    /domains                  @RequirePermissions('website.domains.manage')
      POST   /domains                  @RequirePermissions('website.domains.manage')
      POST   /domains/:id/verify       @RequirePermissions('website.domains.manage')
      POST   /domains/:id/set-primary  @RequirePermissions('website.domains.manage')
      GET    /contact-submissions      @RequirePermissions('website.content.review')
      ```

      **3.12 `public.controller.ts`** — public routes at `/public/sites/current`.
      Decorate the class with `@Public()` (sets `isPublic` metadata so
      `JwtAuthGuard` skips auth).  Apply `@UseGuards(ThrottlerGuard)` only on the
      contact POST. Resolve tenant on **every** handler by reading the `Host`
      header and calling `publicApiService.resolveTenantFromHostname(host)`;
      inject `Request` from `@nestjs/common`.

      Routes:
      ```
      GET  /                          → publicApiService.getSiteInfo
      GET  /navigation                → publicApiService.getNavigation
      GET  /pages/:slug               → publicApiService.getPage
      GET  /news                      → publicApiService.listNews
      GET  /news/:slug                → publicApiService.getNews
      GET  /events                    → publicApiService.listEvents
      GET  /events/:slug              → publicApiService.getEvent
      GET  /publications              → publicApiService.listPublications
      GET  /publications/:id          → publicApiService.getPublication
      GET  /opportunities             → publicApiService.listOpportunities
      GET  /opportunities/:slug       → publicApiService.getOpportunity
      GET  /team                      → publicApiService.listTeamProfiles
      GET  /partners                  → publicApiService.listPartners
      GET  /resources                 → publicApiService.listResources
      POST /contact-submissions       → publicApiService.createContactSubmission
      ```

      Files to create:
      - `apps/api/src/modules/institutional-web/institutional-web.module.ts`
      - `apps/api/src/modules/institutional-web/institutional-web.controller.ts`
      - `apps/api/src/modules/institutional-web/public.controller.ts`
      - `apps/api/src/modules/institutional-web/website.service.ts`
      - `apps/api/src/modules/institutional-web/pages.service.ts`
      - `apps/api/src/modules/institutional-web/content.service.ts`
      - `apps/api/src/modules/institutional-web/navigation.service.ts`
      - `apps/api/src/modules/institutional-web/media.service.ts`
      - `apps/api/src/modules/institutional-web/domains.service.ts`
      - `apps/api/src/modules/institutional-web/publication-links.service.ts`
      - `apps/api/src/modules/institutional-web/public-api.service.ts`
      - `apps/api/src/modules/institutional-web/dtos/website.dto.ts`
      - `apps/api/src/modules/institutional-web/dtos/pages.dto.ts`
      - `apps/api/src/modules/institutional-web/dtos/content.dto.ts`
      - `apps/api/src/modules/institutional-web/dtos/navigation.dto.ts`
      - `apps/api/src/modules/institutional-web/dtos/media.dto.ts`
      - `apps/api/src/modules/institutional-web/dtos/domains.dto.ts`
      - `apps/api/src/modules/institutional-web/dtos/publication-links.dto.ts`
      - `apps/api/src/modules/institutional-web/dtos/contact.dto.ts`

      Verify: `pnpm --filter @rims/api type-check` — exits 0
      (module not yet wired into app.module.ts — that is step 4)

---

- [ ] 4. **Register InstitutionalWebModule in app.module.ts + exclude public routes from TenantMiddleware**

      In `apps/api/src/app.module.ts`:

      1. Add import at the top:
         ```ts
         import { InstitutionalWebModule } from './modules/institutional-web/institutional-web.module';
         ```
      2. Add `InstitutionalWebModule` to the `imports` array after `PlatformAdminModule`.
      3. In the `configure()` method, add these two exclusions to the
         `TenantMiddleware` `.exclude(...)` call:
         ```ts
         { path: 'public/sites/current', method: RequestMethod.GET },
         { path: 'public/sites/current/*', method: RequestMethod.ALL },
         ```

      Files: `apps/api/src/app.module.ts`

      Verify: `pnpm --filter @rims/api type-check` — exits 0;
      `pnpm --filter @rims/api build` — exits 0

---

- [ ] 5. **Create `apps/public-web` — Next.js public-facing website**

      Create the entire `apps/public-web` package from scratch.  This step
      depends on Step 4 (the public API routes must exist for the fetches to
      resolve, though the app builds without a live API).

      **5.1 Package scaffolding files** (create at `apps/public-web/`):

      `package.json`:
      ```json
      {
        "name": "@rims/public-web",
        "version": "0.1.0",
        "private": true,
        "scripts": {
          "build": "next build",
          "dev": "next dev --port 3001",
          "start": "next start --port 3001",
          "type-check": "tsc --noEmit",
          "lint": "next lint"
        },
        "dependencies": {
          "next": "14.2.5",
          "react": "18.3.1",
          "react-dom": "18.3.1",
          "typescript": "5.7.2",
          "tailwindcss": "3.4.15",
          "postcss": "8.4.47",
          "autoprefixer": "10.4.20",
          "axios": "1.7.7",
          "next-seo": "6.6.0",
          "lucide-react": "0.460.0",
          "clsx": "2.1.1",
          "tailwind-merge": "2.5.4"
        },
        "devDependencies": {
          "@types/node": "22.9.0",
          "@types/react": "18.3.12",
          "@types/react-dom": "18.3.1"
        }
      }
      ```

      `tsconfig.json`:
      ```json
      {
        "compilerOptions": {
          "target": "ES2017",
          "lib": ["dom", "dom.iterable", "esnext"],
          "allowJs": false,
          "skipLibCheck": true,
          "strict": true,
          "forceConsistentCasingInFileNames": true,
          "noEmit": true,
          "esModuleInterop": true,
          "module": "esnext",
          "moduleResolution": "bundler",
          "resolveJsonModule": true,
          "isolatedModules": true,
          "jsx": "preserve",
          "incremental": true,
          "plugins": [{ "name": "next" }],
          "paths": { "@/*": ["./src/*"] }
        },
        "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        "exclude": ["node_modules"]
      }
      ```

      `next.config.js`:
      ```js
      /** @type {import('next').NextConfig} */
      const nextConfig = {
        env: {
          RIMS_API_URL: process.env.RIMS_API_URL ?? 'http://localhost:3000',
          SITE_HOSTNAME: process.env.SITE_HOSTNAME ?? 'demo-rims.localhost',
        },
        images: { domains: [] },
      };
      module.exports = nextConfig;
      ```

      `tailwind.config.js`:
      ```js
      /** @type {import('tailwindcss').Config} */
      module.exports = {
        content: ['./src/**/*.{ts,tsx}'],
        theme: {
          extend: {
            colors: {
              brand: {
                50:  '#e8eef5',
                100: '#c5d4e5',
                600: '#1e3a5f',
                700: '#16304f',
                800: '#0e2640',
              },
            },
          },
        },
        plugins: [],
      };
      ```

      `postcss.config.js`:
      ```js
      module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
      ```

      **5.2 `src/lib/api.ts`** — server-side fetch helper:
      ```ts
      const BASE = process.env.RIMS_API_URL ?? 'http://localhost:3000';
      const HOSTNAME = process.env.SITE_HOSTNAME ?? 'demo-rims.localhost';

      export async function apiFetch<T>(path: string): Promise<T | null> {
        try {
          const res = await fetch(`${BASE}/api/v1/public/sites/current${path}`, {
            headers: { 'X-Site-Hostname': HOSTNAME, Host: HOSTNAME },
            next: { revalidate: 60 },
          });
          if (!res.ok) return null;
          return res.json() as Promise<T>;
        } catch {
          return null;
        }
      }
      ```

      **5.3 Components** (all in `src/components/`):

      - `Navbar.tsx` — server component; fetches `/navigation`, renders primary
        nav links using the `primary` menu; responsive hamburger toggles a
        mobile drawer (use a client component for toggle state — wrap in a
        `'use client'` sub-component `MobileMenu`); uses `brand-600` background,
        white text.  `aria-label="Main navigation"`.

      - `Footer.tsx` — server component; reads branding from props (passed down
        from layout); renders footer nav, social links, copyright.
        WCAG: role="contentinfo".

      - `HeroSection.tsx` — accepts `{ headline, subtext, ctaLabel, ctaHref }`
        props; full-width `brand-600` background, white text, responsive.

      - `PublicationCard.tsx` — renders title, authors (comma-joined), journal,
        year, DOI link.  Card with border-radius, hover shadow.

      - `NewsCard.tsx` — title, summary, publishedAt (formatted), link.

      - `EventCard.tsx` — title, startDatetime (formatted), venue/online badge,
        link.

      - `OpportunityCard.tsx` — title, opportunityType badge, closingDate, link.

      - `TeamProfileCard.tsx` — photo (with fallback initials), name, role,
        department.  Strip employeeId.

      - `PartnerCard.tsx` — logo image (with fallback text), name, description,
        link.

      - `ContactForm.tsx` — `'use client'`; controlled form with name, email,
        subject, message, consent checkbox; POST to `/api/contact` (Next.js
        route handler); shows success/error states.  WCAG: all inputs have
        associated `<label>`.

      - `SectionRenderer.tsx` — switch on `sectionType`; renders each
        structured section; returns `null` for unknown types (never crashes).

      - `PageHeader.tsx` — accepts `{ title, description? }`, renders a branded
        page header section.

      - `EmptyState.tsx` — accepts `{ message }`, renders a centred friendly
        empty state.  Used everywhere a list may be empty.

      **5.4 App Router pages** (all in `src/app/`).  All are server components
      unless noted.  Every page calls `apiFetch` and renders `<EmptyState>` when
      the response is null or an empty array — never throws.

      - `layout.tsx` — root layout; imports globals CSS; fetches site info and
        branding once (pass to Footer); renders `<Navbar />`, `{children}`,
        `<Footer />`.  Sets `<html lang>` from branding.

      - `globals.css` — Tailwind directives (`@tailwind base/components/utilities`).

      - `page.tsx` — home page; fetches news (first 3), events (next 2),
        opportunities (first 3); renders `<HeroSection>`, featured news row,
        events preview, opportunities preview.

      - `about/page.tsx` — static content from `WebsitePage` slug=`about`;
        renders sections via `<SectionRenderer>`.

      - `research/page.tsx` — renders `WebsitePage` slug=`research` sections.

      - `publications/page.tsx` — fetches `/publications`; renders
        `<PublicationCard>` list, pagination query params.

      - `publications/[id]/page.tsx` — fetches `/publications/:id`; renders
        detail (title, authors, abstract, doi link, download link if permitted).

      - `news/page.tsx` — fetches `/news`; renders `<NewsCard>` list.

      - `news/[slug]/page.tsx` — fetches `/news/:slug`; renders article body
        as HTML (use `dangerouslySetInnerHTML` with a note that body content
        is staff-authored CMS content, not user-supplied).

      - `events/page.tsx` — fetches `/events`; renders `<EventCard>` list.

      - `events/[slug]/page.tsx` — event detail.

      - `opportunities/page.tsx` — fetches `/opportunities`; accepts `?type=`
        search param for filter; renders `<OpportunityCard>` list.

      - `opportunities/[slug]/page.tsx` — opportunity detail.

      - `team/page.tsx` — fetches `/team`; renders `<TeamProfileCard>` grid.

      - `partners/page.tsx` — fetches `/partners`; renders `<PartnerCard>` grid.

      - `resources/page.tsx` — fetches `/resources`; renders download list.

      - `contact/page.tsx` — renders contact info from branding + `<ContactForm>`.

      - `not-found.tsx` — 404 page with `<PageHeader>` and `<EmptyState>`.

      **5.5 API route handler** `src/app/api/contact/route.ts`:
      ```ts
      // Server-side contact form proxy; validates input; POSTs to RIMS API.
      // Never exposes RIMS_API_URL to the client.
      ```

      Fields: `POST /api/contact` — read body, validate (name/email/message
      required, consentGiven required), forward to
      `RIMS_API_URL/api/v1/public/sites/current/contact-submissions` with
      `X-Site-Hostname` header; return `{ success: true }` or error JSON.

      Files to create: all files listed in 5.1–5.5 under `apps/public-web/`.

      Verify: `pnpm --filter @rims/public-web type-check` — exits 0;
      `pnpm --filter @rims/public-web build` — exits 0 (Next.js static
      analysis passes; fetches gracefully return null during build since
      no live API is needed).

---

- [ ] 6. **Update pnpm-workspace.yaml to include apps/public-web**

      The file currently contains:
      ```yaml
      packages:
        - "apps/*"
        - "packages/*"
      ```
      The glob `apps/*` already covers `apps/public-web`, so no change is
      needed to `pnpm-workspace.yaml`.

      However, add `@rims/public-web` to the Turborepo pipeline by verifying
      `turbo.json` (if present at root) includes `build` as a task — no change
      needed if it already covers all packages.

      Files: `pnpm-workspace.yaml` (no edit needed — glob already covers it);
      check `turbo.json` at repo root.

      Verify: from repo root, `pnpm install` resolves `@rims/public-web`;
      `pnpm turbo run type-check` includes `@rims/public-web`.

---

- [ ] 7. **Dashboard CMS pages in apps/web**

      Create `apps/web/src/pages/website/` with 10 page components.
      All follow the `UsersPage.tsx` pattern: named export of a function
      component, `useAuthStore(s => s.hasPermission)` for permission guards,
      `useQuery`/`useMutation` from `@tanstack/react-query`, `@rims/ui`
      components (`PageHeader`, `Button`, `Badge`, `DataTable`, `Modal`,
      `FormField`, `Input`, `Select`), `api` from `../../lib/api`.

      **7.1 `WebsiteOverviewPage.tsx`**
      - Fetches `GET /institutional-web` (website status, domain, name).
      - Shows status badge, primary domain, action buttons:
        "Publish Website" (requires `website.content.publish`),
        link to Branding, link to Pages.
      - Content counts section: fetches news, events, opportunities counts.

      **7.2 `WebsiteBrandingPage.tsx`**
      - Fetches `GET /institutional-web` (includes branding sub-object).
      - Form: logoUrl (text input), logoDarkUrl, tagline, shortDescription,
        primaryColor, secondaryColor, contactEmail, contactPhone, address.
      - Social links as a JSON textarea (maps to `socialLinksJson`).
      - `PATCH /institutional-web/branding` on save.
      - Requires `website.branding.manage`.

      **7.3 `WebsitePagesPage.tsx`**
      - Fetches `GET /institutional-web/pages` with pagination.
      - Columns: title, slug, type, status badge, publishedAt.
      - Row actions: "Edit" → navigate to `/website/pages/:id`.
      - "Create Page" button (requires `website.pages.create`) → modal with
        title, slug, pageType select.
      - Status filter dropdown.

      **7.4 `WebsitePageEditorPage.tsx`**
      - Fetches `GET /institutional-web/pages/:id` (includes sections).
      - Sections panel: list of sections with type and sortOrder; "Add Section"
        button opens modal with sectionType select and configJson textarea;
        "Remove" button per section.
      - SEO panel: seoTitle, seoDescription inputs.
      - Workflow buttons: Submit, Approve (if `website.content.approve`),
        Publish (if `website.content.publish`), Unpublish (if
        `website.content.unpublish`).
      - Mutations: `PATCH /institutional-web/pages/:id`, `POST .../submit`,
        `POST .../approve`, `POST .../publish`, `POST .../unpublish`.

      **7.5 `WebsiteNewsPage.tsx`**
      - Fetches `GET /institutional-web/news`.
      - Columns: title, slug, status, publishedAt.
      - Create modal: title, slug, summary, body (textarea).
      - Edit inline or navigate to detail (re-use a modal for MVP).
      - Publish / Unpublish row actions with permission guards.

      **7.6 `WebsiteEventsPage.tsx`**
      - Same pattern as WebsiteNewsPage for events.
      - Create form adds: startDatetime (datetime-local input), endDatetime,
        venue, isOnline checkbox, registrationUrl.

      **7.7 `WebsiteOpportunitiesPage.tsx`**
      - Same pattern, adds opportunityType select filter (OpportunityType enum
        values) and closingDate date input.

      **7.8 `WebsitePublicationsPage.tsx`**
      - Fetches `GET /institutional-web/publication-links` and a list of
        eligible manuscripts from `GET /publications?status=PUBLISHED`.
      - "Link Publication" modal: manuscriptId select (from manuscript list).
      - Approve / Publish / Unpublish row actions with permission guards
        (`website.content.approve`, `website.content.publish`,
        `website.content.unpublish`).

      **7.9 `WebsiteContactPage.tsx`**
      - Requires `website.content.review`.  Read-only inbox.
      - Fetches `GET /institutional-web/contact-submissions`.
      - Columns: name, email, subject, receivedAt, processingStatus.
      - No create button — submissions arrive from the public contact form.

      **7.10 `WebsiteDomainsPage.tsx`**
      - Requires `website.domains.manage`.
      - Fetches `GET /institutional-web/domains`.
      - Columns: hostname, verificationStatus badge, isPrimary badge.
      - "Add Domain" button → modal with hostname input.
      - Row actions: "Verify" → `POST /institutional-web/domains/:id/verify`;
        "Set Primary" → `POST /institutional-web/domains/:id/set-primary`.

      Files:
      - `apps/web/src/pages/website/WebsiteOverviewPage.tsx`
      - `apps/web/src/pages/website/WebsiteBrandingPage.tsx`
      - `apps/web/src/pages/website/WebsitePagesPage.tsx`
      - `apps/web/src/pages/website/WebsitePageEditorPage.tsx`
      - `apps/web/src/pages/website/WebsiteNewsPage.tsx`
      - `apps/web/src/pages/website/WebsiteEventsPage.tsx`
      - `apps/web/src/pages/website/WebsiteOpportunitiesPage.tsx`
      - `apps/web/src/pages/website/WebsitePublicationsPage.tsx`
      - `apps/web/src/pages/website/WebsiteContactPage.tsx`
      - `apps/web/src/pages/website/WebsiteDomainsPage.tsx`

      Verify: `pnpm --filter @rims/web type-check` — exits 0

---

- [ ] 8. **Update router.tsx and AppShell.tsx to wire in the CMS pages**

      **8.1 `apps/web/src/router.tsx`**

      Add lazy imports for all 10 website pages (same pattern as existing
      lazy imports — `import('./pages/website/Xyz').then(m => ({ default: m.Xyz }))`):
      ```ts
      const WebsiteOverviewPage       = lazy(...)
      const WebsiteBrandingPage       = lazy(...)
      const WebsitePagesPage          = lazy(...)
      const WebsitePageEditorPage     = lazy(...)
      const WebsiteNewsPage           = lazy(...)
      const WebsiteEventsPage         = lazy(...)
      const WebsiteOpportunitiesPage  = lazy(...)
      const WebsitePublicationsPage   = lazy(...)
      const WebsiteContactPage        = lazy(...)
      const WebsiteDomainsPage        = lazy(...)
      ```

      Add routes inside the authenticated `children` array:
      ```ts
      { path: '/website',                    element: wrap(WebsiteOverviewPage) },
      { path: '/website/branding',           element: wrap(WebsiteBrandingPage) },
      { path: '/website/pages',              element: wrap(WebsitePagesPage) },
      { path: '/website/pages/:id',          element: wrap(WebsitePageEditorPage) },
      { path: '/website/news',               element: wrap(WebsiteNewsPage) },
      { path: '/website/events',             element: wrap(WebsiteEventsPage) },
      { path: '/website/opportunities',      element: wrap(WebsiteOpportunitiesPage) },
      { path: '/website/publications',       element: wrap(WebsitePublicationsPage) },
      { path: '/website/contact',            element: wrap(WebsiteContactPage) },
      { path: '/website/domains',            element: wrap(WebsiteDomainsPage) },
      ```

      **8.2 `apps/web/src/layouts/AppShell.tsx`**

      Add `Globe` to the lucide-react import line.

      Add to `NAV_ITEMS` (after the `Analytics` entry, before `Audit Log`):
      ```ts
      {
        path: '/website',
        label: 'Website',
        icon: Globe,
        permission: 'website.view',
      },
      ```

      Add to `getPageName`:
      ```ts
      if (pathname.startsWith('/website')) return 'Website';
      ```

      Files:
      - `apps/web/src/router.tsx`
      - `apps/web/src/layouts/AppShell.tsx`

      Verify: `pnpm --filter @rims/web type-check` — exits 0;
      `pnpm --filter @rims/web build` — exits 0

---

- [ ] 9. **Update seed.ts: provision demo website data**

      Append a new section at the end of the `main()` function (before the
      final `console.log("✅  Seed complete")`) in `prisma/seed.ts`.

      The section must be idempotent (check with `findFirst` before creating,
      same pattern as existing demo data blocks).

      Seed the following records for the demo tenant in this order (each
      depends on the prior):

      1. **InstitutionWebsite** — `upsert` by `tenantId`; status=`PUBLISHED`;
         name="Demo Research Institute"; defaultLocale="en"; timezone="UTC".

      2. **WebsiteBranding** — `upsert` by `websiteId`;
         tagline="Advancing Research for a Healthier World";
         shortDescription="A leading research institution dedicated to infectious disease and public health.";
         primaryColor="#1e3a5f"; secondaryColor="#ffffff";
         contactEmail="info@demo-rims.localhost".

      3. **WebsiteDomain** — `upsert` by `hostname="demo-rims.localhost"`;
         verificationStatus=`VERIFIED`; isPrimary=`true`.
         After creating, set `primaryDomainId` on the website record.

      4. **Default WebsitePages** — one `upsert` per slug; all status=`PUBLISHED`,
         publishedAt=`new Date()`:
         - `{ slug: 'home', pageType: 'HOME', title: 'Home' }`
         - `{ slug: 'about', pageType: 'ABOUT', title: 'About Us' }`
         - `{ slug: 'research', pageType: 'RESEARCH', title: 'Research' }`
         - `{ slug: 'publications', pageType: 'PUBLICATIONS', title: 'Publications' }`
         - `{ slug: 'opportunities', pageType: 'OPPORTUNITIES', title: 'Opportunities' }`
         - `{ slug: 'news', pageType: 'NEWS', title: 'News' }`
         - `{ slug: 'contact', pageType: 'CONTACT', title: 'Contact' }`
         Upsert key: `websiteId_slug` unique constraint.

      5. **WebsiteNews** — check by `websiteId + slug='amr-breakthrough-2026'`;
         title="AMR Surveillance Breakthrough 2026";
         summary="New findings from our cross-sectional study…";
         status=`PUBLISHED`; publishedAt=`new Date()`.

      6. **WebsiteEvent** — check by `websiteId + slug='research-symposium-2027'`;
         title="International Research Symposium 2027";
         startDatetime=`new Date('2027-03-15T09:00:00Z')`;
         venue="Accra International Conference Centre";
         status=`PUBLISHED`; publishedAt=`new Date()`.

      7. **WebsiteOpportunity** — check by `websiteId + slug='research-officer-2026'`;
         title="Senior Research Officer"; opportunityType=`VACANCY`;
         closingDate=`new Date('2026-12-31')`; status=`PUBLISHED`;
         publishedAt=`new Date()`.

      8. **WebsiteTeamProfile** — check by `websiteId + displayName='Dr. Ada Mensah'`;
         role="Principal Investigator"; department="Infectious Disease Research";
         biography="Dr. Mensah leads the antimicrobial resistance surveillance programme.";
         status=`PUBLISHED`; publishedAt=`new Date()`.

      9. **WebsitePublicationLink** — link the existing demo manuscript (found
         with `findFirst({ where: { tenantId, title: { contains: 'Antimicrobial' } } })`)
         to the website; status=`PUBLISHED`; publishedAt=`new Date()`.
         Guard: only create if the manuscript exists.

      Files: `prisma/seed.ts`

      Verify: `pnpm prisma:seed` — completes without errors and prints
      "✅  Seed complete".  Run `pnpm prisma:validate` again to confirm schema
      is still valid after the seed file was edited.

---

- [ ] 10. **Write OPEN_DECISIONS.md**

       Create `docs/OPEN_DECISIONS.md` documenting the open decisions from
       spec section 27 (or the equivalent decisions implicit in the spec) with
       the recommended defaults applied for this implementation.

       The document must cover:

       **1. SVG media uploads**
       Decision: Disallow SVG in the initial release.
       Rationale: Spec section 11.1 flags SVG as requiring robust sanitisation;
       it is explicitly listed as "may be disabled in the first release."
       Implementation: `CreateMediaDto` rejects `mimeType === 'image/svg+xml'`
       with a `BadRequestException`.

       **2. Self-approval in publishing workflow**
       Decision: Self-approval is allowed by default in the MVP.
       Rationale: Spec says "should be disallowed by default where separation
       of duties is required" but does not mandate it for all tenants.  The MVP
       single-user demo would be blocked without it.  A future `WebsiteSettings`
       flag can enforce separation when institutions opt in.

       **3. Scheduled publishing**
       Decision: `scheduledAt` field is stored but background job scheduling is
       deferred to a follow-on phase.  The field is persisted and the status
       `SCHEDULED` is a valid state, but no BullMQ job is created in this phase.
       Rationale: The existing RIMS worker app (`apps/worker`) can be extended
       in a follow-on; adding a cron job now would exceed phase scope.

       **4. Analytics**
       Decision: Website analytics (page view tracking, referrer data) are
       deferred.  The `website.analytics.view` permission is seeded and the
       `GET /institutional-web/analytics/overview` route can be stubbed to return
       an empty object.  The `AnalyticsSnapshot` model in the existing schema
       is reusable in a follow-on phase.
       Rationale: Privacy-conscious analytics requires cookie consent
       infrastructure not in scope for phase 1–2.

       **5. File storage for media and resources**
       Decision: `storageKey` is stored as a string; actual S3/object-storage
       integration is deferred (same pattern as existing `DocumentsService`
       which returns a placeholder download URL).  `MediaService.createMedia`
       accepts `storageKey` only from authenticated internal calls, not from
       public input.

       **6. Domain TLS provisioning**
       Decision: TLS provisioning is a stub.  `DomainsService.verifyDomain`
       sets `verificationStatus=VERIFIED` immediately without external DNS
       lookup.  The field `tlsStatus` is stored for future Let's Encrypt /
       Caddy integration.

       **7. Public API tenant resolution in development**
       Decision: In development (when `NODE_ENV !== 'production'`), if the
       `Host` header resolves to no domain record, the public controller falls
       back to the first PUBLISHED website for the demo tenant.  This is
       disabled in production — `resolveTenantFromHostname` always throws 404
       for unverified hostnames.

       Files: `docs/OPEN_DECISIONS.md`

       Verify: File exists and is valid Markdown.
       `pnpm --filter @rims/api type-check` and `pnpm --filter @rims/web type-check`
       still pass (no code change in this step).

---

## Digest

### Files the plan touches and their relevant blocks

| File | Block / signature | Test that covers it | Verified today |
|---|---|---|---|
| `prisma/schema.prisma` | Entire file — add enums, back-relations, 19 new models | `pnpm prisma:validate` | Validated: file exists, last model is `AnalyticsSnapshot` |
| `prisma/seed.ts` | `ALL_PERMISSION_CODES` array; `main()` function body | `pnpm prisma:seed` (runs without error) | Read in full; last block is `DocumentFolder` demo seed |
| `apps/api/src/modules/roles/roles.service.ts` | `ALL_PERMISSION_CODES` array (line ~4–60); `DEFAULT_ROLES` (line ~62–180) | `pnpm --filter @rims/api test` | Read in full; array currently ends at `"documents.archive"` |
| `apps/api/src/app.module.ts` | `imports` array; `configure()` method `.exclude(...)` call | `pnpm --filter @rims/api type-check` | Read in full; current exclusions: health, auth/login, auth/reset-password, auth/accept-invitation |
| `apps/api/src/modules/institutional-web/*` (new) | All new files — see Step 3 | `pnpm --filter @rims/api type-check` | N/A (new) |
| `apps/public-web/*` (new) | All new files — see Step 5 | `pnpm --filter @rims/public-web type-check` | N/A (new) |
| `apps/web/src/pages/website/*` (new) | All 10 new page components — see Step 7 | `pnpm --filter @rims/web type-check` | N/A (new) |
| `apps/web/src/router.tsx` | Lazy imports block; `children` routes array | `pnpm --filter @rims/web type-check` | Read in full; last route is `/analytics/ai-report` |
| `apps/web/src/layouts/AppShell.tsx` | `NAV_ITEMS` array; `getPageName()` function; lucide-react import line | `pnpm --filter @rims/web type-check` | Read in full; `Globe` icon not yet imported |
| `docs/OPEN_DECISIONS.md` (new) | Entire file | N/A | N/A (new) |

### Build and test commands confirmed from code

- Schema validation: `pnpm prisma:validate` (root `package.json` script)
- Seed: `pnpm prisma:seed` (root `package.json` script — runs `ts-node prisma/seed.ts`)
- API type-check: `pnpm --filter @rims/api type-check` (`tsc --noEmit`)
- API build: `pnpm --filter @rims/api build` (`nest build`)
- API test: `pnpm --filter @rims/api test` (`jest --passWithNoTests`)
- Web type-check: `pnpm --filter @rims/web type-check` (`tsc --noEmit`)
- Web build: `pnpm --filter @rims/web build` (`tsc --noEmit && vite build`)
- Web test: `pnpm --filter @rims/web test` (`vitest run --passWithNoTests`)
- public-web type-check: `pnpm --filter @rims/public-web type-check` (`tsc --noEmit`)
- public-web build: `pnpm --filter @rims/public-web build` (`next build`)
- Full build: `pnpm turbo run build` (Turborepo, root)

### Patterns to match exactly

- **Services:** `constructor(private readonly prisma: PrismaService, private readonly auditService: AuditService)` — always both; always filter with `tenantId`; throw `NotFoundException` for tenant-scoped misses.
- **Controllers:** `@Controller('...')` + `@UseGuards(JwtAuthGuard, PermissionsGuard)` at class level; `@RequirePermissions(...)` per handler; `@CurrentUser() user: JwtPayload` for tenant/actor.
- **Public routes:** `@Public()` from `jwt-auth.guard.ts` (`IS_PUBLIC_KEY`) — apply to public controller class; resolve tenant from `Host` header only.
- **Modules:** `imports: [AuditModule]`, providers list, controllers list, `exports` of services — matches `PublicationsModule` and `DocumentsModule`.
- **DTOs:** `class-validator` decorators, `@IsOptional()` on nullable fields, `@IsEnum(EnumName)` for enum fields, `@IsInt() @Min(1)` for pagination params.
- **Audit:** `this.auditService.log({ tenantId, actorId, action: 'resource.verb', resourceType: 'ModelName', resourceId: id, outcome: 'SUCCESS' })` — call after every write that the spec requires to be audited (publish, approve, unpublish, domain operations).
- **Dashboard pages:** named function export (not default), `useAuthStore(s => s.hasPermission)` for conditional rendering of action buttons, `@rims/ui` components only — no raw HTML form elements outside `@rims/ui` wrappers, `useQuery` key arrays for cache invalidation.
