import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  applicationsApi,
  submissionsApi,
  submissionUnitsApi,
  documentsApi,
  contextsOfUseApi,
  validationApi,
  reviewApi,
  regulatoryApi,
  authApi,
  ctdApi,
  publishingApi,
  adminApi,
  type CreateApplicationDto,
  type ReuseResult,
  type ReplaceResult,
  type ValidationProfile,
  type OrgUser,
  type ReviewStatus,
} from "./client";

// ── Query keys ────────────────────────────────────────────────────────────────

export const qk = {
  me: ["me"] as const,
  applications: (page?: number) => ["applications", page] as const,
  application: (id: string) => ["application", id] as const,
  applicationSubmissions: (id: string) => ["application", id, "submissions"] as const,
  applicationAudit: (id: string, page?: number) => ["application", id, "audit", page] as const,
  submission: (id: string) => ["submission", id] as const,
  submissionUnits: (submissionId: string) => ["submission", submissionId, "units"] as const,
  submissionUnit: (id: string) => ["submissionUnit", id] as const,
  contextsOfUse: (submissionUnitId: string) => ["submissionUnit", submissionUnitId, "cou"] as const,
  contextOfUse: (id: string) => ["cou", id] as const,
  couLifecycle: (id: string) => ["cou", id, "lifecycle"] as const,
  documents: (applicationId: string, page?: number) => ["documents", applicationId, page] as const,
  document: (id: string) => ["document", id] as const,
  documentVersions: (id: string) => ["document", id, "versions"] as const,
  validationRun: (id: string) => ["validationRun", id] as const,
  validationResults: (runId: string) => ["validationRun", runId, "results"] as const,
  ctdPackages: ["ctd", "packages"] as const,
  ctdSectionTree: (packageId: string) => ["ctd", packageId, "tree"] as const,
  ctdContextDefinitions: (packageId: string) => ["ctd", packageId, "contextDefs"] as const,
  standards: ["regulatory", "standards"] as const,
  regions: ["regulatory", "regions"] as const,
  specifications: ["regulatory", "specifications"] as const,
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export function useCurrentUser(
  options?: Partial<UseQueryOptions<Awaited<ReturnType<typeof authApi.me>>>>,
) {
  return useQuery({
    queryKey: qk.me,
    queryFn: () => authApi.me(),
    staleTime: 5 * 60 * 1000,
    retry: false,
    ...options,
  });
}

// ── Applications ──────────────────────────────────────────────────────────────

export function useApplications(page = 1) {
  return useQuery({
    queryKey: qk.applications(page),
    queryFn: () => applicationsApi.list(page),
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: qk.application(id),
    queryFn: () => applicationsApi.get(id),
    enabled: !!id,
  });
}

export function useApplicationSubmissions(applicationId: string) {
  return useQuery({
    queryKey: qk.applicationSubmissions(applicationId),
    queryFn: () => applicationsApi.getSubmissions(applicationId),
    enabled: !!applicationId,
  });
}

export function useApplicationAudit(applicationId: string, page = 1, pageSize = 50) {
  return useQuery({
    queryKey: qk.applicationAudit(applicationId, page),
    queryFn: () => applicationsApi.getAudit(applicationId, page, pageSize),
    enabled: !!applicationId,
  });
}

export function useCreateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateApplicationDto) => applicationsApi.create(dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

// ── Submissions ───────────────────────────────────────────────────────────────

export function useSubmission(id: string) {
  return useQuery({
    queryKey: qk.submission(id),
    queryFn: () => submissionsApi.get(id),
    enabled: !!id,
  });
}

export function useSubmissionUnits(submissionId: string) {
  return useQuery({
    queryKey: qk.submissionUnits(submissionId),
    queryFn: () => submissionsApi.getSubmissionUnits(submissionId),
    enabled: !!submissionId,
    select: (data) => data.data,
  });
}

// ── Submission Units ──────────────────────────────────────────────────────────

export function useSubmissionUnit(id: string) {
  return useQuery({
    queryKey: qk.submissionUnit(id),
    queryFn: () => submissionUnitsApi.get(id),
    enabled: !!id,
  });
}

export function useContextsOfUse(submissionUnitId: string) {
  return useQuery({
    queryKey: qk.contextsOfUse(submissionUnitId),
    queryFn: () => submissionUnitsApi.getContextsOfUse(submissionUnitId),
    enabled: !!submissionUnitId,
    select: (data) => data.data,
  });
}

// ── Contexts of Use ───────────────────────────────────────────────────────────

export function useContextOfUse(id: string) {
  return useQuery({
    queryKey: qk.contextOfUse(id),
    queryFn: () => contextsOfUseApi.get(id),
    enabled: !!id,
  });
}

export function useCouLifecycle(id: string) {
  return useQuery({
    queryKey: qk.couLifecycle(id),
    queryFn: () => contextsOfUseApi.getLifecycle(id),
    enabled: !!id,
  });
}

export function useCreateContextOfUse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionUnitId,
      documentId,
      contextDefinitionId,
      priorityNumber,
    }: {
      submissionUnitId: string;
      documentId: string;
      contextDefinitionId: string;
      priorityNumber?: number | undefined;
    }) =>
      contextsOfUseApi.create(submissionUnitId, {
        documentId,
        contextDefinitionId,
        ...(priorityNumber !== undefined ? { priorityNumber } : {}),
      }),
    onSuccess: (_data, { submissionUnitId }) => {
      void qc.invalidateQueries({ queryKey: qk.contextsOfUse(submissionUnitId) });
    },
  });
}

export function useSuspendContextOfUse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      contextsOfUseApi.suspend(id, reason),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: qk.contextOfUse(id) });
      void qc.invalidateQueries({ queryKey: ["submissionUnit"] });
    },
  });
}

export function useReplaceContextOfUse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      replacingContextOfUseId,
      reason,
    }: {
      id: string;
      replacingContextOfUseId: string;
      reason?: string | undefined;
    }): Promise<ReplaceResult> =>
      contextsOfUseApi.replace(id, { replacingContextOfUseId, reason }),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: qk.contextOfUse(id) });
      void qc.invalidateQueries({ queryKey: ["submissionUnit"] });
    },
  });
}

// ── Documents ─────────────────────────────────────────────────────────────────

export function useDocuments(applicationId: string, page = 1) {
  return useQuery({
    queryKey: qk.documents(applicationId, page),
    queryFn: () => documentsApi.list(applicationId, page),
    enabled: !!applicationId,
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: qk.document(id),
    queryFn: () => documentsApi.get(id),
    enabled: !!id,
  });
}

export function useDocumentVersions(id: string) {
  return useQuery({
    queryKey: qk.documentVersions(id),
    queryFn: () => documentsApi.getVersions(id),
    enabled: !!id,
  });
}

export function useDocumentDownloadRef(id: string) {
  return useQuery({
    queryKey: ["document", id, "download-ref"],
    queryFn: () => documentsApi.getDownloadRef(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      title,
      language,
      applicationId,
    }: {
      file: File;
      title: string;
      language?: string | undefined;
      applicationId: string;
    }) => documentsApi.uploadNew(file, title, language),
    onSuccess: (_data, { applicationId }) => {
      void qc.invalidateQueries({ queryKey: ["documents", applicationId] });
    },
  });
}

export function useReuseDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      targetSubmissionUnitId,
      targetContextDefinitionId,
      reason,
    }: {
      id: string;
      targetSubmissionUnitId: string;
      targetContextDefinitionId: string;
      reason?: string | undefined;
    }): Promise<ReuseResult> =>
      documentsApi.reuse(id, targetSubmissionUnitId, targetContextDefinitionId, reason),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

// ── Validation ────────────────────────────────────────────────────────────────

export function useValidationProfiles() {
  return useQuery({
    queryKey: ["validation", "profiles"],
    queryFn: () => validationApi.getProfiles(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useValidationRun(id: string) {
  return useQuery({
    queryKey: qk.validationRun(id),
    queryFn: () => validationApi.getRun(id),
    enabled: !!id,
    // Poll every 3s while the run is in progress
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "RUNNING" || status === "PENDING" ? 3000 : false;
    },
  });
}

export function useValidationResults(runId: string) {
  return useQuery({
    queryKey: qk.validationResults(runId),
    queryFn: () => validationApi.getResults(runId),
    enabled: !!runId,
  });
}

export function useTriggerValidation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionUnitId,
      validationProfileId,
    }: {
      submissionUnitId: string;
      validationProfileId: string;
    }) => validationApi.triggerRun(submissionUnitId, validationProfileId),
    onSuccess: (_data, { submissionUnitId }) => {
      void qc.invalidateQueries({ queryKey: qk.submissionUnit(submissionUnitId) });
    },
  });
}

// ── CTD ────────────────────────────────────────────────────────────────────────────────

export function useCtdPackages() {
  return useQuery({
    queryKey: qk.ctdPackages,
    queryFn: () => ctdApi.getPackages(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCtdSectionTree(packageId: string | null | undefined) {
  return useQuery({
    queryKey: qk.ctdSectionTree(packageId ?? ""),
    queryFn: () => ctdApi.getSectionTree(packageId!),
    enabled: !!packageId,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCtdContextDefinitions(packageId: string | null | undefined) {
  return useQuery({
    queryKey: qk.ctdContextDefinitions(packageId ?? ""),
    queryFn: () => ctdApi.getContextDefinitions(packageId!),
    enabled: !!packageId,
    staleTime: 10 * 60 * 1000,
  });
}

// ── Publishing ────────────────────────────────────────────────────────────────

export function useSubmissionPackages(submissionUnitId: string) {
  return useQuery({
    queryKey: ["submissionUnit", submissionUnitId, "packages"],
    queryFn: () => publishingApi.getPackages(submissionUnitId),
    enabled: !!submissionUnitId,
  });
}

export function usePackageManifest(packageId: string) {
  return useQuery({
    queryKey: ["package", packageId, "manifest"],
    queryFn: () => publishingApi.getManifest(packageId),
    enabled: !!packageId,
  });
}

export function usePackageDownloadRef(packageId: string) {
  return useQuery({
    queryKey: ["package", packageId, "download-ref"],
    queryFn: () => publishingApi.getDownloadRef(packageId),
    enabled: !!packageId,
    staleTime: 30 * 1000,
  });
}

export function useFreezeUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (submissionUnitId: string) =>
      submissionUnitsApi.freeze(submissionUnitId),
    onSuccess: (_data, submissionUnitId) => {
      void qc.invalidateQueries({ queryKey: qk.submissionUnit(submissionUnitId) });
    },
  });
}

export function usePreparePublication() {
  return useMutation({
    mutationFn: (submissionUnitId: string) =>
      submissionUnitsApi.preparePublication(submissionUnitId),
  });
}

export function usePublishUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ submissionUnitId, reason }: { submissionUnitId: string; reason?: string | undefined }) =>
      submissionUnitsApi.publish(submissionUnitId, reason),
    onSuccess: (_data, { submissionUnitId }) => {
      void qc.invalidateQueries({ queryKey: qk.submissionUnit(submissionUnitId) });
      void qc.invalidateQueries({ queryKey: ["submissionUnit", submissionUnitId, "packages"] });
    },
  });
}

export function useInvalidatePackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ packageId, reason }: { packageId: string; reason: string }) =>
      publishingApi.invalidate(packageId, reason),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["package"] });
      void qc.invalidateQueries({ queryKey: ["submissionUnit"] });
    },
  });
}

export function useEctdStandards() {
  return useQuery({
    queryKey: qk.standards,
    queryFn: () => regulatoryApi.getStandards(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useRegulatoryRegions() {
  return useQuery({
    queryKey: qk.regions,
    queryFn: () => regulatoryApi.getRegions(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useRegionalSpecifications() {
  return useQuery({
    queryKey: qk.specifications,
    queryFn: () => regulatoryApi.getSpecifications(),
    staleTime: 10 * 60 * 1000,
  });
}

// ── Review ────────────────────────────────────────────────────────────────────

export function useReviewFindings(submissionUnitId: string) {
  return useQuery({
    queryKey: ["review", submissionUnitId, "findings"],
    queryFn: () => reviewApi.getFindings(submissionUnitId),
    enabled: !!submissionUnitId,
    retry: false,
  });
}

export function useReviewDecision(submissionUnitId: string) {
  return useQuery({
    queryKey: ["review", submissionUnitId, "decision"],
    queryFn: () => reviewApi.getDecision(submissionUnitId),
    enabled: !!submissionUnitId,
    retry: false,
  });
}

export function useCreateReviewFinding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionUnitId,
      entityType,
      entityId,
      severity,
      comment,
    }: {
      submissionUnitId: string;
      entityType: string;
      entityId: string;
      severity: string;
      comment: string;
    }) => reviewApi.createFinding(submissionUnitId, { entityType, entityId, severity, comment }),
    onSuccess: (_data, { submissionUnitId }) => {
      void qc.invalidateQueries({ queryKey: ["review", submissionUnitId, "findings"] });
    },
  });
}

export function useSetReviewDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionUnitId,
      status,
      comment,
    }: {
      submissionUnitId: string;
      status: ReviewStatus;
      comment?: string | undefined;
    }) =>
      reviewApi.setDecision(submissionUnitId, {
        status,
        ...(comment !== undefined ? { comment } : {}),
      }),
    onSuccess: (_data, { submissionUnitId }) => {
      void qc.invalidateQueries({ queryKey: ["review", submissionUnitId] });
    },
  });
}

// ── Admin ────────────────────────────────────────────────────────────────

export function useOrgUsers(page = 1) {
  return useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => adminApi.listUsers(page),
  });
}

export function useOrgUser(id: string) {
  return useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => adminApi.getUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { email: string; name: string; password: string }) =>
      adminApi.createUser(dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name, status }: { id: string; name?: string | undefined; status?: string | undefined }) =>
      adminApi.updateUser(id, {
        ...(name !== undefined ? { name } : {}),
        ...(status !== undefined ? { status } : {}),
      }),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: ["admin", "user", id] });
      void qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUserRoles(userId: string) {
  return useQuery({
    queryKey: ["admin", "user", userId, "roles"],
    queryFn: () => adminApi.getUserRoles(userId),
    enabled: !!userId,
  });
}

export function useAssignRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      adminApi.assignRole(userId, roleId),
    onSuccess: (_data, { userId }) => {
      void qc.invalidateQueries({ queryKey: ["admin", "user", userId] });
    },
  });
}

export function useRemoveRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      adminApi.removeRole(userId, roleId),
    onSuccess: (_data, { userId }) => {
      void qc.invalidateQueries({ queryKey: ["admin", "user", userId] });
    },
  });
}

export function useOrganizations() {
  return useQuery({
    queryKey: ["admin", "orgs"],
    queryFn: () => adminApi.listOrgs(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateOrg() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, code, type }: { name: string; code?: string | undefined; type?: string | undefined }) =>
      adminApi.createOrg({
        name,
        ...(code !== undefined ? { code } : {}),
        ...(type !== undefined ? { type } : {}),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "orgs"] });
    },
  });
}
