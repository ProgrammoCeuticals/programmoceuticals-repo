import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type {
  Application, AssessorAssignment, AssessorComment, AssessorReport,
  AuditLog, BEChecklist, BESummaryResult, BEStudyPeriod,
  ComplianceDirective, LookupItem, Notification, ProductClassification,
  SectionBDocumentReference, User,
} from '../models';

const BASE = 'http://localhost:4000/api/v1';

export interface ClassificationSuggestion {
  productName: string;
  therapeuticIndexClass: 'NTI' | 'Non-NTI';
  bcsClass: string;
  rawBcsClass: string | null;
  matchedNtiProduct: string | null;
  matchedBcsProduct: string | null;
  matches: {
    nti: { productName: string; score: number }[];
    bcs: { productName: string; bcsClass: string; rawBcsClass: string | null; score: number }[];
  };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // ── Applications ──────────────────────────────────────────────────────────
  createApplication(data: object) {
    return this.http.post<{ application: Application }>(`${BASE}/applications`, data);
  }
  getMyApplications() {
    return this.http.get<{ applications: Application[] }>(`${BASE}/applications/my`);
  }
  getApplication(id: string) {
    return this.http.get<{ application: Application }>(`${BASE}/applications/${id}`);
  }
  updateApplication(id: string, data: object) {
    return this.http.patch<{ application: Application }>(`${BASE}/applications/${id}`, data);
  }
  submitApplication(id: string) {
    return this.http.post<{ application: Application }>(`${BASE}/applications/${id}/submit`, {});
  }

  // ── Checklist ─────────────────────────────────────────────────────────────
  getChecklist(appId: string) {
    return this.http.get<{ checklist: BEChecklist; studyPeriods: BEStudyPeriod[]; summaryResults: BESummaryResult[]; documentReferences: SectionBDocumentReference[] }>(`${BASE}/applications/${appId}/checklist`);
  }
  patchChecklist(appId: string, data: object) {
    return this.http.patch<{ checklist: BEChecklist }>(`${BASE}/applications/${appId}/checklist`, data);
  }
  putStudyPeriods(appId: string, studyPeriods: object[]) {
    return this.http.put<{ studyPeriods: BEStudyPeriod[] }>(`${BASE}/applications/${appId}/checklist/study-periods`, { studyPeriods });
  }
  putSummaryResults(appId: string, summaryResults: object[]) {
    return this.http.put<{ summaryResults: BESummaryResult[] }>(`${BASE}/applications/${appId}/checklist/summary-results`, { summaryResults });
  }
  putDocumentReferences(appId: string, documentReferences: object[]) {
    return this.http.put<{ documentReferences: SectionBDocumentReference[] }>(`${BASE}/applications/${appId}/checklist/document-references`, { documentReferences });
  }
  exportChecklistDocx(appId: string) {
    return this.http.get(`${BASE}/applications/${appId}/checklist/export/docx`, { responseType: 'blob' });
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  getSubmittedApplications() {
    return this.http.get<{ applications: Application[] }>(`${BASE}/admin/applications/submitted`);
  }
  startScreening(appId: string) {
    return this.http.post<{ application: Application }>(`${BASE}/admin/applications/${appId}/start-screening`, {});
  }
  addScreeningNote(appId: string, note: string) {
    return this.http.post(`${BASE}/admin/applications/${appId}/screening-notes`, { note });
  }
  markScreeningSatisfactory(appId: string) {
    return this.http.post<{ application: Application }>(`${BASE}/admin/applications/${appId}/screening/mark-satisfactory`, {});
  }
  getRegistry(params?: object) {
    return this.http.get<{ applications: Application[] }>(`${BASE}/admin/applications/registry`, { params: params as HttpParams });
  }
  getDashboardStats() {
    return this.http.get<{ stats: { total: number; submitted: number; finalized: number; ongoing: number } }>(`${BASE}/admin/dashboard/stats`);
  }
  getAssessors() {
    return this.http.get<{ assessors: User[] }>(`${BASE}/admin/assessors`);
  }
  addInternalNote(appId: string, note: string) {
    return this.http.post(`${BASE}/admin/applications/${appId}/internal-notes`, { note });
  }
  getInternalNotes(appId: string) {
    return this.http.get<{ notes: { id: string; note: string; authorUserId: string; createdAt: string }[] }>(`${BASE}/admin/applications/${appId}/internal-notes`);
  }
  exportRegistryExcel(params?: object) {
    return this.http.get(`${BASE}/admin/applications/registry/export/excel`, { responseType: 'blob', params: params as HttpParams });
  }
  exportRegistryCSV(params?: object) {
    return this.http.get(`${BASE}/admin/applications/registry/export/csv`, { responseType: 'blob', params: params as HttpParams });
  }
  getAssessorWorkloadReport() {
    return this.http.get<{ report: object[] }>(`${BASE}/admin/reports/assessor-workload`);
  }
  getComplianceDirectiveReport() {
    return this.http.get<{ summary: object; directives: ComplianceDirective[] }>(`${BASE}/admin/reports/compliance-directives`);
  }

  // ── Compliance Directives ─────────────────────────────────────────────────
  issueDirective(appId: string, data: object) {
    return this.http.post<{ directive: ComplianceDirective }>(`${BASE}/admin/applications/${appId}/compliance-directives`, data);
  }
  getDirectives(appId: string) {
    return this.http.get<{ directives: ComplianceDirective[] }>(`${BASE}/applications/${appId}/compliance-directives`);
  }
  getDirective(id: string) {
    return this.http.get<{ directive: ComplianceDirective }>(`${BASE}/compliance-directives/${id}`);
  }
  respondToDirective(id: string, data: object) {
    return this.http.post(`${BASE}/compliance-directives/${id}/respond`, data);
  }
  closeDirective(id: string) {
    return this.http.patch(`${BASE}/admin/compliance-directives/${id}/close`, {});
  }

  // ── Classification ────────────────────────────────────────────────────────
  getClassification(appId: string) {
    return this.http.get<{ classification: ProductClassification | null }>(`${BASE}/applications/${appId}/classification`);
  }
  getClassificationSuggestions(productName: string) {
    return this.http.get<ClassificationSuggestion>(`${BASE}/admin/classification-suggestions`, { params: { productName } });
  }
  upsertClassification(appId: string, data: object) {
    return this.http.put<{ classification: ProductClassification }>(`${BASE}/admin/applications/${appId}/classification`, data);
  }

  // ── Assignments ───────────────────────────────────────────────────────────
  assignFirstAssessor(appId: string, data: object) {
    return this.http.post<{ assignment: AssessorAssignment }>(`${BASE}/admin/applications/${appId}/assignments/first-assessor`, data);
  }
  assignSecondAssessor(appId: string, data: object) {
    return this.http.post<{ assignment: AssessorAssignment }>(`${BASE}/admin/applications/${appId}/assignments/second-assessor`, data);
  }
  getAssignments(appId: string) {
    return this.http.get<{ assignments: AssessorAssignment[] }>(`${BASE}/applications/${appId}/assignments`);
  }
  reassignAssignment(assignmentId: string, data: object) {
    return this.http.patch(`${BASE}/admin/assignments/${assignmentId}/reassign`, data);
  }
  cancelAssignment(assignmentId: string) {
    return this.http.patch(`${BASE}/admin/assignments/${assignmentId}/cancel`, {});
  }

  // ── Assessor ──────────────────────────────────────────────────────────────
  getMyAssignments() {
    return this.http.get<{ assignments: AssessorAssignment[] }>(`${BASE}/assessor/assignments`);
  }
  startAssignment(assignmentId: string) {
    return this.http.post<{ assignment: AssessorAssignment }>(`${BASE}/assessor/assignments/${assignmentId}/start`, {});
  }
  uploadReport(assignmentId: string, formData: FormData) {
    return this.http.post<{ report: AssessorReport }>(`${BASE}/assessor/assignments/${assignmentId}/reports`, formData);
  }
  deleteReport(reportId: string) {
    return this.http.delete(`${BASE}/assessor/reports/${reportId}`);
  }
  submitComment(assignmentId: string, data: object) {
    return this.http.post<{ comment: AssessorComment }>(`${BASE}/assessor/assignments/${assignmentId}/comments`, data);
  }
  submitAssessment(assignmentId: string, action: 'submit' | 'revert') {
    return this.http.post<{ assignment: AssessorAssignment }>(`${BASE}/assessor/assignments/${assignmentId}/submit`, { action });
  }
  getApplicationReports(appId: string) {
    return this.http.get<{ reports: AssessorReport[] }>(`${BASE}/applications/${appId}/assessor-reports`);
  }
  getApplicationComments(appId: string) {
    return this.http.get<{ comments: AssessorComment[] }>(`${BASE}/applications/${appId}/assessor-comments`);
  }

  // ── Final Decision ────────────────────────────────────────────────────────
  getFinalDecision(appId: string) {
    return this.http.get<{ decision: object | null }>(`${BASE}/applications/${appId}/final-decision`);
  }
  recordFinalDecision(appId: string, data: object) {
    return this.http.post(`${BASE}/admin/applications/${appId}/final-decision`, data);
  }
  reopenApplication(appId: string, reason: string) {
    return this.http.post(`${BASE}/super-admin/applications/${appId}/reopen`, { reason });
  }

  // ── Notifications ─────────────────────────────────────────────────────────
  getNotifications() {
    return this.http.get<{ notifications: Notification[] }>(`${BASE}/notifications`);
  }
  markNotificationRead(id: string) {
    return this.http.patch(`${BASE}/notifications/${id}/read`, {});
  }
  markAllNotificationsRead() {
    return this.http.patch(`${BASE}/notifications/read-all`, {});
  }

  // ── Audit Logs ────────────────────────────────────────────────────────────
  getAuditLogs() {
    return this.http.get<{ auditLogs: AuditLog[] }>(`${BASE}/audit-logs`);
  }
  getApplicationTimeline(appId: string) {
    return this.http.get<{ timeline: AuditLog[] }>(`${BASE}/applications/${appId}/timeline`);
  }

  // ── Lookups ───────────────────────────────────────────────────────────────
  getLookups(type?: string, activeOnly = true) {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    params = params.set('activeOnly', String(activeOnly));
    return this.http.get<{ lookupItems: LookupItem[] }>(`${BASE}/lookups`, { params });
  }
  createLookup(data: object) {
    return this.http.post<{ lookup: LookupItem }>(`${BASE}/lookups`, data);
  }
  updateLookup(id: string, data: object) {
    return this.http.patch<{ lookup: LookupItem }>(`${BASE}/lookups/${id}`, data);
  }
  deactivateLookup(id: string) {
    return this.http.patch(`${BASE}/lookups/${id}/deactivate`, {});
  }
  importLookups(items: object[]) {
    return this.http.post(`${BASE}/lookups/import`, { items });
  }

  // ── Users ─────────────────────────────────────────────────────────────────
  getUsers() {
    return this.http.get<{ users: User[] }>(`${BASE}/users`);
  }
  createUser(data: object) {
    return this.http.post<{ user: User }>(`${BASE}/users`, data);
  }
  updateUser(id: string, data: object) {
    return this.http.patch<{ user: User }>(`${BASE}/users/${id}`, data);
  }
  deactivateUser(id: string) {
    return this.http.patch(`${BASE}/users/${id}/deactivate`, {});
  }
  reactivateUser(id: string) {
    return this.http.patch(`${BASE}/users/${id}/reactivate`, {});
  }
  deleteUser(id: string) {
    return this.http.delete(`${BASE}/users/${id}`);
  }
}
