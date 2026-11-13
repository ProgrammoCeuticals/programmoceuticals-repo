/**
 * Typed API client for the ProgrammoCeuticals eCTD backend.
 *
 * All requests go through this module. Token injection and refresh
 * are handled here so no component ever touches tokens directly.
 *
 * Base path: /api/v1 (proxied by Next.js rewrites to the NestJS API)
 */

const BASE = "/api/v1";

// ── Response shapes aligned to backend DTOs ──────────────────────────────────

export interface ApiError {
  error: {
    code: string;
    message: string;
    category: string;
    details: Record<string, unknown>;
    correlationId: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Auth
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  organizationId: string | null;
  isSuperAdmin: boolean;
}

// Organizations
export interface Organization {
  id: string;
  name: string;
  code: string | null;
  type: string | null;
  status: string;
}

// Applications
export interface RegulatoryApplication {
  id: string;
  uuid: string;
  organizationId: string;
  productId: string;
  authorityId: string;
  regionId: string;
  ectdStandardId: string;
  regionalSpecificationId: string;
  applicationNumber: string | null;
  applicationType: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationDto {
  productId: string;
  authorityId: string;
  regionId: string;
  ectdStandardId: string;
  regionalSpecificationId: string;
  applicationNumber?: string;
  applicationType?: string;
}

// Submissions
export interface Submission {
  id: string;
  uuid: string;
  applicationId: string;
  submissionType: string | null;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Submission Units
export interface SubmissionUnit {
  id: string;
  uuid: string;
  sequenceNumber: number;
  status: string;
  ectdStandardId: string;
  regionalSpecificationId: string | null;
  ctdStructurePackageId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FreezeResult {
  snapshotId: string;
  snapshotVersion: number;
  submissionUnitId: string;
}

export interface PreparePublicationResult {
  ready: boolean;
  blockingIssues: Array<{ code: string; message: string }>;
  warnings: Array<{ code: string; message: string }>;
}

export interface PublishResult {
  jobId: string;
  submissionUnitId: string;
  status: string;
}

// Publishing
export interface SubmissionPackage {
  id: string;
  submissionUnitId: string;
  packageVersion: number;
  status: string;
  checksum: string;
  checksumAlgorithm: string;
  fileSize: string;
  generatorVersion: string | null;
  validationRunId: string | null;
  xmlGenerationRunId: string | null;
  generatedAt: string;
}

export interface PackageManifest {
  packageId: string;
  submissionUnitId: string;
  packageVersion: number;
  checksum: string;
  checksumAlgorithm: string;
  fileSize: string;
  status: string;
  generatorVersion: string | null;
  validationRunId: string | null;
  xmlGenerationRunId: string | null;
  generatedAt: string;
  readyForTransmission: boolean;
}

export interface PackageDownloadRef {
  packageId: string;
  packageVersion: number;
  checksum: string;
  checksumAlgorithm: string;
  fileSize: string;
  status: string;
  available: boolean;
}

// Contexts of Use
export interface ContextOfUse {
  id: string;
  uuid: string;
  submissionUnitId: string;
  documentId: string;
  contextDefinitionId: string;
  status: string;
  priorityNumber: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface LifecycleOperation {
  id: string;
  submissionUnitId: string;
  contextOfUseId: string | null;
  operationType: string;
  reason: string | null;
  createdAt: string;
}

export interface ReplaceResult {
  message: string;
  relationshipId: string;
}

// Documents
export interface Document {
  id: string;
  uuid: string;
  title: string;
  filename: string;
  mimeType: string;
  language: string | null;
  currentVersionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  filename: string;
  mimeType: string | null;
  fileSize: number;
  checksum: string;
  checksumAlgorithm: string;
  createdAt: string;
}

export interface DownloadRef {
  documentId: string;
  versionNumber: number;
  filename: string;
  mimeType: string | null;
  fileSize: string;
  checksum: string;
  available: boolean;
}

export interface ReuseResult {
  canReuse: boolean;
  findings: unknown[];
  message: string;
}

// Validation
export interface ValidationProfile {
  id: string;
  name: string;
  version: string;
  rulesetVersion: string;
  ectdStandardId: string;
  regionalSpecificationId: string | null;
  status: string;
}

export interface ValidationRun {
  id: string;
  submissionUnitId: string;
  validationProfileId: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  engineVersion: string | null;
  profileVersion: string | null;
}

export interface ValidationResultWithRule {
  id: string;
  validationRunId: string;
  ruleId: string;
  severity: string;
  status: string;
  message: string;
  entityType: string | null;
  entityId: string | null;
  location: string | null;
  remediation: string | null;
  createdAt: string;
  rule: {
    ruleCode: string;
    name: string;
    source: string;
    severity: string;
  } | null;
}

export interface ValidationResult {
  id: string;
  validationRunId: string;
  ruleId: string;
  severity: string;
  status: string;
  message: string;
  entityType: string | null;
  entityId: string | null;
  location: string | null;
  remediation: string | null;
  createdAt: string;
}

// Audit
export type AuditEventType =
  | "CREATE_APPLICATION"
  | "UPDATE_APPLICATION"
  | "CREATE_SUBMISSION"
  | "CREATE_SUBMISSION_UNIT"
  | "FREEZE_SUBMISSION_UNIT"
  | "UPLOAD_DOCUMENT"
  | "CREATE_DOCUMENT_VERSION"
  | "REUSE_DOCUMENT"
  | "SUSPEND_CONTEXT"
  | "REPLACE_CONTEXT"
  | "RUN_VALIDATION"
  | "GENERATE_XML"
  | "PUBLISH_SUBMISSION_UNIT"
  | "INVALIDATE_PACKAGE"
  | "IMPORT_REGULATORY_PACKAGE"
  | "ACTIVATE_REGULATORY_PACKAGE"
  | "LOGIN"
  | "LOGOUT"
  | "CREATE_ORGANIZATION"
  | "UPDATE_ORGANIZATION"
  | "CREATE_USER"
  | "UPDATE_USER_ROLE"
  | (string & {});

export interface AuditEvent {
  id: string;
  organizationId: string;
  userId: string | null;
  eventType: AuditEventType;
  entityType: string;
  entityId: string;
  oldValue: unknown;
  newValue: unknown;
  correlationId: string | null;
  timestamp: string;
}

// Regulatory
export interface EctdStandard {
  id: string;
  name: string;
  version: string;
  status: string;
}

export interface RegionalSpecification {
  id: string;
  name: string;
  version: string;
  regionId: string;
  authorityId: string | null;
  status: string;
}

export interface RegulatoryAuthority {
  id: string;
  name: string;
  code: string;
  countryCode: string | null;
}

export interface RegulatoryRegion {
  id: string;
  name: string;
  code: string;
  countryCode: string | null;
}

// ── Token storage (memory + localStorage for refresh only) ───────────────────

let _accessToken: string | null = null;

function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ectd_rt");
}

function setStoredRefreshToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("ectd_rt", token);
  }
}

function clearStoredTokens(): void {
  _accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("ectd_rt");
  }
}

export function setTokens(tokens: AuthTokens): void {
  _accessToken = tokens.accessToken;
  setStoredRefreshToken(tokens.refreshToken);
}

export function clearTokens(): void {
  clearStoredTokens();
}

export function hasSession(): boolean {
  return getStoredRefreshToken() !== null;
}

// ── Core fetch with automatic token refresh ───────────────────────────────────

let _refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  const rt = getStoredRefreshToken();
  if (!rt) throw new Error("No refresh token");

  const res = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: rt }),
  });

  if (!res.ok) {
    clearStoredTokens();
    throw new Error("Session expired");
  }

  const tokens: AuthTokens = await res.json();
  setTokens(tokens);
}

async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (_accessToken) {
    headers["Authorization"] = `Bearer ${_accessToken}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...init, headers });

  if (res.status === 401 && retry) {
    // Deduplicate concurrent refresh attempts
    if (!_refreshPromise) {
      _refreshPromise = refreshAccessToken().finally(() => {
        _refreshPromise = null;
      });
    }
    try {
      await _refreshPromise;
      return apiFetch<T>(path, init, false);
    } catch {
      clearStoredTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired");
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new ApiClientError(res.status, body);
    throw err;
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: Partial<ApiError>,
  ) {
    super(body.error?.message ?? `HTTP ${status}`);
    this.name = "ApiClientError";
  }

  get code(): string {
    return this.body.error?.code ?? "UNKNOWN";
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isConflict(): boolean {
    return this.status === 409;
  }
}

// ── Auth endpoints ────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthTokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  refresh: (refreshToken: string) =>
    apiFetch<AuthTokens>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  logout: () =>
    apiFetch<void>("/auth/logout", { method: "POST" }),

  me: () => apiFetch<CurrentUser>("/auth/me"),
};

// ── Applications ──────────────────────────────────────────────────────────────

export const applicationsApi = {
  list: (page = 1, pageSize = 20) =>
    apiFetch<PaginatedResponse<RegulatoryApplication>>(
      `/applications?page=${page}&pageSize=${pageSize}`,
    ),

  get: (id: string) =>
    apiFetch<RegulatoryApplication>(`/applications/${id}`),

  create: (dto: CreateApplicationDto) =>
    apiFetch<RegulatoryApplication>("/applications", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  update: (id: string, dto: Partial<CreateApplicationDto>) =>
    apiFetch<RegulatoryApplication>(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dto),
    }),

  getSubmissions: (id: string) =>
    apiFetch<Submission[]>(`/applications/${id}/submissions`),

  getAudit: (id: string, page = 1, pageSize = 50) =>
    apiFetch<PaginatedResponse<AuditEvent>>(
      `/applications/${id}/audit?page=${page}&pageSize=${pageSize}`,
    ),
};

// ── Submissions ───────────────────────────────────────────────────────────────

export const submissionsApi = {
  create: (applicationId: string, dto: { submissionType?: string; description?: string }) =>
    apiFetch<Submission>(`/applications/${applicationId}/submissions`, {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  get: (id: string) => apiFetch<Submission>(`/submissions/${id}`),

  getSubmissionUnits: (id: string) =>
    apiFetch<PaginatedResponse<SubmissionUnit>>(`/submissions/${id}/submission-units`),
};

// ── Submission Units ──────────────────────────────────────────────────────────

export const submissionUnitsApi = {
  get: (id: string) => apiFetch<SubmissionUnit>(`/submission-units/${id}`),

  getContextsOfUse: (id: string) =>
    apiFetch<PaginatedResponse<ContextOfUse>>(`/submission-units/${id}/contexts-of-use`),

  freeze: (id: string) =>
    apiFetch<FreezeResult>(`/submission-units/${id}/freeze`, { method: "POST" }),

  validate: (id: string, validationProfileId: string) =>
    apiFetch<{ validationRunId: string; status: string }>(
      `/submission-units/${id}/validate`,
      { method: "POST", body: JSON.stringify({ validationProfileId }) },
    ),

  generateXml: (id: string) =>
    apiFetch<{ jobId: string }>(`/submission-units/${id}/generate-xml`, {
      method: "POST",
    }),

  preparePublication: (id: string) =>
    apiFetch<PreparePublicationResult>(
      `/submission-units/${id}/prepare-publication`,
      { method: "POST" },
    ),

  publish: (id: string, reason?: string) =>
    apiFetch<PublishResult>(`/submission-units/${id}/publish`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
};

// ── Publishing ────────────────────────────────────────────────────────────────

export const publishingApi = {
  getPackages: (submissionUnitId: string) =>
    apiFetch<PaginatedResponse<SubmissionPackage>>(
      `/submission-units/${submissionUnitId}/packages`,
    ),

  getPackage: (id: string) =>
    apiFetch<SubmissionPackage>(`/submission-packages/${id}`),

  getManifest: (id: string) =>
    apiFetch<PackageManifest>(`/submission-packages/${id}/manifest`),

  getDownloadRef: (id: string) =>
    apiFetch<PackageDownloadRef>(`/submission-packages/${id}/download`),

  invalidate: (id: string, reason: string) =>
    apiFetch<{ id: string; status: string }>(
      `/submission-packages/${id}/invalidate`,
      { method: "POST", body: JSON.stringify({ reason }) },
    ),
};

// ── Documents ─────────────────────────────────────────────────────────────────

export const documentsApi = {
  list: (applicationId: string, page = 1, pageSize = 50) =>
    apiFetch<PaginatedResponse<Document>>(
      `/documents?applicationId=${applicationId}&page=${page}&pageSize=${pageSize}`,
    ),

  get: (id: string) => apiFetch<Document>(`/documents/${id}`),

  getVersions: (id: string) =>
    apiFetch<DocumentVersion[]>(`/documents/${id}/versions`),

  /**
   * Create document metadata record, then upload the file as a version.
   * Two-step: POST /documents → POST /documents/:id/versions (multipart).
   */
  uploadNew: async (file: File, title: string, language?: string): Promise<Document> => {
    const doc = await apiFetch<Document>("/documents", {
      method: "POST",
      body: JSON.stringify({
        title,
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        language: language ?? null,
      }),
    });

    const fd = new FormData();
    fd.append("file", file);
    fd.append("filename", file.name);
    fd.append("mimeType", file.type || "application/octet-stream");
    if (language) fd.append("language", language);

    // Upload version — must omit Content-Type so browser sets multipart boundary
    const headers: Record<string, string> = {};
    if (_accessToken) headers["Authorization"] = `Bearer ${_accessToken}`;
    const res = await fetch(`${BASE}/documents/${doc.id}/versions`, {
      method: "POST",
      headers,
      body: fd,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiClientError(res.status, body);
    }
    return doc;
  },

  getDownloadRef: (id: string) =>
    apiFetch<DownloadRef>(`/documents/${id}/download-ref`),

  reuse: (id: string, targetSubmissionUnitId: string, targetContextDefinitionId: string, reason?: string) =>
    apiFetch<ReuseResult>(`/documents/${id}/reuse`, {
      method: "POST",
      body: JSON.stringify({ targetSubmissionUnitId, targetContextDefinitionId, reason }),
    }),
};

// ── Contexts of Use ───────────────────────────────────────────────────────────

export const contextsOfUseApi = {
  create: (
    submissionUnitId: string,
    dto: { documentId: string; contextDefinitionId: string; priorityNumber?: number },
  ) =>
    apiFetch<ContextOfUse>(`/submission-units/${submissionUnitId}/contexts-of-use`, {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  get: (id: string) => apiFetch<ContextOfUse>(`/contexts-of-use/${id}`),

  suspend: (id: string, reason: string) =>
    apiFetch<ContextOfUse>(`/contexts-of-use/${id}/suspend`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  replace: (id: string, dto: { replacingContextOfUseId: string; reason?: string | undefined }) =>
    apiFetch<ReplaceResult>(`/contexts-of-use/${id}/replace`, {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  getLifecycle: (id: string) =>
    apiFetch<LifecycleOperation[]>(`/contexts-of-use/${id}/lifecycle`),
};

// ── Validation ────────────────────────────────────────────────────────────────

export const validationApi = {
  getProfiles: () =>
    apiFetch<ValidationProfile[]>("/validation/profiles"),

  getRun: (id: string) => apiFetch<ValidationRun>(`/validation-runs/${id}`),

  getResults: (id: string) =>
    apiFetch<ValidationResultWithRule[]>(`/validation-runs/${id}/results`),

  triggerRun: (submissionUnitId: string, validationProfileId: string) =>
    apiFetch<{ validationRunId: string; status: string }>(
      `/submission-units/${submissionUnitId}/validate`,
      { method: "POST", body: JSON.stringify({ validationProfileId }) },
    ),
};

// ── Review ───────────────────────────────────────────────────────────────────
// NOTE: Review endpoints are not yet implemented in the backend.
// These stubs return REVIEW_GAP errors so the UI can surface the gap correctly.

export const reviewApi = {
  getFindings: (_submissionUnitId: string): Promise<ReviewFinding[]> =>
    Promise.reject(new ApiClientError(501, { error: { code: "REVIEW_GAP", message: "Review endpoints not yet implemented", category: "REGULATORY_GAP", details: {}, correlationId: "" } })),

  createFinding: (_submissionUnitId: string, _dto: { entityType: string; entityId: string; severity: string; comment: string }): Promise<ReviewFinding> =>
    Promise.reject(new ApiClientError(501, { error: { code: "REVIEW_GAP", message: "Review endpoints not yet implemented", category: "REGULATORY_GAP", details: {}, correlationId: "" } })),

  getDecision: (_submissionUnitId: string): Promise<ReviewDecision> =>
    Promise.reject(new ApiClientError(501, { error: { code: "REVIEW_GAP", message: "Review endpoints not yet implemented", category: "REGULATORY_GAP", details: {}, correlationId: "" } })),

  setDecision: (_submissionUnitId: string, _dto: { status: ReviewStatus; comment?: string }): Promise<ReviewDecision> =>
    Promise.reject(new ApiClientError(501, { error: { code: "REVIEW_GAP", message: "Review endpoints not yet implemented", category: "REGULATORY_GAP", details: {}, correlationId: "" } })),
};

// ── CTD Structure ────────────────────────────────────────────────────────────

export interface CtdStructurePackage {
  id: string;
  name: string;
  version: string;
  standardId: string | null;
  regionalSpecificationId: string | null;
  status: string;
}

export interface CtdModule {
  id: string;
  packageId: string;
  moduleNumber: string;
  title: string;
  displayOrder: number;
}

export interface CtdSection {
  id: string;
  moduleId: string;
  parentId: string | null;
  sectionCode: string;
  title: string;
  level: number;
  displayOrder: number;
  children?: CtdSection[];
}

export interface ContextDefinition {
  id: string;
  structurePackageId: string;
  ctdSectionId: string;
  code: string;
  codeSystem: string;
  name: string;
  description: string | null;
}

export const ctdApi = {
  getPackages: () =>
    apiFetch<CtdStructurePackage[]>("/ctd/packages"),

  getModules: (packageId: string) =>
    apiFetch<CtdModule[]>(`/ctd/packages/${packageId}/modules`),

  getSectionTree: (packageId: string) =>
    apiFetch<CtdSection[]>(`/ctd/packages/${packageId}/sections/tree`),

  getContextDefinitions: (packageId: string) =>
    apiFetch<ContextDefinition[]>(`/ctd/packages/${packageId}/context-definitions`),
};

// Review
export type ReviewStatus = "NOT_REVIEWED" | "IN_REVIEW" | "APPROVED" | "REQUIRES_ACTION";

export interface ReviewFinding {
  id: string;
  submissionUnitId: string;
  entityType: string;
  entityId: string;
  severity: "BLOCKING" | "MAJOR" | "MINOR" | "COMMENT";
  status: "OPEN" | "RESOLVED";
  comment: string;
  createdById: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface ReviewDecision {
  id: string;
  submissionUnitId: string;
  status: ReviewStatus;
  comment: string | null;
  decidedById: string | null;
  decidedAt: string;
}

// Admin
export interface OrgUser {
  id: string;
  email: string;
  name: string;
  status: string;
  createdAt: string;
  roles: Array<{ id: string; role: { id: string; name: string; permissions: Array<{ permission: { name: string } }> } }>;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Array<{ permission: { name: string } }>;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export const adminApi = {
  // Organizations (super-admin)
  listOrgs: () => apiFetch<Organization[]>("/organizations"),
  getOrg: (id: string) => apiFetch<Organization>(`/organizations/${id}`),
  createOrg: (dto: { name: string; code?: string; type?: string }) =>
    apiFetch<Organization>("/organizations", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
  updateOrg: (id: string, dto: { name?: string; code?: string; type?: string }) =>
    apiFetch<Organization>(`/organizations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dto),
    }),

  // Users (org-scoped)
  listUsers: (page = 1, pageSize = 25) =>
    apiFetch<PaginatedResponse<OrgUser>>(`/users?page=${page}&pageSize=${pageSize}`),
  getUser: (id: string) => apiFetch<OrgUser>(`/users/${id}`),
  createUser: (dto: { email: string; name: string; password: string }) =>
    apiFetch<OrgUser>("/users", { method: "POST", body: JSON.stringify(dto) }),
  updateUser: (id: string, dto: { name?: string; status?: string }) =>
    apiFetch<OrgUser>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dto),
    }),
  getUserRoles: (id: string) => apiFetch<UserRole[]>(`/users/${id}/roles`),
  assignRole: (id: string, roleId: string) =>
    apiFetch<void>(`/users/${id}/roles`, {
      method: "POST",
      body: JSON.stringify({ roleId }),
    }),
  removeRole: (id: string, roleId: string) =>
    apiFetch<void>(`/users/${id}/roles/${roleId}`, { method: "DELETE" }),
};

// ── Regulatory ────────────────────────────────────────────────────────────────

export const regulatoryApi = {
  getStandards: () => apiFetch<EctdStandard[]>("/regulatory/standards"),
  getRegions: () => apiFetch<RegulatoryRegion[]>("/regulatory/regions"),
  getSpecifications: () =>
    apiFetch<RegionalSpecification[]>("/regulatory/specifications"),
};
