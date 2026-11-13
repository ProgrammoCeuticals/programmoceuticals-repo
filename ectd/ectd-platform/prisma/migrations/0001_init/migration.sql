-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "type" TEXT,
    "address" TEXT,
    "countryCode" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scope" TEXT NOT NULL DEFAULT 'ORGANIZATION',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "genericName" TEXT,
    "brandName" TEXT,
    "activeIngredient" TEXT,
    "dosageForm" TEXT,
    "strength" TEXT,
    "routeOfAdministration" TEXT,
    "productCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegulatoryAuthority" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "countryCode" TEXT,
    "website" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegulatoryAuthority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegulatoryRegion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "countryCode" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegulatoryRegion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EctdStandard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "implementationGuideVersion" TEXT,
    "controlledVocabularyVersion" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "effectiveFrom" TIMESTAMP(3),
    "effectiveUntil" TIMESTAMP(3),
    "implementationGuideId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EctdStandard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImplementationGuide" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "sourceUri" TEXT,
    "checksum" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "sourceArtifactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImplementationGuide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlledVocabularyPackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "sourceUri" TEXT,
    "checksum" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "sourceArtifactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ControlledVocabularyPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegulatoryStandardCvLink" (
    "id" TEXT NOT NULL,
    "ectdStandardId" TEXT NOT NULL,
    "controlledVocabularyPackageId" TEXT NOT NULL,

    CONSTRAINT "RegulatoryStandardCvLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegulatoryArtifact" (
    "id" TEXT NOT NULL,
    "artifactType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "sourceUri" TEXT,
    "sourceFilename" TEXT,
    "checksum" TEXT NOT NULL,
    "storageKey" TEXT,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "importedById" TEXT,
    "status" TEXT NOT NULL DEFAULT 'IMPORTED',
    "metadata" JSONB,

    CONSTRAINT "RegulatoryArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeSystem" (
    "id" TEXT NOT NULL,
    "oid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerType" TEXT,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodeSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeList" (
    "id" TEXT NOT NULL,
    "controlledVocabularyPackageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "oid" TEXT,
    "ownerType" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeListVersion" (
    "id" TEXT NOT NULL,
    "codeListId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeListVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeListValue" (
    "id" TEXT NOT NULL,
    "codeListVersionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "definition" TEXT,
    "status" TEXT,
    "order" INTEGER,

    CONSTRAINT "CodeListValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionalSpecification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "authorityId" TEXT,
    "ectdStandardId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "effectiveFrom" TIMESTAMP(3),
    "effectiveUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegionalSpecification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegulatoryApplication" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "authorityId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "ectdStandardId" TEXT NOT NULL,
    "regionalSpecificationId" TEXT NOT NULL,
    "applicationNumber" TEXT,
    "applicationType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "regionalMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegulatoryApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "submissionType" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionUnit" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "sequenceNumber" INTEGER NOT NULL,
    "priorityNumber" INTEGER,
    "ectdStandardId" TEXT NOT NULL,
    "regionalSpecificationId" TEXT,
    "ctdStructurePackageId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubmissionUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionSubmissionUnit" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "submissionUnitId" TEXT NOT NULL,
    "relationshipType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionSubmissionUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CtdStructurePackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "standardId" TEXT,
    "regionalSpecificationId" TEXT,
    "sourceUri" TEXT,
    "checksum" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CtdStructurePackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CtdModule" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "moduleNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CtdModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CtdSection" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "parentId" TEXT,
    "sectionCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CtdSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContextDefinition" (
    "id" TEXT NOT NULL,
    "structurePackageId" TEXT NOT NULL,
    "ctdSectionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "codeSystem" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ContextDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "language" TEXT,
    "currentVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentVersion" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT,
    "language" TEXT,
    "fileSize" BIGINT NOT NULL,
    "checksum" TEXT NOT NULL,
    "checksumAlgorithm" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContextOfUse" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "submissionUnitId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "contextDefinitionId" TEXT NOT NULL,
    "ctdSectionId" TEXT,
    "priorityNumber" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContextOfUse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentRelationship" (
    "id" TEXT NOT NULL,
    "sourceDocumentId" TEXT NOT NULL,
    "targetDocumentId" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentReference" (
    "id" TEXT NOT NULL,
    "sourceDocumentId" TEXT NOT NULL,
    "targetDocumentId" TEXT NOT NULL,
    "referenceType" TEXT,
    "location" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentLink" (
    "id" TEXT NOT NULL,
    "sourceDocumentVersionId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetDocumentId" TEXT,
    "targetUri" TEXT,
    "pageNumber" INTEGER,
    "anchorText" TEXT,
    "status" TEXT NOT NULL DEFAULT 'UNVALIDATED',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EctdReference" (
    "id" TEXT NOT NULL,
    "referenceType" TEXT NOT NULL,
    "root" TEXT,
    "extension" TEXT,
    "sourceEntityType" TEXT NOT NULL,
    "sourceEntityId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EctdReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifecycleOperation" (
    "id" TEXT NOT NULL,
    "submissionUnitId" TEXT NOT NULL,
    "contextOfUseId" TEXT NOT NULL,
    "operationType" TEXT NOT NULL,
    "reason" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LifecycleOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContextOfUseRelationship" (
    "id" TEXT NOT NULL,
    "sourceContextId" TEXT NOT NULL,
    "targetContextId" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContextOfUseRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeywordDefinition" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dataType" TEXT NOT NULL,
    "allowedValues" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KeywordDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContextKeyword" (
    "id" TEXT NOT NULL,
    "contextOfUseId" TEXT NOT NULL,
    "keywordDefinitionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContextKeyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SenderCodeList" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "applicationId" TEXT,
    "name" TEXT NOT NULL,
    "oid" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SenderCodeList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SenderCodeListValue" (
    "id" TEXT NOT NULL,
    "codeListId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "definition" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SenderCodeListValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "description" TEXT,
    "ectdStandardId" TEXT NOT NULL,
    "regionalSpecificationId" TEXT,
    "rulesetVersion" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValidationProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationRule" (
    "id" TEXT NOT NULL,
    "ruleCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "severity" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "ruleDefinition" JSONB NOT NULL,
    "standardId" TEXT,
    "regionalSpecificationId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ValidationRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegulatoryRuleSource" (
    "id" TEXT NOT NULL,
    "validationRuleId" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "documentVersion" TEXT NOT NULL,
    "sectionReference" TEXT,
    "sourceUri" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegulatoryRuleSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationRun" (
    "id" TEXT NOT NULL,
    "submissionUnitId" TEXT NOT NULL,
    "validationProfileId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "engineVersion" TEXT,
    "profileVersion" TEXT,

    CONSTRAINT "ValidationRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationResult" (
    "id" TEXT NOT NULL,
    "validationRunId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "location" TEXT,
    "evidence" JSONB,
    "remediation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ValidationResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionUnitSnapshot" (
    "id" TEXT NOT NULL,
    "submissionUnitId" TEXT NOT NULL,
    "snapshotVersion" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "ectdStandardId" TEXT,
    "regionalSpecificationId" TEXT,
    "ctdStructurePackageId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionUnitSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XmlGenerationRun" (
    "id" TEXT NOT NULL,
    "submissionUnitId" TEXT NOT NULL,
    "standardId" TEXT,
    "implementationGuideVersion" TEXT,
    "controlledVocabularyVersion" TEXT,
    "schemaPackageChecksum" TEXT,
    "generatorVersion" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "outputStorageKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XmlGenerationRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionPackage" (
    "id" TEXT NOT NULL,
    "submissionUnitId" TEXT NOT NULL,
    "packageVersion" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileSize" BIGINT NOT NULL,
    "checksum" TEXT NOT NULL,
    "checksumAlgorithm" TEXT NOT NULL,
    "validationRunId" TEXT,
    "xmlGenerationRunId" TEXT,
    "generatorVersion" TEXT,
    "status" TEXT NOT NULL,
    "generatedById" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "payload" JSONB,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "currentStep" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "idempotencyKey" TEXT,
    "correlationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "metadata" JSONB,
    "correlationId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_code_key" ON "Organization"("code");

-- CreateIndex
CREATE INDEX "Organization_name_idx" ON "Organization"("name");

-- CreateIndex
CREATE INDEX "Organization_status_idx" ON "Organization"("status");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

-- CreateIndex
CREATE INDEX "User_isSuperAdmin_idx" ON "User"("isSuperAdmin");

-- CreateIndex
CREATE UNIQUE INDEX "User_organizationId_email_key" ON "User"("organizationId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "UserRole_userId_idx" ON "UserRole"("userId");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "Product_organizationId_idx" ON "Product"("organizationId");

-- CreateIndex
CREATE INDEX "Product_productName_idx" ON "Product"("productName");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryAuthority_code_key" ON "RegulatoryAuthority"("code");

-- CreateIndex
CREATE INDEX "RegulatoryAuthority_name_idx" ON "RegulatoryAuthority"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryRegion_code_key" ON "RegulatoryRegion"("code");

-- CreateIndex
CREATE INDEX "RegulatoryRegion_name_idx" ON "RegulatoryRegion"("name");

-- CreateIndex
CREATE INDEX "EctdStandard_status_idx" ON "EctdStandard"("status");

-- CreateIndex
CREATE UNIQUE INDEX "EctdStandard_name_version_key" ON "EctdStandard"("name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "ImplementationGuide_sourceArtifactId_key" ON "ImplementationGuide"("sourceArtifactId");

-- CreateIndex
CREATE UNIQUE INDEX "ImplementationGuide_name_version_key" ON "ImplementationGuide"("name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "ControlledVocabularyPackage_sourceArtifactId_key" ON "ControlledVocabularyPackage"("sourceArtifactId");

-- CreateIndex
CREATE UNIQUE INDEX "ControlledVocabularyPackage_name_version_key" ON "ControlledVocabularyPackage"("name", "version");

-- CreateIndex
CREATE INDEX "RegulatoryStandardCvLink_ectdStandardId_idx" ON "RegulatoryStandardCvLink"("ectdStandardId");

-- CreateIndex
CREATE INDEX "RegulatoryStandardCvLink_controlledVocabularyPackageId_idx" ON "RegulatoryStandardCvLink"("controlledVocabularyPackageId");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryStandardCvLink_ectdStandardId_controlledVocabular_key" ON "RegulatoryStandardCvLink"("ectdStandardId", "controlledVocabularyPackageId");

-- CreateIndex
CREATE INDEX "RegulatoryArtifact_artifactType_idx" ON "RegulatoryArtifact"("artifactType");

-- CreateIndex
CREATE INDEX "RegulatoryArtifact_name_version_idx" ON "RegulatoryArtifact"("name", "version");

-- CreateIndex
CREATE INDEX "RegulatoryArtifact_checksum_idx" ON "RegulatoryArtifact"("checksum");

-- CreateIndex
CREATE UNIQUE INDEX "CodeSystem_oid_key" ON "CodeSystem"("oid");

-- CreateIndex
CREATE INDEX "CodeList_controlledVocabularyPackageId_idx" ON "CodeList"("controlledVocabularyPackageId");

-- CreateIndex
CREATE INDEX "CodeListVersion_codeListId_idx" ON "CodeListVersion"("codeListId");

-- CreateIndex
CREATE UNIQUE INDEX "CodeListVersion_codeListId_version_key" ON "CodeListVersion"("codeListId", "version");

-- CreateIndex
CREATE INDEX "CodeListValue_codeListVersionId_idx" ON "CodeListValue"("codeListVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "CodeListValue_codeListVersionId_code_key" ON "CodeListValue"("codeListVersionId", "code");

-- CreateIndex
CREATE INDEX "RegionalSpecification_regionId_idx" ON "RegionalSpecification"("regionId");

-- CreateIndex
CREATE INDEX "RegionalSpecification_authorityId_idx" ON "RegionalSpecification"("authorityId");

-- CreateIndex
CREATE INDEX "RegionalSpecification_ectdStandardId_idx" ON "RegionalSpecification"("ectdStandardId");

-- CreateIndex
CREATE UNIQUE INDEX "RegionalSpecification_regionId_authorityId_name_version_key" ON "RegionalSpecification"("regionId", "authorityId", "name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryApplication_uuid_key" ON "RegulatoryApplication"("uuid");

-- CreateIndex
CREATE INDEX "RegulatoryApplication_organizationId_idx" ON "RegulatoryApplication"("organizationId");

-- CreateIndex
CREATE INDEX "RegulatoryApplication_productId_idx" ON "RegulatoryApplication"("productId");

-- CreateIndex
CREATE INDEX "RegulatoryApplication_authorityId_idx" ON "RegulatoryApplication"("authorityId");

-- CreateIndex
CREATE INDEX "RegulatoryApplication_regionId_idx" ON "RegulatoryApplication"("regionId");

-- CreateIndex
CREATE INDEX "RegulatoryApplication_applicationNumber_idx" ON "RegulatoryApplication"("applicationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_uuid_key" ON "Submission"("uuid");

-- CreateIndex
CREATE INDEX "Submission_applicationId_idx" ON "Submission"("applicationId");

-- CreateIndex
CREATE INDEX "Submission_status_idx" ON "Submission"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionUnit_uuid_key" ON "SubmissionUnit"("uuid");

-- CreateIndex
CREATE INDEX "SubmissionUnit_sequenceNumber_idx" ON "SubmissionUnit"("sequenceNumber");

-- CreateIndex
CREATE INDEX "SubmissionUnit_ectdStandardId_idx" ON "SubmissionUnit"("ectdStandardId");

-- CreateIndex
CREATE INDEX "SubmissionUnit_regionalSpecificationId_idx" ON "SubmissionUnit"("regionalSpecificationId");

-- CreateIndex
CREATE INDEX "SubmissionUnit_status_idx" ON "SubmissionUnit"("status");

-- CreateIndex
CREATE INDEX "SubmissionSubmissionUnit_submissionId_idx" ON "SubmissionSubmissionUnit"("submissionId");

-- CreateIndex
CREATE INDEX "SubmissionSubmissionUnit_submissionUnitId_idx" ON "SubmissionSubmissionUnit"("submissionUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionSubmissionUnit_submissionId_submissionUnitId_key" ON "SubmissionSubmissionUnit"("submissionId", "submissionUnitId");

-- CreateIndex
CREATE INDEX "CtdStructurePackage_standardId_idx" ON "CtdStructurePackage"("standardId");

-- CreateIndex
CREATE INDEX "CtdStructurePackage_regionalSpecificationId_idx" ON "CtdStructurePackage"("regionalSpecificationId");

-- CreateIndex
CREATE UNIQUE INDEX "CtdStructurePackage_name_version_key" ON "CtdStructurePackage"("name", "version");

-- CreateIndex
CREATE INDEX "CtdModule_packageId_idx" ON "CtdModule"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "CtdModule_packageId_moduleNumber_key" ON "CtdModule"("packageId", "moduleNumber");

-- CreateIndex
CREATE INDEX "CtdSection_moduleId_idx" ON "CtdSection"("moduleId");

-- CreateIndex
CREATE INDEX "CtdSection_parentId_idx" ON "CtdSection"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "CtdSection_moduleId_sectionCode_key" ON "CtdSection"("moduleId", "sectionCode");

-- CreateIndex
CREATE INDEX "ContextDefinition_ctdSectionId_idx" ON "ContextDefinition"("ctdSectionId");

-- CreateIndex
CREATE UNIQUE INDEX "ContextDefinition_structurePackageId_code_codeSystem_key" ON "ContextDefinition"("structurePackageId", "code", "codeSystem");

-- CreateIndex
CREATE UNIQUE INDEX "Document_uuid_key" ON "Document"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Document_currentVersionId_key" ON "Document"("currentVersionId");

-- CreateIndex
CREATE INDEX "Document_title_idx" ON "Document"("title");

-- CreateIndex
CREATE INDEX "Document_mimeType_idx" ON "Document"("mimeType");

-- CreateIndex
CREATE INDEX "DocumentVersion_documentId_idx" ON "DocumentVersion"("documentId");

-- CreateIndex
CREATE INDEX "DocumentVersion_checksum_idx" ON "DocumentVersion"("checksum");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentVersion_documentId_versionNumber_key" ON "DocumentVersion"("documentId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ContextOfUse_uuid_key" ON "ContextOfUse"("uuid");

-- CreateIndex
CREATE INDEX "ContextOfUse_submissionUnitId_idx" ON "ContextOfUse"("submissionUnitId");

-- CreateIndex
CREATE INDEX "ContextOfUse_documentId_idx" ON "ContextOfUse"("documentId");

-- CreateIndex
CREATE INDEX "ContextOfUse_contextDefinitionId_idx" ON "ContextOfUse"("contextDefinitionId");

-- CreateIndex
CREATE INDEX "ContextOfUse_status_idx" ON "ContextOfUse"("status");

-- CreateIndex
CREATE INDEX "DocumentRelationship_sourceDocumentId_idx" ON "DocumentRelationship"("sourceDocumentId");

-- CreateIndex
CREATE INDEX "DocumentRelationship_targetDocumentId_idx" ON "DocumentRelationship"("targetDocumentId");

-- CreateIndex
CREATE INDEX "DocumentRelationship_relationshipType_idx" ON "DocumentRelationship"("relationshipType");

-- CreateIndex
CREATE INDEX "DocumentReference_sourceDocumentId_idx" ON "DocumentReference"("sourceDocumentId");

-- CreateIndex
CREATE INDEX "DocumentReference_targetDocumentId_idx" ON "DocumentReference"("targetDocumentId");

-- CreateIndex
CREATE INDEX "DocumentLink_sourceDocumentVersionId_idx" ON "DocumentLink"("sourceDocumentVersionId");

-- CreateIndex
CREATE INDEX "DocumentLink_targetDocumentId_idx" ON "DocumentLink"("targetDocumentId");

-- CreateIndex
CREATE INDEX "DocumentLink_status_idx" ON "DocumentLink"("status");

-- CreateIndex
CREATE INDEX "EctdReference_referenceType_idx" ON "EctdReference"("referenceType");

-- CreateIndex
CREATE INDEX "EctdReference_root_idx" ON "EctdReference"("root");

-- CreateIndex
CREATE INDEX "EctdReference_sourceEntityType_sourceEntityId_idx" ON "EctdReference"("sourceEntityType", "sourceEntityId");

-- CreateIndex
CREATE INDEX "LifecycleOperation_submissionUnitId_idx" ON "LifecycleOperation"("submissionUnitId");

-- CreateIndex
CREATE INDEX "LifecycleOperation_contextOfUseId_idx" ON "LifecycleOperation"("contextOfUseId");

-- CreateIndex
CREATE INDEX "LifecycleOperation_operationType_idx" ON "LifecycleOperation"("operationType");

-- CreateIndex
CREATE INDEX "ContextOfUseRelationship_sourceContextId_idx" ON "ContextOfUseRelationship"("sourceContextId");

-- CreateIndex
CREATE INDEX "ContextOfUseRelationship_targetContextId_idx" ON "ContextOfUseRelationship"("targetContextId");

-- CreateIndex
CREATE INDEX "ContextOfUseRelationship_relationshipType_idx" ON "ContextOfUseRelationship"("relationshipType");

-- CreateIndex
CREATE INDEX "KeywordDefinition_applicationId_idx" ON "KeywordDefinition"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "KeywordDefinition_applicationId_code_key" ON "KeywordDefinition"("applicationId", "code");

-- CreateIndex
CREATE INDEX "ContextKeyword_contextOfUseId_idx" ON "ContextKeyword"("contextOfUseId");

-- CreateIndex
CREATE INDEX "ContextKeyword_keywordDefinitionId_idx" ON "ContextKeyword"("keywordDefinitionId");

-- CreateIndex
CREATE UNIQUE INDEX "ContextKeyword_contextOfUseId_keywordDefinitionId_key" ON "ContextKeyword"("contextOfUseId", "keywordDefinitionId");

-- CreateIndex
CREATE INDEX "SenderCodeList_organizationId_idx" ON "SenderCodeList"("organizationId");

-- CreateIndex
CREATE INDEX "SenderCodeList_applicationId_idx" ON "SenderCodeList"("applicationId");

-- CreateIndex
CREATE INDEX "SenderCodeListValue_codeListId_idx" ON "SenderCodeListValue"("codeListId");

-- CreateIndex
CREATE UNIQUE INDEX "SenderCodeListValue_codeListId_code_key" ON "SenderCodeListValue"("codeListId", "code");

-- CreateIndex
CREATE INDEX "ValidationProfile_ectdStandardId_idx" ON "ValidationProfile"("ectdStandardId");

-- CreateIndex
CREATE INDEX "ValidationProfile_regionalSpecificationId_idx" ON "ValidationProfile"("regionalSpecificationId");

-- CreateIndex
CREATE UNIQUE INDEX "ValidationProfile_name_version_key" ON "ValidationProfile"("name", "version");

-- CreateIndex
CREATE INDEX "ValidationRule_standardId_idx" ON "ValidationRule"("standardId");

-- CreateIndex
CREATE INDEX "ValidationRule_regionalSpecificationId_idx" ON "ValidationRule"("regionalSpecificationId");

-- CreateIndex
CREATE INDEX "ValidationRule_source_idx" ON "ValidationRule"("source");

-- CreateIndex
CREATE UNIQUE INDEX "ValidationRule_ruleCode_version_key" ON "ValidationRule"("ruleCode", "version");

-- CreateIndex
CREATE INDEX "RegulatoryRuleSource_validationRuleId_idx" ON "RegulatoryRuleSource"("validationRuleId");

-- CreateIndex
CREATE INDEX "ValidationRun_submissionUnitId_idx" ON "ValidationRun"("submissionUnitId");

-- CreateIndex
CREATE INDEX "ValidationRun_validationProfileId_idx" ON "ValidationRun"("validationProfileId");

-- CreateIndex
CREATE INDEX "ValidationRun_status_idx" ON "ValidationRun"("status");

-- CreateIndex
CREATE INDEX "ValidationResult_validationRunId_idx" ON "ValidationResult"("validationRunId");

-- CreateIndex
CREATE INDEX "ValidationResult_ruleId_idx" ON "ValidationResult"("ruleId");

-- CreateIndex
CREATE INDEX "ValidationResult_entityType_entityId_idx" ON "ValidationResult"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ValidationResult_severity_status_idx" ON "ValidationResult"("severity", "status");

-- CreateIndex
CREATE INDEX "SubmissionUnitSnapshot_submissionUnitId_idx" ON "SubmissionUnitSnapshot"("submissionUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionUnitSnapshot_submissionUnitId_snapshotVersion_key" ON "SubmissionUnitSnapshot"("submissionUnitId", "snapshotVersion");

-- CreateIndex
CREATE INDEX "XmlGenerationRun_submissionUnitId_idx" ON "XmlGenerationRun"("submissionUnitId");

-- CreateIndex
CREATE INDEX "XmlGenerationRun_status_idx" ON "XmlGenerationRun"("status");

-- CreateIndex
CREATE INDEX "SubmissionPackage_submissionUnitId_idx" ON "SubmissionPackage"("submissionUnitId");

-- CreateIndex
CREATE INDEX "SubmissionPackage_checksum_idx" ON "SubmissionPackage"("checksum");

-- CreateIndex
CREATE INDEX "SubmissionPackage_status_idx" ON "SubmissionPackage"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionPackage_submissionUnitId_packageVersion_key" ON "SubmissionPackage"("submissionUnitId", "packageVersion");

-- CreateIndex
CREATE UNIQUE INDEX "Job_idempotencyKey_key" ON "Job"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Job_jobType_idx" ON "Job"("jobType");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Job_createdAt_idx" ON "Job"("createdAt");

-- CreateIndex
CREATE INDEX "Job_correlationId_idx" ON "Job"("correlationId");

-- CreateIndex
CREATE INDEX "AuditEvent_organizationId_idx" ON "AuditEvent"("organizationId");

-- CreateIndex
CREATE INDEX "AuditEvent_entityType_entityId_idx" ON "AuditEvent"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditEvent_timestamp_idx" ON "AuditEvent"("timestamp");

-- CreateIndex
CREATE INDEX "AuditEvent_correlationId_idx" ON "AuditEvent"("correlationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EctdStandard" ADD CONSTRAINT "EctdStandard_implementationGuideId_fkey" FOREIGN KEY ("implementationGuideId") REFERENCES "ImplementationGuide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImplementationGuide" ADD CONSTRAINT "ImplementationGuide_sourceArtifactId_fkey" FOREIGN KEY ("sourceArtifactId") REFERENCES "RegulatoryArtifact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlledVocabularyPackage" ADD CONSTRAINT "ControlledVocabularyPackage_sourceArtifactId_fkey" FOREIGN KEY ("sourceArtifactId") REFERENCES "RegulatoryArtifact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulatoryStandardCvLink" ADD CONSTRAINT "RegulatoryStandardCvLink_ectdStandardId_fkey" FOREIGN KEY ("ectdStandardId") REFERENCES "EctdStandard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulatoryStandardCvLink" ADD CONSTRAINT "RegulatoryStandardCvLink_controlledVocabularyPackageId_fkey" FOREIGN KEY ("controlledVocabularyPackageId") REFERENCES "ControlledVocabularyPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeList" ADD CONSTRAINT "CodeList_controlledVocabularyPackageId_fkey" FOREIGN KEY ("controlledVocabularyPackageId") REFERENCES "ControlledVocabularyPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeListVersion" ADD CONSTRAINT "CodeListVersion_codeListId_fkey" FOREIGN KEY ("codeListId") REFERENCES "CodeList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeListValue" ADD CONSTRAINT "CodeListValue_codeListVersionId_fkey" FOREIGN KEY ("codeListVersionId") REFERENCES "CodeListVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionalSpecification" ADD CONSTRAINT "RegionalSpecification_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "RegulatoryRegion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionalSpecification" ADD CONSTRAINT "RegionalSpecification_authorityId_fkey" FOREIGN KEY ("authorityId") REFERENCES "RegulatoryAuthority"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionalSpecification" ADD CONSTRAINT "RegionalSpecification_ectdStandardId_fkey" FOREIGN KEY ("ectdStandardId") REFERENCES "EctdStandard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulatoryApplication" ADD CONSTRAINT "RegulatoryApplication_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulatoryApplication" ADD CONSTRAINT "RegulatoryApplication_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulatoryApplication" ADD CONSTRAINT "RegulatoryApplication_authorityId_fkey" FOREIGN KEY ("authorityId") REFERENCES "RegulatoryAuthority"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulatoryApplication" ADD CONSTRAINT "RegulatoryApplication_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "RegulatoryRegion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulatoryApplication" ADD CONSTRAINT "RegulatoryApplication_ectdStandardId_fkey" FOREIGN KEY ("ectdStandardId") REFERENCES "EctdStandard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulatoryApplication" ADD CONSTRAINT "RegulatoryApplication_regionalSpecificationId_fkey" FOREIGN KEY ("regionalSpecificationId") REFERENCES "RegionalSpecification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RegulatoryApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionUnit" ADD CONSTRAINT "SubmissionUnit_ectdStandardId_fkey" FOREIGN KEY ("ectdStandardId") REFERENCES "EctdStandard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionUnit" ADD CONSTRAINT "SubmissionUnit_regionalSpecificationId_fkey" FOREIGN KEY ("regionalSpecificationId") REFERENCES "RegionalSpecification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionUnit" ADD CONSTRAINT "SubmissionUnit_ctdStructurePackageId_fkey" FOREIGN KEY ("ctdStructurePackageId") REFERENCES "CtdStructurePackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionSubmissionUnit" ADD CONSTRAINT "SubmissionSubmissionUnit_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionSubmissionUnit" ADD CONSTRAINT "SubmissionSubmissionUnit_submissionUnitId_fkey" FOREIGN KEY ("submissionUnitId") REFERENCES "SubmissionUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CtdStructurePackage" ADD CONSTRAINT "CtdStructurePackage_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "EctdStandard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CtdStructurePackage" ADD CONSTRAINT "CtdStructurePackage_regionalSpecificationId_fkey" FOREIGN KEY ("regionalSpecificationId") REFERENCES "RegionalSpecification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CtdModule" ADD CONSTRAINT "CtdModule_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "CtdStructurePackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CtdSection" ADD CONSTRAINT "CtdSection_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "CtdModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CtdSection" ADD CONSTRAINT "CtdSection_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CtdSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextDefinition" ADD CONSTRAINT "ContextDefinition_structurePackageId_fkey" FOREIGN KEY ("structurePackageId") REFERENCES "CtdStructurePackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextDefinition" ADD CONSTRAINT "ContextDefinition_ctdSectionId_fkey" FOREIGN KEY ("ctdSectionId") REFERENCES "CtdSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "DocumentVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextOfUse" ADD CONSTRAINT "ContextOfUse_submissionUnitId_fkey" FOREIGN KEY ("submissionUnitId") REFERENCES "SubmissionUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextOfUse" ADD CONSTRAINT "ContextOfUse_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextOfUse" ADD CONSTRAINT "ContextOfUse_contextDefinitionId_fkey" FOREIGN KEY ("contextDefinitionId") REFERENCES "ContextDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextOfUse" ADD CONSTRAINT "ContextOfUse_ctdSectionId_fkey" FOREIGN KEY ("ctdSectionId") REFERENCES "CtdSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentRelationship" ADD CONSTRAINT "DocumentRelationship_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentRelationship" ADD CONSTRAINT "DocumentRelationship_targetDocumentId_fkey" FOREIGN KEY ("targetDocumentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReference" ADD CONSTRAINT "DocumentReference_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReference" ADD CONSTRAINT "DocumentReference_targetDocumentId_fkey" FOREIGN KEY ("targetDocumentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentLink" ADD CONSTRAINT "DocumentLink_sourceDocumentVersionId_fkey" FOREIGN KEY ("sourceDocumentVersionId") REFERENCES "DocumentVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifecycleOperation" ADD CONSTRAINT "LifecycleOperation_submissionUnitId_fkey" FOREIGN KEY ("submissionUnitId") REFERENCES "SubmissionUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifecycleOperation" ADD CONSTRAINT "LifecycleOperation_contextOfUseId_fkey" FOREIGN KEY ("contextOfUseId") REFERENCES "ContextOfUse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextOfUseRelationship" ADD CONSTRAINT "ContextOfUseRelationship_sourceContextId_fkey" FOREIGN KEY ("sourceContextId") REFERENCES "ContextOfUse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextOfUseRelationship" ADD CONSTRAINT "ContextOfUseRelationship_targetContextId_fkey" FOREIGN KEY ("targetContextId") REFERENCES "ContextOfUse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeywordDefinition" ADD CONSTRAINT "KeywordDefinition_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "RegulatoryApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextKeyword" ADD CONSTRAINT "ContextKeyword_contextOfUseId_fkey" FOREIGN KEY ("contextOfUseId") REFERENCES "ContextOfUse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContextKeyword" ADD CONSTRAINT "ContextKeyword_keywordDefinitionId_fkey" FOREIGN KEY ("keywordDefinitionId") REFERENCES "KeywordDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SenderCodeList" ADD CONSTRAINT "SenderCodeList_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SenderCodeListValue" ADD CONSTRAINT "SenderCodeListValue_codeListId_fkey" FOREIGN KEY ("codeListId") REFERENCES "SenderCodeList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationProfile" ADD CONSTRAINT "ValidationProfile_ectdStandardId_fkey" FOREIGN KEY ("ectdStandardId") REFERENCES "EctdStandard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationProfile" ADD CONSTRAINT "ValidationProfile_regionalSpecificationId_fkey" FOREIGN KEY ("regionalSpecificationId") REFERENCES "RegionalSpecification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationRule" ADD CONSTRAINT "ValidationRule_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "EctdStandard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationRule" ADD CONSTRAINT "ValidationRule_regionalSpecificationId_fkey" FOREIGN KEY ("regionalSpecificationId") REFERENCES "RegionalSpecification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulatoryRuleSource" ADD CONSTRAINT "RegulatoryRuleSource_validationRuleId_fkey" FOREIGN KEY ("validationRuleId") REFERENCES "ValidationRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationRun" ADD CONSTRAINT "ValidationRun_submissionUnitId_fkey" FOREIGN KEY ("submissionUnitId") REFERENCES "SubmissionUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationRun" ADD CONSTRAINT "ValidationRun_validationProfileId_fkey" FOREIGN KEY ("validationProfileId") REFERENCES "ValidationProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationResult" ADD CONSTRAINT "ValidationResult_validationRunId_fkey" FOREIGN KEY ("validationRunId") REFERENCES "ValidationRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationResult" ADD CONSTRAINT "ValidationResult_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "ValidationRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionUnitSnapshot" ADD CONSTRAINT "SubmissionUnitSnapshot_submissionUnitId_fkey" FOREIGN KEY ("submissionUnitId") REFERENCES "SubmissionUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XmlGenerationRun" ADD CONSTRAINT "XmlGenerationRun_submissionUnitId_fkey" FOREIGN KEY ("submissionUnitId") REFERENCES "SubmissionUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionPackage" ADD CONSTRAINT "SubmissionPackage_submissionUnitId_fkey" FOREIGN KEY ("submissionUnitId") REFERENCES "SubmissionUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

