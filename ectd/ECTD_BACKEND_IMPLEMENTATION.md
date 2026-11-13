# ProgrammoCeuticals Standalone eCTD Application
## Backend Implementation Specification for Amazon Q and Codex

**Document status:** Architecture / implementation contract
**Primary target:** eCTD v4.0 backend
**Primary language:** TypeScript
**Backend framework:** NestJS
**Database:** PostgreSQL
**ORM:** Prisma
**Monorepo:** pnpm + Turborepo
**Initial implementation priority:** Backend first

> This document is the implementation contract for the backend. It is intentionally strict about regulatory source-of-truth. AI coding agents must never invent eCTD requirements, XML structures, controlled vocabulary values, lifecycle behavior, validation rules, or regional requirements. When the supplied authoritative regulatory package does not establish a behavior, the implementation must flag the gap rather than guess.

---

# 1. Product Definition

ProgrammoCeuticals eCTD is a standalone regulatory submission management application.

It is **not** an extension of the ProgrammoCeuticals CTD Dossier Compiler and must function independently of that product.

The two products may later integrate through an import/export workflow, but the eCTD application's core operation must not depend on the Dossier Compiler.

### Core responsibilities

- Manage regulatory applications.
- Manage submissions and Submission Units/sequences.
- Manage CTD contexts.
- Manage Documents and physical Document Versions.
- Manage eCTD lifecycle operations at Context of Use level.
- Support document reuse and references.
- Load versioned ICH/regional regulatory packages.
- Generate eCTD v4.0 XML.
- Validate XML and regulatory/business rules.
- Build immutable submission packages.
- Maintain auditable regulatory history.
- Provide API access for web UI, future desktop application, and CLI.

### Explicit non-goals for the core MVP

- Automatic regulatory decision-making by AI.
- Transmission to every regulator.
- Payment/subscription system.
- Public document hosting.
- Dependence on the existing Dossier Compiler.

---

# 2. Regulatory Source of Truth

The regulatory source of truth is the authoritative package supplied by the relevant regulatory organization.

## Current ICH baseline

As of September 2026, the ICH eCTD v4.0 page lists:

- ICH eCTD v4.0 Implementation Guide v1.7.
- ICH eCTD v4.0 Controlled Vocabulary Package v1.0.3.
- The Implementation Guide package includes the Implementation Guide and schema files.
- The Controlled Vocabulary package includes the harmonized Code List and Genericode files.
- The ICH materials must be used together with applicable Regional/Module 1 materials.

The implementation must pin exact package versions and checksums for every regulatory package used.

## Regulatory package components

Treat the following as separate components:

1. Implementation Guide.
2. Schema package.
3. Controlled Vocabulary package.
4. Genericode/code-list data.
5. CTD table-of-contents structure.
6. ICH validation criteria/rules.
7. Submission Format Specification.
8. Regional/Module 1 Implementation Guide.
9. Regional Controlled Vocabulary.
10. Regional validation criteria.
11. Regional technical conformance guidance.
12. Regional transmission specification.
13. Supportive examples/sample XML where authoritative.

## Regulatory version rule

Never use a generic "latest" regulatory configuration while validating a historical Submission Unit.

A Submission Unit must resolve to a concrete regulatory profile containing exact versions/checksums.

---

# 3. Regulatory Package Registry

The backend must maintain a registry of installed regulatory packages.

## Package identity

Each package should have:

- internal ID
- name
- package type
- authority
- region
- version
- source URI
- source filename
- SHA-256 checksum
- imported timestamp
- effective date
- status

## Package statuses

Use application-controlled statuses such as:

- IMPORTING
- ACTIVE
- SUPERSEDED
- RETIRED
- FAILED

These are application statuses, not regulatory XML status codes.

## Package immutability

Once a regulatory package is imported, do not modify its source files.

A new regulatory revision creates a new package record.

Old packages remain available for historical validation/reproducibility.

## Package import behavior

Import pipeline:

```text
Receive package
  -> verify archive/checksum
  -> validate package structure
  -> parse metadata
  -> import schemas
  -> import code lists/Genericode
  -> import relevant configuration
  -> run consistency checks
  -> register immutable package
  -> activate only after successful import
```

A failed import must never partially activate.

---

# 4. Architecture Principles

## 4.1 Domain-first

Controllers are thin. Regulatory/business logic belongs in application/domain services.

## 4.2 Regulatory/data separation

Do not hard-code controlled vocabularies or regulatory requirements into React, controllers, or arbitrary service code.

## 4.3 Persistence/XML separation

Prisma entities are not XML objects.

The pipeline is:

```text
PostgreSQL/Prisma
 -> repository
 -> domain aggregate
 -> regulatory resolver
 -> eCTD XML model
 -> serializer
 -> XSD validation
```

## 4.4 Immutable history

Published Submission Units, finalized packages, regulatory artifacts, and audit records are immutable.

## 4.5 Fail closed

Missing schema, unresolved identifier, invalid lifecycle relationship, missing physical file, or failed validation must block publication where the applicable rules require it.

## 4.6 No regulatory guessing

Never infer a regulatory rule because it seems logical.

Record an unresolved requirement as `REGULATORY_GAP` and stop the affected implementation path until resolved from an authoritative source.

---

# 5. Technology Stack

- TypeScript with strict mode.
- NestJS for API/application services.
- PostgreSQL for relational state.
- Prisma for persistence.
- pnpm for package management.
- Turborepo for monorepo orchestration.
- Redis + BullMQ for background jobs.
- Docker for development/deployment.
- OpenAPI for API contract.
- Argon2id for password hashing.
- SHA-256 for file/package integrity where required.

Do not introduce another ORM or second persistence model without architectural review.

---

# 6. Repository Structure

```text
ectd-platform/
├── apps/
│   ├── api/
│   ├── worker-validation/
│   ├── worker-publishing/
│   └── worker-inspection/
│
├── packages/
│   ├── ectd-domain/
│   ├── ectd-standards/
│   ├── ectd-documents/
│   ├── ectd-lifecycle/
│   ├── ectd-validation/
│   ├── ectd-xml/
│   ├── ectd-publishing/
│   ├── ectd-storage/
│   └── shared/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed/
│
├── regulatory/
│   └── packages/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── contract/
│   ├── regulatory/
│   ├── xml/
│   └── e2e/
│
├── docker/
├── docs/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---


# 7. Complete Prisma Database Schema

This section is the **implementation schema baseline** for PostgreSQL + Prisma. It is deliberately included in this master document so Amazon Q and Codex do not have to reconstruct the persistence layer from prose.

Important implementation rules:

- `id` is the internal PostgreSQL primary key.
- `uuid` is the regulatory/application identifier where the domain requires one.
- Regulatory controlled values remain `String` in the persistence model unless and until they are backed by an authoritative versioned controlled vocabulary.
- Regulatory records are protected against destructive deletion at the service layer and, where appropriate, with `RESTRICT`-style referential actions in migrations.
- `Json` fields are extension points for regional/application metadata, not substitutes for modeled core regulatory entities.
- The schema below is the application persistence model; it is **not** a copy of the ICH XML schema.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================
// ORGANIZATION / ACCESS CONTROL
// ============================================================

model Organization {
  id          String   @id @default(uuid())
  name        String
  code        String?  @unique
  type        String?
  address     String?
  countryCode String?
  email       String?
  phone       String?
  website     String?
  status      String   @default("ACTIVE")

  users        User[]
  products     Product[]
  applications RegulatoryApplication[]
  senderCodeLists SenderCodeList[]
  auditEvents  AuditEvent[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([name])
  @@index([status])
}

model User {
  id             String   @id @default(uuid())
  organizationId String?

  name         String
  email        String
  passwordHash String?
  status       String   @default("ACTIVE")
  isSuperAdmin Boolean  @default(false)

  organization Organization? @relation(
    fields: [organizationId],
    references: [id],
    onDelete: SetNull
  )

  roles         UserRole[]
  sessions      Session[]
  refreshTokens RefreshToken[]
  auditEvents   AuditEvent[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([organizationId, email])
  @@index([email])
  @@index([organizationId])
  @@index([isSuperAdmin])
}

model Role {
  id          String @id @default(uuid())
  name        String @unique
  description String?
  scope       String @default("ORGANIZATION")
  active      Boolean @default(true)

  permissions RolePermission[]
  users       UserRole[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Permission {
  id          String @id @default(uuid())
  code        String @unique
  description String?
  active      Boolean @default(true)

  roles RolePermission[]

  createdAt DateTime @default(now())
}

model RolePermission {
  id           String @id @default(uuid())
  roleId       String
  permissionId String

  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])
  @@index([roleId])
  @@index([permissionId])
}

model UserRole {
  id       String @id @default(uuid())
  userId   String
  roleId   String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([userId, roleId])
  @@index([userId])
  @@index([roleId])
}

model RefreshToken {
  id        String   @id @default(uuid())
  userId    String
  tokenHash String   @unique
  expiresAt DateTime
  revokedAt DateTime?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@index([userId])
  @@index([expiresAt])
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  sessionToken String   @unique
  ipAddress    String?
  userAgent    String?
  expiresAt    DateTime
  revokedAt    DateTime?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@index([userId])
  @@index([expiresAt])
}

// ============================================================
// PRODUCTS / AUTHORITIES / REGIONS
// ============================================================

model Product {
  id             String   @id @default(uuid())
  organizationId String

  productName           String
  genericName           String?
  brandName             String?
  activeIngredient      String?
  dosageForm            String?
  strength              String?
  routeOfAdministration String?
  productCode           String?
  status                String   @default("ACTIVE")

  organization Organization @relation(
    fields: [organizationId],
    references: [id],
    onDelete: Restrict
  )

  applications RegulatoryApplication[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([organizationId])
  @@index([productName])
  @@index([status])
}

model RegulatoryAuthority {
  id          String  @id @default(uuid())
  name        String
  code        String  @unique
  countryCode String?
  website     String?
  active      Boolean @default(true)

  applications           RegulatoryApplication[]
  regionalSpecifications RegionalSpecification[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([name])
}

model RegulatoryRegion {
  id          String  @id @default(uuid())
  name        String
  code        String  @unique
  countryCode String?
  active      Boolean @default(true)

  applications          RegulatoryApplication[]
  regionalSpecifications RegionalSpecification[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([name])
}

// ============================================================
// REGULATORY STANDARD / PACKAGE REGISTRY
// ============================================================

model EctdStandard {
  id String @id @default(uuid())

  name                        String
  version                     String
  implementationGuideVersion  String?
  controlledVocabularyVersion String?
  status                      String  @default("ACTIVE")

  effectiveFrom  DateTime?
  effectiveUntil DateTime?

  implementationGuideId String?

  implementationGuide ImplementationGuide? @relation(
    fields: [implementationGuideId],
    references: [id],
    onDelete: Restrict
  )

  controlledVocabularyLinks RegulatoryStandardCvLink[]

  applications           RegulatoryApplication[]
  regionalSpecifications RegionalSpecification[]
  validationProfiles     ValidationProfile[]
  validationRules        ValidationRule[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([name, version])
  @@index([status])
}

model ImplementationGuide {
  id      String @id @default(uuid())
  name    String
  version String

  sourceUri String?
  checksum  String?
  status    String @default("ACTIVE")

  sourceArtifactId String? @unique

  standards EctdStandard[]

  sourceArtifact RegulatoryArtifact? @relation(
    fields: [sourceArtifactId],
    references: [id],
    onDelete: Restrict
  )

  createdAt DateTime @default(now())

  @@unique([name, version])
}

model ControlledVocabularyPackage {
  id      String @id @default(uuid())
  name    String
  version String

  sourceUri String?
  checksum  String?
  status    String @default("ACTIVE")

  sourceArtifactId String? @unique

  standards RegulatoryStandardCvLink[]
  codeLists CodeList[]

  sourceArtifact RegulatoryArtifact? @relation(
    fields: [sourceArtifactId],
    references: [id],
    onDelete: Restrict
  )

  createdAt DateTime @default(now())

  @@unique([name, version])
}

// Explicit link because one CV package can be reused by multiple standards/configurations.
model RegulatoryStandardCvLink {
  id String @id @default(uuid())

  ectdStandardId              String
  controlledVocabularyPackageId String

  ectdStandard EctdStandard @relation(
    fields: [ectdStandardId],
    references: [id],
    onDelete: Restrict
  )

  controlledVocabularyPackage ControlledVocabularyPackage @relation(
    fields: [controlledVocabularyPackageId],
    references: [id],
    onDelete: Restrict
  )

  @@unique([ectdStandardId, controlledVocabularyPackageId])
  @@index([ectdStandardId])
  @@index([controlledVocabularyPackageId])
}

model RegulatoryArtifact {
  id String @id @default(uuid())

  artifactType String
  name         String
  version      String

  sourceUri      String?
  sourceFilename String?
  checksum       String
  storageKey     String?

  importedAt   DateTime @default(now())
  importedById String?
  status       String   @default("IMPORTED")

  metadata Json?

  implementationGuide     ImplementationGuide?
  controlledVocabularyPackage ControlledVocabularyPackage?

  @@index([artifactType])
  @@index([name, version])
  @@index([checksum])
}

model CodeSystem {
  id String @id @default(uuid())

  oid         String @unique
  name        String
  ownerType   String?
  description String?
  active      Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model CodeList {
  id String @id @default(uuid())

  controlledVocabularyPackageId String

  name        String
  oid         String?
  ownerType   String?
  description String?

  controlledVocabularyPackage ControlledVocabularyPackage @relation(
    fields: [controlledVocabularyPackageId],
    references: [id],
    onDelete: Restrict
  )

  versions CodeListVersion[]

  createdAt DateTime @default(now())

  @@index([controlledVocabularyPackageId])
}

model CodeListVersion {
  id         String @id @default(uuid())
  codeListId String

  version String
  status  String @default("ACTIVE")

  codeList CodeList @relation(
    fields: [codeListId],
    references: [id],
    onDelete: Restrict
  )

  values CodeListValue[]

  createdAt DateTime @default(now())

  @@unique([codeListId, version])
  @@index([codeListId])
}

model CodeListValue {
  id                String @id @default(uuid())
  codeListVersionId String

  code        String
  displayName String
  definition  String?
  status      String?
  order       Int?

  codeListVersion CodeListVersion @relation(
    fields: [codeListVersionId],
    references: [id],
    onDelete: Restrict
  )

  @@unique([codeListVersionId, code])
  @@index([codeListVersionId])
}

model RegionalSpecification {
  id String @id @default(uuid())

  name   String
  version String

  regionId        String
  authorityId     String?
  ectdStandardId  String

  status String @default("ACTIVE")

  effectiveFrom  DateTime?
  effectiveUntil DateTime?

  region RegulatoryRegion @relation(
    fields: [regionId],
    references: [id],
    onDelete: Restrict
  )

  authority RegulatoryAuthority? @relation(
    fields: [authorityId],
    references: [id],
    onDelete: Restrict
  )

  ectdStandard EctdStandard @relation(
    fields: [ectdStandardId],
    references: [id],
    onDelete: Restrict
  )

  applications     RegulatoryApplication[]
  validationProfiles ValidationProfile[]
  validationRules  ValidationRule[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([regionId, authorityId, name, version])
  @@index([regionId])
  @@index([authorityId])
  @@index([ectdStandardId])
}

// ============================================================
// APPLICATION / SUBMISSION MODEL
// ============================================================

model RegulatoryApplication {
  id   String @id @default(uuid())
  uuid String @unique

  organizationId String
  productId      String
  authorityId    String
  regionId       String

  ectdStandardId          String
  regionalSpecificationId String

  applicationNumber String?
  applicationType   String?
  status            String @default("DRAFT")

  regionalMetadata Json?

  organization Organization @relation(
    fields: [organizationId],
    references: [id],
    onDelete: Restrict
  )

  product Product @relation(
    fields: [productId],
    references: [id],
    onDelete: Restrict
  )

  authority RegulatoryAuthority @relation(
    fields: [authorityId],
    references: [id],
    onDelete: Restrict
  )

  region RegulatoryRegion @relation(
    fields: [regionId],
    references: [id],
    onDelete: Restrict
  )

  ectdStandard EctdStandard @relation(
    fields: [ectdStandardId],
    references: [id],
    onDelete: Restrict
  )

  regionalSpecification RegionalSpecification @relation(
    fields: [regionalSpecificationId],
    references: [id],
    onDelete: Restrict
  )

  submissions Submission[]
  keywordDefinitions KeywordDefinition[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([organizationId])
  @@index([productId])
  @@index([authorityId])
  @@index([regionId])
  @@index([applicationNumber])
}

model Submission {
  id   String @id @default(uuid())
  uuid String @unique

  applicationId String

  submissionType String?
  description    String?
  status         String @default("DRAFT")
  metadata       Json?

  application RegulatoryApplication @relation(
    fields: [applicationId],
    references: [id],
    onDelete: Restrict
  )

  submissionUnits SubmissionSubmissionUnit[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([applicationId])
  @@index([status])
}

model SubmissionUnit {
  id   String @id @default(uuid())
  uuid String @unique

  sequenceNumber Int
  priorityNumber Int?

  ectdStandardId          String
  regionalSpecificationId String?
  ctdStructurePackageId   String?

  status   String @default("DRAFT")
  metadata Json?

  submissions SubmissionSubmissionUnit[]

  contextsOfUse      ContextOfUse[]
  lifecycleOperations LifecycleOperation[]
  snapshots           SubmissionUnitSnapshot[]
  packages            SubmissionPackage[]
  xmlGenerationRuns   XmlGenerationRun[]
  validationRuns      ValidationRun[]

  ectdStandard EctdStandard @relation(
    fields: [ectdStandardId],
    references: [id],
    onDelete: Restrict
  )

  regionalSpecification RegionalSpecification? @relation(
    fields: [regionalSpecificationId],
    references: [id],
    onDelete: Restrict
  )

  ctdStructurePackage CtdStructurePackage? @relation(
    fields: [ctdStructurePackageId],
    references: [id],
    onDelete: Restrict
  )

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([sequenceNumber])
  @@index([ectdStandardId])
  @@index([regionalSpecificationId])
  @@index([status])
}

model SubmissionSubmissionUnit {
  id String @id @default(uuid())

  submissionId     String
  submissionUnitId String

  relationshipType String?

  submission Submission @relation(
    fields: [submissionId],
    references: [id],
    onDelete: Restrict
  )

  submissionUnit SubmissionUnit @relation(
    fields: [submissionUnitId],
    references: [id],
    onDelete: Restrict
  )

  createdAt DateTime @default(now())

  @@unique([submissionId, submissionUnitId])
  @@index([submissionId])
  @@index([submissionUnitId])
}

// ============================================================
// CTD STRUCTURE
// ============================================================

model CtdStructurePackage {
  id String @id @default(uuid())

  name    String
  version String

  standardId              String?
  regionalSpecificationId String?

  sourceUri String?
  checksum  String?
  status    String @default("ACTIVE")

  standard EctdStandard? @relation(
    fields: [standardId],
    references: [id],
    onDelete: Restrict
  )

  regionalSpecification RegionalSpecification? @relation(
    fields: [regionalSpecificationId],
    references: [id],
    onDelete: Restrict
  )

  modules CtdModule[]
  contextDefinitions ContextDefinition[]
  submissionUnits SubmissionUnit[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([name, version])
  @@index([standardId])
  @@index([regionalSpecificationId])
}

model CtdModule {
  id String @id @default(uuid())

  packageId String

  moduleNumber String
  title        String
  displayOrder Int

  package  CtdStructurePackage @relation(
    fields: [packageId],
    references: [id],
    onDelete: Restrict
  )

  sections CtdSection[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([packageId, moduleNumber])
  @@index([packageId])
}

model CtdSection {
  id String @id @default(uuid())

  moduleId String
  parentId String?

  sectionCode  String
  title        String
  level        Int
  displayOrder Int

  module CtdModule @relation(
    fields: [moduleId],
    references: [id],
    onDelete: Restrict
  )

  parent CtdSection? @relation(
    "CtdSectionTree",
    fields: [parentId],
    references: [id],
    onDelete: Restrict
  )

  children CtdSection[] @relation("CtdSectionTree")

  contextsOfUse ContextOfUse[]
  contextDefinitions ContextDefinition[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([moduleId, sectionCode])
  @@index([moduleId])
  @@index([parentId])
}

model ContextDefinition {
  id String @id @default(uuid())

  structurePackageId String
  ctdSectionId      String

  code       String
  codeSystem String

  name        String
  description String?

  structurePackage CtdStructurePackage @relation(
    fields: [structurePackageId],
    references: [id],
    onDelete: Restrict
  )

  ctdSection CtdSection @relation(
    fields: [ctdSectionId],
    references: [id],
    onDelete: Restrict
  )

  contextsOfUse ContextOfUse[]

  @@unique([structurePackageId, code, codeSystem])
  @@index([ctdSectionId])
}

// ============================================================
// DOCUMENTS / REFERENCES
// ============================================================

model Document {
  id   String @id @default(uuid())
  uuid String @unique

  title    String
  filename String
  mimeType String
  language String?

  currentVersionId String? @unique

  versions       DocumentVersion[]
  currentVersion DocumentVersion? @relation(
    "CurrentDocumentVersion",
    fields: [currentVersionId],
    references: [id],
    onDelete: Restrict
  )

  contextsOfUse ContextOfUse[]

  outgoingRelationships DocumentRelationship[]
    @relation("SourceDocumentRelationship")

  incomingRelationships DocumentRelationship[]
    @relation("TargetDocumentRelationship")

  outgoingReferences DocumentReference[]
    @relation("SourceDocumentReference")

  incomingReferences DocumentReference[]
    @relation("TargetDocumentReference")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([title])
  @@index([mimeType])
}

model DocumentVersion {
  id String @id @default(uuid())

  documentId String
  versionNumber Int

  filename   String
  storageKey String
  mimeType   String?
  language   String?

  fileSize          BigInt
  checksum          String
  checksumAlgorithm String

  createdById String?

  document Document @relation(
    "DocumentVersions",
    fields: [documentId],
    references: [id],
    onDelete: Restrict
  )

  currentFor Document? @relation(
    "CurrentDocumentVersion"
  )

  links DocumentLink[]

  createdAt DateTime @default(now())

  @@unique([documentId, versionNumber])
  @@index([documentId])
  @@index([checksum])
}

model ContextOfUse {
  id   String @id @default(uuid())
  uuid String @unique

  submissionUnitId String
  documentId       String
  contextDefinitionId String

  priorityNumber Int?
  status         String @default("ACTIVE")

  submissionUnit SubmissionUnit @relation(
    fields: [submissionUnitId],
    references: [id],
    onDelete: Restrict
  )

  document Document @relation(
    fields: [documentId],
    references: [id],
    onDelete: Restrict
  )

  contextDefinition ContextDefinition @relation(
    fields: [contextDefinitionId],
    references: [id],
    onDelete: Restrict
  )

  keywords ContextKeyword[]
  lifecycleOperations LifecycleOperation[]

  sourceRelationships ContextOfUseRelationship[]
    @relation("SourceContext")

  targetRelationships ContextOfUseRelationship[]
    @relation("TargetContext")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([submissionUnitId])
  @@index([documentId])
  @@index([contextDefinitionId])
  @@index([status])
}

model DocumentRelationship {
  id String @id @default(uuid())

  sourceDocumentId String
  targetDocumentId String
  relationshipType String

  metadata Json?

  sourceDocument Document @relation(
    "SourceDocumentRelationship",
    fields: [sourceDocumentId],
    references: [id],
    onDelete: Restrict
  )

  targetDocument Document @relation(
    "TargetDocumentRelationship",
    fields: [targetDocumentId],
    references: [id],
    onDelete: Restrict
  )

  createdAt DateTime @default(now())

  @@index([sourceDocumentId])
  @@index([targetDocumentId])
  @@index([relationshipType])
}

model DocumentReference {
  id String @id @default(uuid())

  sourceDocumentId String
  targetDocumentId String

  referenceType String?
  location      String?
  description   String?

  sourceDocument Document @relation(
    "SourceDocumentReference",
    fields: [sourceDocumentId],
    references: [id],
    onDelete: Restrict
  )

  targetDocument Document @relation(
    "TargetDocumentReference",
    fields: [targetDocumentId],
    references: [id],
    onDelete: Restrict
  )

  createdAt DateTime @default(now())

  @@index([sourceDocumentId])
  @@index([targetDocumentId])
}

model DocumentLink {
  id String @id @default(uuid())

  sourceDocumentVersionId String

  targetType       String
  targetDocumentId String?
  targetUri        String?

  pageNumber Int?
  anchorText String?
  status     String @default("UNVALIDATED")

  metadata Json?

  sourceDocumentVersion DocumentVersion @relation(
    fields: [sourceDocumentVersionId],
    references: [id],
    onDelete: Restrict
  )

  createdAt DateTime @default(now())

  @@index([sourceDocumentVersionId])
  @@index([targetDocumentId])
  @@index([status])
}

model EctdReference {
  id String @id @default(uuid())

  referenceType String
  root          String?
  extension     String?

  sourceEntityType String
  sourceEntityId   String

  metadata Json?

  createdAt DateTime @default(now())

  @@index([referenceType])
  @@index([root])
  @@index([sourceEntityType, sourceEntityId])
}

// ============================================================
// LIFECYCLE / KEYWORDS
// ============================================================

model LifecycleOperation {
  id String @id @default(uuid())

  submissionUnitId String
  contextOfUseId   String

  operationType String
  reason        String?

  createdById String?

  submissionUnit SubmissionUnit @relation(
    fields: [submissionUnitId],
    references: [id],
    onDelete: Restrict
  )

  contextOfUse ContextOfUse @relation(
    fields: [contextOfUseId],
    references: [id],
    onDelete: Restrict
  )

  createdAt DateTime @default(now())

  @@index([submissionUnitId])
  @@index([contextOfUseId])
  @@index([operationType])
}

model ContextOfUseRelationship {
  id String @id @default(uuid())

  sourceContextId String
  targetContextId String

  relationshipType String

  metadata Json?

  sourceContext ContextOfUse @relation(
    "SourceContext",
    fields: [sourceContextId],
    references: [id],
    onDelete: Restrict
  )

  targetContext ContextOfUse @relation(
    "TargetContext",
    fields: [targetContextId],
    references: [id],
    onDelete: Restrict
  )

  createdAt DateTime @default(now())

  @@index([sourceContextId])
  @@index([targetContextId])
  @@index([relationshipType])
}

model KeywordDefinition {
  id String @id @default(uuid())

  applicationId String

  code        String
  name        String
  description String?
  dataType    String

  allowedValues Json?

  application RegulatoryApplication @relation(
    fields: [applicationId],
    references: [id],
    onDelete: Restrict
  )

  keywords ContextKeyword[]

  createdAt DateTime @default(now())

  @@unique([applicationId, code])
  @@index([applicationId])
}

model ContextKeyword {
  id String @id @default(uuid())

  contextOfUseId      String
  keywordDefinitionId String

  value String

  contextOfUse ContextOfUse @relation(
    fields: [contextOfUseId],
    references: [id],
    onDelete: Restrict
  )

  keywordDefinition KeywordDefinition @relation(
    fields: [keywordDefinitionId],
    references: [id],
    onDelete: Restrict
  )

  createdAt DateTime @default(now())

  @@unique([contextOfUseId, keywordDefinitionId])
  @@index([contextOfUseId])
  @@index([keywordDefinitionId])
}

model SenderCodeList {
  id String @id @default(uuid())

  organizationId String
  applicationId  String?

  name        String
  oid         String?
  description String?

  organization Organization @relation(
    fields: [organizationId],
    references: [id],
    onDelete: Restrict
  )

  values SenderCodeListValue[]

  createdAt DateTime @default(now())

  @@index([organizationId])
  @@index([applicationId])
}

model SenderCodeListValue {
  id String @id @default(uuid())

  codeListId String
  code        String
  displayName String
  definition  String?

  codeList SenderCodeList @relation(
    fields: [codeListId],
    references: [id],
    onDelete: Restrict
  )

  createdAt DateTime @default(now())

  @@unique([codeListId, code])
  @@index([codeListId])
}

// ============================================================
// VALIDATION
// ============================================================

model ValidationProfile {
  id String @id @default(uuid())

  name        String
  version     String
  description String?

  ectdStandardId          String
  regionalSpecificationId String?

  rulesetVersion String
  active         Boolean @default(true)

  ectdStandard EctdStandard @relation(
    fields: [ectdStandardId],
    references: [id],
    onDelete: Restrict
  )

  regionalSpecification RegionalSpecification? @relation(
    fields: [regionalSpecificationId],
    references: [id],
    onDelete: Restrict
  )

  validationRuns ValidationRun[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([name, version])
  @@index([ectdStandardId])
  @@index([regionalSpecificationId])
}

model ValidationRule {
  id String @id @default(uuid())

  ruleCode    String
  name        String
  description String?

  severity String
  scope    String
  source   String
  version  String

  standardId              String?
  regionalSpecificationId String?

  ruleDefinition Json

  active Boolean @default(true)

  ectdStandard EctdStandard? @relation(
    fields: [standardId],
    references: [id],
    onDelete: Restrict
  )

  regionalSpecification RegionalSpecification? @relation(
    fields: [regionalSpecificationId],
    references: [id],
    onDelete: Restrict
  )

  results ValidationResult[]
  sources RegulatoryRuleSource[]

  createdAt DateTime @default(now())

  @@unique([ruleCode, version])
  @@index([standardId])
  @@index([regionalSpecificationId])
  @@index([source])
}

model RegulatoryRuleSource {
  id String @id @default(uuid())

  validationRuleId String

  authority        String
  documentName     String
  documentVersion  String
  sectionReference String?
  sourceUri        String?

  validationRule ValidationRule @relation(
    fields: [validationRuleId],
    references: [id],
    onDelete: Restrict
  )

  createdAt DateTime @default(now())

  @@index([validationRuleId])
}

model ValidationRun {
  id String @id @default(uuid())

  submissionUnitId String
  validationProfileId String

  status String

  startedAt   DateTime @default(now())
  completedAt DateTime?

  engineVersion  String?
  profileVersion String?

  submissionUnit SubmissionUnit @relation(
    fields: [submissionUnitId],
    references: [id],
    onDelete: Restrict
  )

  validationProfile ValidationProfile @relation(
    fields: [validationProfileId],
    references: [id],
    onDelete: Restrict
  )

  results ValidationResult[]

  @@index([submissionUnitId])
  @@index([validationProfileId])
  @@index([status])
}

model ValidationResult {
  id String @id @default(uuid())

  validationRunId String
  ruleId          String

  severity String
  status   String

  message String

  entityType String?
  entityId   String?
  location   String?

  evidence    Json?
  remediation String?

  validationRun ValidationRun @relation(
    fields: [validationRunId],
    references: [id],
    onDelete: Restrict
  )

  rule ValidationRule @relation(
    fields: [ruleId],
    references: [id],
    onDelete: Restrict
  )

  createdAt DateTime @default(now())

  @@index([validationRunId])
  @@index([ruleId])
  @@index([entityType, entityId])
  @@index([severity, status])
}

// ============================================================
// SNAPSHOT / XML / PUBLISHING
// ============================================================

model SubmissionUnitSnapshot {
  id String @id @default(uuid())

  submissionUnitId String
  snapshotVersion Int

  payload Json

  ectdStandardId          String?
  regionalSpecificationId String?
  ctdStructurePackageId   String?

  createdById String?
  createdAt  DateTime @default(now())

  submissionUnit SubmissionUnit @relation(
    fields: [submissionUnitId],
    references: [id],
    onDelete: Restrict
  )

  @@unique([submissionUnitId, snapshotVersion])
  @@index([submissionUnitId])
}

model XmlGenerationRun {
  id String @id @default(uuid())

  submissionUnitId String

  standardId String?
  implementationGuideVersion String?
  controlledVocabularyVersion String?
  schemaPackageChecksum String?

  generatorVersion String
  status          String

  outputStorageKey String?

  createdAt DateTime @default(now())

  submissionUnit SubmissionUnit @relation(
    fields: [submissionUnitId],
    references: [id],
    onDelete: Restrict
  )

  @@index([submissionUnitId])
  @@index([status])
}

model SubmissionPackage {
  id String @id @default(uuid())

  submissionUnitId String
  packageVersion  Int

  storageKey String
  fileSize   BigInt

  checksum          String
  checksumAlgorithm String

  validationRunId    String?
  xmlGenerationRunId String?

  generatorVersion String?
  status           String

  generatedById String?
  generatedAt   DateTime @default(now())

  submissionUnit SubmissionUnit @relation(
    fields: [submissionUnitId],
    references: [id],
    onDelete: Restrict
  )

  @@unique([submissionUnitId, packageVersion])
  @@index([submissionUnitId])
  @@index([checksum])
  @@index([status])
}

// ============================================================
// BACKGROUND JOBS / AUDIT
// ============================================================

model Job {
  id String @id @default(uuid())

  jobType String
  status  String

  payload Json?

  progress     Int @default(0)
  currentStep  String?

  attempts Int @default(0)

  errorCode    String?
  errorMessage String?

  idempotencyKey String? @unique
  correlationId  String?

  createdAt   DateTime @default(now())
  startedAt   DateTime?
  completedAt DateTime?

  @@index([jobType])
  @@index([status])
  @@index([createdAt])
  @@index([correlationId])
}

model AuditEvent {
  id String @id @default(uuid())

  organizationId String
  userId         String?

  eventType String
  entityType String
  entityId   String

  oldValue Json?
  newValue Json?
  metadata Json?

  correlationId String?

  timestamp DateTime @default(now())

  organization Organization @relation(
    fields: [organizationId],
    references: [id],
    onDelete: Restrict
  )

  user User? @relation(
    fields: [userId],
    references: [id],
    onDelete: SetNull
  )

  @@index([organizationId])
  @@index([entityType, entityId])
  @@index([timestamp])
  @@index([correlationId])
}
```

## 6A.1 Super Admin model

The application has two authorization scopes:

```text
SYSTEM
└── SUPER_ADMIN

ORGANIZATION
├── ORGANIZATION_ADMIN
├── REGULATORY_MANAGER
├── AUTHOR
├── REVIEWER
└── VIEWER
```

`User.isSuperAdmin` identifies the system-level capability, while `Role.scope` distinguishes system roles from organization-scoped roles. The definitive authorization check must be performed server-side.

### Super Admin responsibilities

Super Admin may manage system-level resources such as:

- organizations
- users and roles where policy permits
- global permission definitions
- regulatory package registry
- regulatory package activation/deactivation
- system configuration
- health/operational diagnostics

Super Admin does **not** bypass audit logging, validation gates, or regulatory lifecycle invariants. A Super Admin still requires the explicit permission required for high-impact commands such as publishing or invalidating a finalized package.

## 6A.2 Required seed permissions

Seed at minimum:

```text
APPLICATION_VIEW
APPLICATION_EDIT

DOCUMENT_VIEW
DOCUMENT_UPLOAD
DOCUMENT_EDIT

SUBMISSION_VIEW
SUBMISSION_EDIT

LIFECYCLE_MANAGE
VALIDATION_RUN
XML_GENERATE
PUBLISH

AUDIT_VIEW
REGULATORY_ADMIN

ORGANIZATION_ADMIN
USER_ADMIN
ROLE_ADMIN
SYSTEM_CONFIG_ADMIN
```

## 6A.3 Required system roles

```text
SUPER_ADMIN
ORGANIZATION_ADMIN
REGULATORY_MANAGER
AUTHOR
REVIEWER
VIEWER
```

`SUPER_ADMIN` is a system-scoped role and must not be treated as merely another organization role.

---

# 8. Database Invariants

The following rules must be enforced through the appropriate combination of PostgreSQL constraints, Prisma transactions, domain services, and validation rules.

### Identity

- Regulatory UUIDs are unique within their entity namespace.
- Internal IDs are never used as substitutes for regulatory identifiers in generated XML.
- OIDs/code systems are not treated as UUIDs.

### Regulatory packages

- Imported regulatory packages are immutable.
- A failed import never becomes active.
- Historical packages remain available for historical validation.
- The selected Submission Unit profile is never silently replaced by a newer package.

### Documents

- Document versions are immutable after acceptance.
- A published physical file cannot be overwritten in place.
- Document lifecycle is not stored as an eCTD lifecycle status.

### Context of Use

- Lifecycle actions operate on CoU.
- Suspended CoUs cannot be reactivated.
- Replacement relationships obey context-group and cardinality rules.
- Replacement and document reuse are separate operations.

### Submission Units

- Published Submission Units cannot be mutated.
- Publication operates from a frozen snapshot.
- Publication cannot bypass the publish gate.

### Audit

- Audit events are append-only.
- Destructive mutation endpoints are prohibited for audit records.

---

# 9. Database Migration Rules

1. Commit Prisma migrations to Git.
2. Use `prisma migrate dev` for development migration creation.
3. Use `prisma migrate deploy` for production.
4. Do not use `prisma db push` as the production deployment mechanism.
5. Destructive changes require explicit migration review.
6. Production migration must be preceded by a verified backup for high-risk changes.
7. New columns should generally be introduced in backward-compatible form before removing old columns.
8. Regulatory package tables should not be destructively migrated in a way that removes historical versions.

---

# 10. Prisma Validation Checklist

Before the first implementation merge, Amazon Q/Codex must execute:

```bash
pnpm prisma validate
``

If the repository uses `pnpm`, the actual command is:

```bash
pnpm prisma validate
```

Correct typo-free project commands must be used in the generated repository; the canonical package-manager form should be:

```bash
pnpm exec prisma validate
pnpm exec prisma format
```

Then create and test a migration against a real PostgreSQL instance.

The agents must resolve any Prisma relation ambiguity before implementation is considered complete. They must not delete models or relations merely to make `prisma validate` pass.

---


# 11. Core Regulatory Domain

The canonical hierarchy is:

```text
Organization
  -> Product
  -> RegulatoryApplication
       -> Submission *
            <-> SubmissionUnit *
                 -> ContextOfUse *
                      -> Document
                           -> DocumentVersion *
```

The Submission-to-SubmissionUnit relationship must support regional/grouped submission semantics. Do not assume a universal one-to-one relationship.

## 7.1 Organization

Represents the sponsor/applicant organization using the system.

Fields:

- id
- name
- code
- type
- address
- countryCode
- email
- phone
- website
- createdAt
- updatedAt

## 7.2 Product

Represents the product associated with one or more applications.

Fields:

- id
- organizationId
- productName
- genericName
- brandName
- activeIngredient
- dosageForm
- strength
- routeOfAdministration
- productCode
- createdAt
- updatedAt

Do not over-model pharmaceutical regulatory details until the applicable product-domain requirements are explicitly defined.

## 7.3 RegulatoryApplication

Long-lived regulatory container.

Fields:

- id
- uuid
- organizationId
- productId
- authorityId
- regionId
- ectdStandardId
- regionalSpecificationId
- applicationNumber
- applicationType
- status
- regionalMetadata
- createdAt
- updatedAt

`regionalMetadata` is an extension mechanism, not a replacement for typed regulatory rules.

## 7.4 RegulatoryAuthority

Fields:

- id
- name
- code
- countryCode
- website
- active

## 7.5 RegulatoryRegion

Fields:

- id
- name
- code
- countryCode
- active

## 7.6 EctdStandard

Fields:

- id
- name
- version
- implementationGuideVersion
- controlledVocabularyVersion
- implementationGuideId
- controlledVocabularyPackageId
- status
- effectiveFrom
- effectiveUntil

## 7.7 RegionalSpecification

Fields:

- id
- name
- version
- regionId
- authorityId
- ectdStandardId
- status
- effectiveFrom
- effectiveUntil

## 7.8 Submission

Represents a regulatory submission/activity under an Application.

Fields:

- id
- uuid
- applicationId
- submissionType
- description
- status
- metadata
- createdAt
- updatedAt

## 7.9 SubmissionUnit

Represents the individual eCTD sequence/exchange unit.

Fields:

- id
- uuid
- sequenceNumber
- priorityNumber
- ectdStandardId
- regionalSpecificationId
- ctdStructurePackageId
- status
- metadata
- createdAt
- updatedAt

Sequence number belongs to Submission Unit.

## 7.10 SubmissionSubmissionUnit

Join entity supporting Submission <-> SubmissionUnit relationships.

Fields:

- id
- submissionId
- submissionUnitId
- relationshipType
- createdAt

---

# 12. Regulatory Identifiers

Maintain separate concepts:

```text
internal database id
regulatory UUID
OID/code-system identifier
legacy v3.2.2 leaf reference
```

Do not use an internal PostgreSQL ID as a substitute for a regulatory UUID.

## EctdReference abstraction

Support at minimum:

```typescript
type EctdReference =
  | { type: 'UUID'; root: string }
  | { type: 'V3_LEAF'; root: string; extension: string };
```

The v3.2.2 forward-compatibility representation must follow the exact authoritative v4.0 specification rather than an invented mapping.

---

# 13. CTD Structure

CTD structure is configuration, not business logic.

## CtdStructurePackage

Fields:

- id
- name
- version
- standardId
- regionalSpecificationId
- sourceUri
- checksum
- status

## CtdModule

Fields:

- id
- packageId
- moduleNumber
- title
- displayOrder

## CtdSection

Fields:

- id
- moduleId
- parentId
- sectionCode
- title
- level
- displayOrder

## ContextDefinition

Represents a regulatory coded CTD context.

Fields:

- id
- structurePackageId
- code
- codeSystem
- name
- description
- ctdSectionId

The exact code/code-system values must be loaded from the authoritative package.

---

# 14. Context of Use

A Context of Use assigns a Document to a regulatory context.

Fields:

- id
- uuid
- submissionUnitId
- documentId
- contextDefinitionId
- priorityNumber
- status
- createdAt
- updatedAt

The defining context is based on the applicable CoU code, code system, and defining keyword information.

Do not model lifecycle as a Document status.

## Context states

Application-level state representation may include:

- ACTIVE
- SUSPENDED
- OBSOLETE

These must not automatically be emitted as XML values. XML representation must be derived from the applicable eCTD specification.

---

# 15. Lifecycle Engine

Lifecycle operations occur at Context of Use level.

## Commands

- suspendContextOfUse
- replaceContextOfUse
- changeContextGroup where permitted
- reuseDocument

## Suspension rules

- Only an eligible active CoU can be suspended.
- Suspension is irreversible under the ICH lifecycle model.
- Do not implement a normal reactivation command.
- Suspension must be audited and represented in the appropriate Submission Unit.

## Replacement rules

- New/replacing CoU points to replaced/related CoU as specified.
- Replacement must satisfy context-group rules.
- Support 1:1, 1:M, M:1, and M:M relationships where the applicable specification permits them.
- The replacement relationship is distinct from document derivation.

## Context group

Represent as a value object/domain concept:

```typescript
interface ContextGroup {
  contextCode: string;
  codeSystem: string;
  keywords: KeywordIdentity[];
}
```

Do not compare raw unordered JSON as the definition of context equality; normalize according to authoritative rules.

## Transaction requirement

Lifecycle mutations must be atomic:

```text
load current state
 -> validate operation
 -> persist relationship/event/state
 -> audit
 -> commit
```

Failure rolls back the complete lifecycle operation.

---

# 16. Document Engine

## Document

Represents persistent regulatory document identity.

Fields:

- id
- uuid
- title
- filename
- mimeType
- language
- currentVersionId
- createdAt
- updatedAt

Document does not own eCTD lifecycle status.

## DocumentVersion

Represents a physical file revision.

Fields:

- id
- documentId
- versionNumber
- filename
- storageKey
- mimeType
- language
- fileSize
- checksum
- checksumAlgorithm
- createdById
- createdAt

Physical file content is immutable once a version is stored.

## Upload pipeline

```text
upload
 -> quarantine
 -> MIME/magic-byte validation
 -> file inspection
 -> malware/security scan where configured
 -> checksum
 -> store immutable version
 -> persist metadata
 -> audit
```

## Storage rule

Never expose permanent filesystem paths through the public API.

Use logical storage keys.

---

# 17. Document Reuse

Document reuse is distinct from lifecycle replacement.

A document may be reused across Submission Units by referencing its regulatory identity where the applicable rules permit.

The reuse validator must consider:

- document resolution
- physical availability
- target Submission Unit
- target CoU
- references
- hyperlinks
- relevance
- regional constraints

The system must not blindly duplicate a physical document merely because a document is reused.

---

# 18. Document Relationships

Keep relationship semantics separate.

## ContextOfUseRelationship

Used for regulatory context relationships such as replacement.

## DocumentRelationship

Used for document-to-document semantics such as derivation where supported by the specification.

## DocumentLink

Represents technical hyperlinks found inside a physical document.

These are different things and must not be collapsed into one generic table without semantic typing.

---

# 19. Keywords

## KeywordDefinition

Application-scoped definition with:

- id
- applicationId
- code
- name
- description
- dataType
- allowedValues

## ContextKeyword

Assignment of a keyword value to a CoU.

Fields:

- id
- contextOfUseId
- keywordDefinitionId
- value

Keyword identity must be normalized according to the applicable regulatory rules before comparing Context Groups.

---

# 20. Controlled Vocabulary Engine

ICH v4.0 Controlled Vocabulary Package v1.0.3 includes the harmonized code-list and Genericode files.

The system must store:

- package identity
- code list
- code list version
- code
- display name
- definition
- status
- source/provenance

Support vocabulary source categories such as:

- ICH
- REGIONAL
- HL7
- EXTERNAL
- SENDER

Do not convert the entire vocabulary system into static TypeScript enums.

Enums may be used only for application-internal states where the value is not an externally controlled regulatory vocabulary.

---

# 21. XML Engine

The XML engine is a compiler, not a controller utility.

Pipeline:

```text
frozen domain snapshot
 -> regulatory resolver
 -> eCTD XML model
 -> serializer
 -> submissionunit.xml
 -> XSD validator
```

## XML message model

At a high level:

```text
EctdMessage
├── MessageHeader
└── ControlActProcess
    ├── SubmissionUnit
    │   └── ContextOfUse*
    ├── Submission*
    └── Application*
```

The exact element names, namespaces, attributes, cardinalities, message type, fixed values, and schema locations must come from the supplied official Implementation Guide/schema package.

Do not infer them from secondary articles or from eCTD v3.2.2.

## XML object types

The package should include typed objects for at least:

- EctdMessage
- EctdMessageHeader
- ControlActProcess
- SubmissionUnitXml
- ContextOfUseXml
- DocumentReferenceXml
- ReplacementOfXml
- RelatedContextOfUseXml
- ReferencedByXml
- KeywordXml
- SubmissionXml
- ApplicationXml
- DocumentXml
- KeywordDefinitionXml

Exact fields are specification-driven.

---

# 22. XML Namespaces

Implement an explicit namespace registry.

Do not duplicate namespace strings throughout the codebase.

```typescript
interface XmlNamespaceRegistry {
  get(name: string): string;
  getSchemaLocation(name: string): string;
}
```

The official ICH schema package is authoritative for namespaces and schema locations.

---

# 23. XML Determinism

Given identical frozen input and identical regulatory package versions, XML generation should be deterministic except for fields explicitly required to vary.

Tests must support normalized XML comparison and, where relevant, byte-level reproducibility.

---

# 24. Validation Engine

Validation is divided into layers.

```text
1. Package integrity
2. File format
3. XML schema
4. Controlled vocabulary
5. ICH business rules
6. Regional rules
```

## ValidationProfile

A profile binds:

- eCTD standard
- Implementation Guide
- schema package
- controlled vocabulary package
- CTD package
- regional specification
- regional vocabulary
- validation ruleset
- relevant file-format specification

## ValidationRule

Fields:

- id
- ruleCode
- name
- description
- source
- source document
- source version
- severity
- scope
- version
- standardId
- regionalSpecificationId
- ruleDefinition
- active

## Rule source

Possible sources:

- ICH
- REGIONAL
- INTERNAL

Never present an internal rule as an ICH/regional requirement.

---

# 25. Validation Severity

The engine should support:

- ERROR/BLOCKING where the ruleset defines it.
- WARNING/NON-BLOCKING where the ruleset defines it.
- INFO.

Do not assume every regulator uses the same severity semantics.

For example, FDA's current v4.0 validation criteria distinguish **High Error** and **Warning**, with High Error described as preventing processing while Warning may affect reviewability; its criteria separately classify validation as schema or business rules. ([fda.gov](https://www.fda.gov/media/194434/download))

The application must therefore ask the selected validation profile whether a result is blocking rather than globally assuming every warning blocks publication.

---

# 26. Validation Run

Fields:

- id
- submissionUnitId
- validationProfileId
- status
- startedAt
- completedAt
- engineVersion
- profileVersion
- snapshotId

Every validation run must preserve exact regulatory provenance.

## ValidationResult

Fields:

- id
- validationRunId
- ruleId
- severity
- status
- message
- entityType
- entityId
- location
- evidence
- remediation
- createdAt

---

# 27. Validation Sequencing

Recommended dependency-aware phases:

```text
Structural
 -> Identifiers / Vocabulary
 -> References / Relationships
 -> Lifecycle
 -> Physical files
 -> XML
 -> Regional
```

Rules must be dependency-aware. Do not run a hyperlink-resolution rule before document/reference resolution has succeeded.

---

# 28. Validation Caching

Cache expensive inspection results by:

```text
file checksum
+
inspection engine version
+
inspection profile/version
```

Do not cache an old regulatory result against a changed validation ruleset.

---

# 29. Submission Unit Snapshot

Publication and full validation operate on an immutable snapshot.

Snapshot must capture enough state to reproduce the Submission Unit, including:

- Application metadata
- Submission metadata
- Submission Unit metadata
- CoUs
- Documents and selected Document Versions
- Keywords
- Relationships
- Regulatory package references
- Regional package references
- validation profile

Snapshot payload is a frozen projection, not the primary database model.

---

# 30. Publishing Engine

Publishing is **not** ZIP creation.

Pipeline:

```text
Draft Submission Unit
 -> freeze snapshot
 -> resolve regulatory profile
 -> full validation
 -> publish gate
 -> generate XML
 -> XSD validation
 -> resolve document dispositions
 -> verify physical file checksums
 -> construct staging package
 -> validate package
 -> calculate package integrity values
 -> finalize atomically
 -> create immutable SubmissionPackage
 -> audit
 -> READY FOR TRANSMISSION
```

## Document disposition

The resolver must determine whether content should be:

- INCLUDE
- REFERENCE
- EXCLUDE

according to the applicable specification.

Do not include every historical Document blindly.

## Staging

Build packages in a temporary staging directory first.

Never construct the final published artifact directly.

## Finalization

Only an already validated package can be finalized.

Finalization should be atomic where the storage system permits it.

---

# 31. SubmissionPackage

Fields:

- id
- submissionUnitId
- packageVersion
- storageKey
- fileSize
- checksum
- checksumAlgorithm
- validationRunId
- xmlGenerationRunId
- generatorVersion
- status
- generatedById
- generatedAt

Package statuses may include:

- STAGING
- BUILDING
- VALIDATING
- READY
- FINALIZED
- FAILED
- INVALIDATED

A generated package is not the same thing as a transmitted submission.

---

# 32. Transmission Boundary

Transmission is a separate subsystem.

```text
Publishing
  = produces regulator-ready package

Transmission
  = sends package to authority
```

The core MVP can stop at:

`READY_FOR_TRANSMISSION`

Do not claim a submission has been transmitted unless an actual transmission service confirms it.

FDA currently documents eCTD preparation/validation separately from transmission through its gateway, illustrating why these concerns should remain separate. ([fda.gov](https://www.fda.gov/drugs/electronic-regulatory-submission-and-review/submit-using-ectd))

---

# 29. REST API

Base path:

```text
/api/v1
```

## Authentication

```text
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
```

## Applications

```text
POST  /applications
GET   /applications
GET   /applications/:id
PATCH /applications/:id
GET   /applications/:id/submissions
GET   /applications/:id/audit
```

## Submissions

```text
POST  /applications/:id/submissions
GET   /applications/:id/submissions
GET   /submissions/:id
PATCH /submissions/:id
GET   /submissions/:id/submission-units
```

## Submission Units

```text
POST /submissions/:id/submission-units
GET  /submissions/:id/submission-units
GET  /submission-units/:id
POST /submission-units/:id/freeze
POST /submission-units/:id/validate
POST /submission-units/:id/generate-xml
POST /submission-units/:id/prepare-publication
POST /submission-units/:id/publish
```

## Contexts of Use

```text
POST /submission-units/:id/contexts-of-use
GET  /submission-units/:id/contexts-of-use
GET  /contexts-of-use/:id
POST /contexts-of-use/:id/suspend
POST /contexts-of-use/:id/replace
GET  /contexts-of-use/:id/lifecycle
```

## Documents

```text
POST /documents
GET  /documents
GET  /documents/:id
GET  /documents/:id/versions
GET  /documents/:id/history
POST /documents/:id/versions
POST /documents/:id/reuse
GET  /documents/:id/download
```

## Validation

```text
GET /validation-runs/:id
GET /validation-runs/:id/results
GET /validation-results/:id
```

## Packages

```text
GET  /submission-units/:id/packages
GET  /submission-packages/:id
GET  /submission-packages/:id/download
GET  /submission-packages/:id/manifest
POST /submission-packages/:id/invalidate
```

## Regulatory packages

```text
GET  /regulatory/standards
GET  /regulatory/regions
GET  /regulatory/specifications
GET  /regulatory/validation-profiles
GET  /regulatory/code-systems
GET  /regulatory/code-lists
POST /regulatory/packages/import
POST /regulatory/packages/:id/activate
```

---

# 33. Command-driven API design

Domain operations should be explicit.

Do not implement regulatory lifecycle behavior as generic CRUD PATCH operations.

Example:

```text
POST /contexts-of-use/:id/suspend
```

is preferred over:

```text
PATCH /contexts-of-use/:id
{ "status": "SUSPENDED" }
```

Similarly:

```text
POST /submission-units/:id/publish
```

must invoke the publication pipeline and cannot simply set `status = PUBLISHED`.

---

# 34. DTO rules

Every API resource has explicit:

- Create DTO
- Update DTO
- Response DTO
- Query/filter DTO where required

Do not expose Prisma models directly from controllers.

Use strict runtime validation for API inputs.

---

# 35. API errors

Use a single contract:

```json
{
  "error": {
    "code": "ECTD_LIFECYCLE_INVALID_TRANSITION",
    "message": "The Context of Use cannot be reactivated.",
    "category": "DOMAIN",
    "details": {},
    "correlationId": "..."
  }
}
```

Use appropriate HTTP codes such as 400, 401, 403, 404, 409, 422, 429, and 500.

---

# 36. Idempotency

Support `Idempotency-Key` for significant operations including:

- validation requests
- XML generation requests
- package publication
- regulatory package import

A retry of the same logical operation must not create duplicate artifacts.

---

# 37. Pagination and search

Collection endpoints must support server-side pagination.

Standard MVP query shape:

```text
?page=1&pageSize=50
```

Search and sorting fields must be whitelisted.

Do not allow arbitrary SQL fragments through sort/filter parameters.

---

# 38. Background Jobs

Use Redis + BullMQ behind a generic job interface.

Core jobs:

- IMPORT_REGULATORY_PACKAGE
- INSPECT_DOCUMENT
- VALIDATE_SUBMISSION_UNIT
- GENERATE_XML
- BUILD_SUBMISSION_PACKAGE
- VERIFY_PACKAGE

## Job states

- QUEUED
- RUNNING
- SUCCEEDED
- FAILED
- CANCELLED

## Retry policy

Retry only transient failures.

Do not retry deterministic regulatory validation failures indefinitely.

## Dead-letter handling

Exhausted retryable jobs must be visible as failed/dead-lettered with structured error details.

---

# 39. Workers

Separate worker processes:

```text
worker-validation
worker-publishing
worker-inspection
```

API requests should enqueue expensive tasks rather than execute them synchronously when the operation is expected to be expensive.

Core engines should not depend directly on BullMQ.

Use an abstraction such as:

```typescript
interface JobQueue {
  enqueue<T>(jobType: string, payload: T, options?: JobOptions): Promise<JobReference>;
}
```

---

# 40. Security

## Authentication

- Argon2id password hashing.
- Short-lived access tokens.
- Refresh token rotation.
- Revocable sessions/tokens.

## Authorization

Permissions are explicit.

Examples:

```text
APPLICATION_VIEW
APPLICATION_EDIT
DOCUMENT_VIEW
DOCUMENT_UPLOAD
DOCUMENT_EDIT
SUBMISSION_VIEW
SUBMISSION_EDIT
LIFECYCLE_MANAGE
VALIDATION_RUN
XML_GENERATE
PUBLISH
AUDIT_VIEW
REGULATORY_ADMIN
SYSTEM_ADMIN
```

---

# 41. Super Admin

The system must include a **Super Admin** role.

Super Admin is a system-level role and is distinct from organization-level Admin.

## Super Admin responsibilities

At minimum:

- Manage organizations.
- Manage organization users and roles.
- Manage system-wide configuration.
- Manage regulatory package registry.
- Import/activate/deactivate regulatory packages.
- Manage system-level validation profiles.
- View system-wide audit logs.
- Manage application-level feature flags where implemented.
- Perform platform maintenance administration.

## Super Admin restrictions

Super Admin must not bypass audit logging.

Regulatory lifecycle and publication commands remain explicit permission-controlled actions and must still produce audit events.

Super Admin actions must be attributable to a specific user account.

## Role hierarchy

Conceptually:

```text
SUPER_ADMIN
   │
   ├── platform-wide administration
   │
   └── can administer organizations

ORGANIZATION_ADMIN
   │
   └── organization-scoped administration

REGULATORY_MANAGER
AUTHOR
REVIEWER
VIEWER
```

The database must not rely on role name alone; permissions should be the effective authorization mechanism.

---

# 42. Tenant Isolation

Every organization-owned query must be scoped to the authenticated organization unless the caller has an explicit system-level permission such as Super Admin.

Never authorize solely from frontend UI state.

Object-level authorization is mandatory.

---

# 43. File Security

No public document buckets.

No permanent direct storage URLs.

Use authorization plus controlled download behavior.

Support:

- encryption at rest where infrastructure provides it
- TLS in transit
- quarantine
- malware scanning where configured
- MIME/magic-byte verification
- file size validation
- document access auditing

Do not log document contents or secrets.

---

# 44. Audit Trail

Audit events are append-only.

Minimum important events:

```text
CREATE_APPLICATION
CREATE_SUBMISSION
CREATE_SUBMISSION_UNIT
FREEZE_SUBMISSION_UNIT
UPLOAD_DOCUMENT
CREATE_DOCUMENT_VERSION
REUSE_DOCUMENT
SUSPEND_CONTEXT
REPLACE_CONTEXT
RUN_VALIDATION
GENERATE_XML
PUBLISH_SUBMISSION_UNIT
INVALIDATE_PACKAGE
IMPORT_REGULATORY_PACKAGE
ACTIVATE_REGULATORY_PACKAGE
LOGIN
LOGOUT
```

Audit fields:

- id
- organizationId
- userId
- eventType
- entityType
- entityId
- oldValue
- newValue
- metadata
- correlationId
- timestamp

No API should update/delete an audit event.

---

# 45. Observability

## Logging

Use structured JSON logs.

Minimum fields:

- timestamp
- level
- service
- event
- correlationId
- userId where appropriate
- organizationId where appropriate
- entity IDs where appropriate
- error code

Never log:

- passwords
- tokens
- confidential document contents
- sensitive secrets

## Metrics

Track:

- API latency/error rate
- validation duration/failure rate
- XML generation duration/failure rate
- publishing duration/failure rate
- queue depth
- job wait duration
- document inspection duration
- storage failures
- regulatory package import failures

## Health

```text
GET /health/live
GET /health/ready
GET /health
GET /health/regulatory
```

---

# 46. Concurrency

Regulatory operations must guard against concurrent modification.

Example:

```text
User A -> replace CoU
User B -> suspend same CoU
```

Only a valid resulting transaction may commit.

Use PostgreSQL transactions plus optimistic/version checks or row-level locking where appropriate.

---

# 47. Database Rules

Use Prisma migrations in source control.

Production:

```bash
prisma migrate deploy
```

Do not use `prisma db push` as the production migration mechanism.

Prefer restricted deletes for regulatory records.

Do not cascade-delete Applications into regulatory content.

Avoid generic soft-delete for historical regulatory objects; preserve immutable history and state transitions instead.

---

# 48. Backup and Recovery

Back up:

- PostgreSQL
- document storage
- published packages
- regulatory package artifacts
- critical configuration

Recovery must verify:

- database integrity
- storage integrity
- checksums
- regulatory package availability
- application health

A backup is not considered validated until restoration testing has been performed.

---

# 49. Testing Strategy

The test pyramid includes:

## Unit tests

- ContextGroupResolver
- LifecyclePolicy
- ReplacementValidator
- ReuseValidator
- ChecksumService
- storage logic
- DTO/domain mapping

## Integration tests

Use real PostgreSQL and preferably Testcontainers.

Test:

- repositories
- FK behavior
- transactions
- concurrency constraints
- audit persistence

## Regulatory fixture tests

Maintain fixtures for authoritative package examples and clearly label synthetic tests as synthetic.

Every regulatory fixture should include source provenance where available.

## XML tests

- domain -> XML mapping
- serializer
- namespace handling
- XSD validation
- lifecycle XML
- document reuse XML
- keyword XML
- forward compatibility XML where supported

## Publishing tests

Test:

- freeze
- full validation
- XML generation
- XSD validation
- file resolution
- checksum verification
- package structure
- atomic finalization

## Negative tests

At minimum:

- invalid lifecycle transition
- invalid context group replacement
- missing document
- corrupt file
- checksum mismatch
- unresolved reference
- invalid vocabulary
- schema failure
- missing regulatory package
- publish without validation

## End-to-end smoke test

```text
create organization
 -> create product
 -> create application
 -> create submission
 -> create submission unit
 -> upload documents
 -> assign contexts
 -> validate
 -> generate XML
 -> publish
 -> verify package
 -> verify audit history
```

---

# 50. Golden XML Tests

For important message structures, retain expected XML fixtures.

Test:

```text
input domain state
   -> generate XML
   -> normalize where appropriate
   -> compare expected XML
   -> XSD validate
```

Changes to golden fixtures require explicit review.

---

# 51. Regulatory Rule Testing

Every implemented regulatory rule must contain:

1. positive test
2. negative test
3. edge-case test where relevant
4. source provenance
5. expected severity
6. implementation status

Never implement a rule without knowing its authoritative source.

---

# 52. OpenAPI

The API must generate an OpenAPI specification.

Recommended endpoint:

```text
/api/docs
```

CI must verify that API implementation and documented schemas remain consistent.

---

# 53. Docker

Development Compose stack:

```text
api
worker-validation
worker-publishing
worker-inspection
postgres
redis
```

Use persistent volumes for PostgreSQL and local storage in development.

Production deployments must supply storage, database, secrets and configuration externally.

---

# 54. CI/CD

Every pull request should run:

```text
lint
 -> typecheck
 -> unit tests
 -> integration tests
 -> migration validation
 -> contract/OpenAPI checks
 -> XML tests
 -> build
 -> security/dependency scan
```

Only code passing required checks may be merged.

---

# 55. Environment Configuration

Example environment variables:

```text
NODE_ENV
PORT
DATABASE_URL
REDIS_URL

JWT_SECRET
JWT_REFRESH_SECRET

STORAGE_PROVIDER
STORAGE_ROOT

LOG_LEVEL

REGULATORY_PACKAGE_ROOT
```

Do not commit secrets.

Do not encode regulatory package versions solely in environment variables; those belong to the registered regulatory package configuration.

---

# 56. Development Phases

## Phase 1 — Repository and Infrastructure

- monorepo
- TypeScript strict mode
- NestJS
- PostgreSQL
- Prisma
- Docker
- Redis
- logging
- configuration
- CI

## Phase 2 — Regulatory Package Registry

- package import
- checksum
- schema registry
- controlled vocabulary registry
- package provenance
- activation

## Phase 3 — Core Domain

- organizations
- users
- products
- authorities
- regions
- applications
- submissions
- submission units

## Phase 4 — CTD and Context

- CTD package
- modules
- sections
- context definitions
- CoU
- keywords

## Phase 5 — Document Engine

- document identity
- versions
- upload
- storage
- checksum
- inspection
- references
- reuse

## Phase 6 — Lifecycle

- suspension
- replacement
- context groups
- relationship graph
- lifecycle audit

## Phase 7 — XML Engine

- message model
- mapping
- serialization
- namespace registry
- XSD validation

## Phase 8 — Validation Engine

- profiles
- rule registry
- rule execution
- findings
- reports
- caching

## Phase 9 — Publishing

- snapshots
- publish gate
- content resolution
- staging
- package validation
- checksums
- immutable artifacts

## Phase 10 — API

- controllers
- DTOs
- authentication
- authorization
- OpenAPI

## Phase 11 — Worker System

- BullMQ adapters
- worker services
- retries
- idempotency
- job monitoring

## Phase 12 — Security Hardening

- Super Admin
- RBAC
- object-level authorization
- secure file downloads
- secrets
- rate limiting

## Phase 13 — Production Hardening

- backup
- restore
- metrics
- health
- performance
- disaster recovery

---

# 57. Amazon Q / Codex Operating Instructions

The following rules apply to every AI coding session.

## Rule 1 — Source of truth

Use this document plus the authoritative regulatory package files provided to the repository.

## Rule 2 — No invention

If a regulatory requirement is absent, ambiguous, or conflicting, do not guess.

Create a clear implementation note such as:

```text
REGULATORY_GAP:
<what is missing>
<which implementation is blocked>
<what authoritative source is required>
```

## Rule 3 — Preserve standards artifacts

Never modify official schema, Implementation Guide, Controlled Vocabulary, Genericode, or regional source artifacts.

## Rule 4 — Do not flatten the domain

Do not collapse:

- Application into Submission
- Submission into Submission Unit
- Document into Context of Use
- Lifecycle into Document status
- Document Reference into physical file
- Regulatory package into arbitrary application configuration

## Rule 5 — No direct Prisma from controllers

Controllers call application services.

## Rule 6 — No filesystem access from controllers

All file access goes through storage abstractions.

## Rule 7 — No lifecycle mutation through generic CRUD

Use explicit domain commands.

## Rule 8 — Published artifacts are immutable

Create new Submission Units/artifacts for new regulatory states.

## Rule 9 — Audit regulatory operations

Lifecycle, publication, regulatory-package administration, and other significant changes must produce audit events.

## Rule 10 — Tests are part of implementation

Do not consider a regulatory engine feature complete without corresponding tests.

## Rule 11 — Keep XML and persistence models separate

Do not serialize Prisma models directly into eCTD XML.

## Rule 12 — Do not call a generated artifact "submitted"

Only a confirmed transmission process may establish submitted/transmitted state.

## Rule 13 — Super Admin is system-level

Do not substitute Organization Admin for Super Admin.

## Rule 14 — Protect secrets

Never print, commit, or return secrets/tokens/passwords.

## Rule 15 — Prefer explicit interfaces

Where future adapters are expected, define interfaces first:

- StorageService
- JobQueue
- RegulatoryResolver
- XmlSchemaValidator
- DocumentRepository
- ValidationEngine
- PublishingService

---

# 58. Suggested Coding-Agent Workflow

When asked to implement a feature:

```text
1. Read this implementation specification.
2. Identify affected bounded contexts.
3. Check authoritative regulatory package if the change is regulatory.
4. Identify existing interfaces and invariants.
5. Implement domain behavior first.
6. Implement persistence adapter.
7. Implement API/worker integration.
8. Add tests.
9. Update OpenAPI/docs.
10. Run lint/typecheck/tests.
11. Summarize assumptions and unresolved regulatory gaps.
```

Do not begin by writing controllers.

---

# 59. Definition of Done

A backend feature is complete only when, where applicable:

- domain behavior exists
- persistence is implemented
- migrations exist
- authorization exists
- audit behavior exists
- validation exists
- tests exist
- API/worker contract exists
- logging exists
- error handling exists
- documentation exists
- OpenAPI is updated
- regulatory provenance is recorded

A feature that merely compiles is not considered done.

---

# 60. Current Regulatory Verification Matrix

The implementation team must maintain a living matrix.

| Area | Authoritative source required | Status |
|---|---|---|
| ICH eCTD v4.0 core | ICH Implementation Guide v1.7 | Baseline identified |
| ICH v4.0 schema | Official ICH schema package | Must import/verify |
| ICH controlled vocabulary | ICH CV Package v1.0.3 | Baseline identified |
| Genericode | Official ICH CV package | Must import/verify |
| CTD headings/hierarchy | Applicable current package/authority | Must import/verify |
| ICH validation | Current authoritative validation criteria | Must import/verify |
| File format rules | Current applicable specification | Must import/verify |
| Regional Module 1 | Target-region authority | Required per profile |
| Regional CV | Target-region authority | Required per profile |
| Regional validation | Target-region authority | Required per profile |
| Transmission | Target-regulator authority | Separate subsystem |
| v3.2.2 forward compatibility | Current v4.0 + regional guidance | Must verify before implementation |
| Nigeria/NAFDAC v4.0 profile | Authoritative NAFDAC material | Do not invent |

---

# 61. Known Current Regional Example: FDA

FDA currently accepts new regulatory applications in eCTD v4.0 for CDER and CBER.

FDA's current standards page lists its independently maintained:

- Regional eCTD v4.0 Module 1 Implementation Guide.
- Regional Controlled Vocabulary.
- Forward Compatibility XML samples.
- Technical Conformance Guide.
- Validation Criteria.
- File-format specifications.
- Transmission specifications.

FDA's page records updates on August 28, 2026 for the regional CV, regional IG, and validation criteria, and a July 9, 2026 update for additional regional/technical/transmission material. The currently published FDA v4.0 validation criteria are version 1.6. ([FDA](https://www.fda.gov/drugs/electronic-regulatory-submission-and-review/ectd-submission-standards-ectd-v40-and-regional-m1))

This demonstrates why regional profiles must be independently versioned.

Do not use FDA-specific requirements as generic ICH requirements.

---

# 62. Nigeria / NAFDAC

The current ICH v4.0 regional implementation page does not establish a Nigeria/NAFDAC eCTD v4.0 regional package.

Therefore:

- Nigeria can exist as a RegulatoryRegion.
- NAFDAC can exist as a RegulatoryAuthority.
- Do not fabricate a NAFDAC eCTD v4.0 implementation package.
- Do not infer that existing CTD/Dossier Compiler rules are equivalent to an NAFDAC eCTD v4.0 specification.
- Add a formal NAFDAC regional profile only when an authoritative specification is available.

---

# 63. Future ProgrammoCeuticals Dossier Compiler Integration

The standalone eCTD application remains independently usable.

Future optional integration:

```text
ProgrammoCeuticals CTD Dossier Compiler
              |
              | export CTD content/metadata
              v
       ProgrammoCeuticals eCTD
```

Potential future feature:

`Import CTD Dossier`

This is an integration feature, not a core dependency.

---

# 64. Future AI Layer

AI may later provide:

- regulatory document assistance
- metadata suggestions
- inconsistency detection
- explanation of validation findings
- submission impact analysis
- document classification assistance

AI must not replace the deterministic XML, validation, lifecycle, or publication engine for formal conformance decisions.

---

# 65. Final System Blueprint

```text
                         PROGRAMMOCEUTICALS eCTD

                              REST / CLI
                                  |
                                  v
                         +-------------------+
                         | Application Layer |
                         +---------+---------+
                                   |
                    +--------------+--------------+
                    |                             |
                    v                             v
              Regulatory Domain             Infrastructure
                    |                             |
          +---------+----------+          +-------+-------+
          |         |          |          |       |       |
       Content   Lifecycle  Standards   DB      Queue   Storage
          |         |          |          |       |       |
          +---------+----------+          +-------+-------+
                    |
                    v
                XML Engine
                    |
                    v
             Validation Engine
                    |
                    v
             Publishing Engine
                    |
                    v
            Submission Package
                    |
                    v
          READY FOR TRANSMISSION
```

---

# 66. Final Implementation Rule

The application is regulatory software.

Correctness has priority over speed of implementation.

Amazon Q and Codex must prefer:

```text
explicit source
+ explicit invariant
+ explicit test
```

over:

```text
reasonable assumption
+ quick implementation
```

Whenever there is uncertainty, surface it as a documented regulatory or implementation gap.

**Do not silently guess.**

---

# Sources / Regulatory Baseline

1. ICH, *ICH electronic Common Technical Document - eCTD v4.0*. Current page lists ICH eCTD v4.0 Implementation Guide v1.7 and Controlled Vocabulary Package v1.0.3, and states that these must be used with Regional/Module 1 documents. https://admin.ich.org/page/ich-electronic-common-technical-document-ectd-v40
2. FDA, *eCTD Submission Standards for eCTD v4.0 and Regional M1*. Current 2026 standards page, including current regional package/version history and validation criteria. https://www.fda.gov/drugs/electronic-regulatory-submission-and-review/ectd-submission-standards-ectd-v40-and-regional-m1
3. FDA, *Specifications for eCTD v4.0 Validation Criteria*, current version 1.6 (August 28, 2026), including severity levels and schema/business-rule categories. https://www.fda.gov/media/194434/download
4. FDA, *Electronic Common Technical Document (eCTD)*, including eCTD v4.0 implementation and transmission references. https://www.fda.gov/drugs/electronic-regulatory-submission-and-review/electronic-common-technical-document-ectd

---

# Change Control

This document is version-controlled.

Any change affecting:

- regulatory interpretation
- XML mapping
- lifecycle behavior
- validation severity
- controlled vocabulary
- regional requirements
- package structure

must identify the authoritative source and update the Regulatory Verification Matrix.

The final implementation repository should retain this file under version control and require review for changes to regulatory sections.
