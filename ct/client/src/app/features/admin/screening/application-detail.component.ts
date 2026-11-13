import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, type ClassificationSuggestion } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ReplaceUnderscorePipe } from '../../../shared/pipes/replace-underscore.pipe';
import { ChecklistComponent } from '../../applicant/checklist/checklist.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import type { Application, AssessorAssignment, AssessorComment, AssessorReport, AuditLog, ComplianceDirective, ProductClassification, User } from '../../../core/models';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, StatusBadgeComponent, PageHeaderComponent, ReplaceUnderscorePipe, ChecklistComponent, SpinnerComponent],
  template: `
    <app-spinner *ngIf="pageLoading" message="Loading application..." />

    <!-- Floating Issue CD button (admin/assessor, always visible when applicable) -->
    <ng-container *ngIf="!pageLoading && application && auth.isAdmin()">
      <button
        *ngIf="canIssueDirective"
        (click)="showCdPanel = true"
        class="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-orange-700 transition-colors">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
        Issue Compliance Directive
      </button>

      <!-- CD slide-in panel -->
      <div *ngIf="showCdPanel"
        class="fixed inset-0 z-50 flex justify-end"
        (click)="showCdPanel = false">
        <div class="relative w-full max-w-lg bg-white shadow-2xl h-full overflow-y-auto"
          (click)="$event.stopPropagation()">
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Issue Compliance Directive</h2>
            <button (click)="showCdPanel = false" class="text-gray-400 hover:text-gray-600">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="px-6 py-5">
            <form [formGroup]="directiveForm" (ngSubmit)="issueDirective()">

              <div class="mb-4">
                <label class="form-label">Title *</label>
                <input type="text" formControlName="title" class="form-input" placeholder="e.g. Incomplete bioanalytical information" />
              </div>

              <div class="mb-4">
                <label class="form-label">Directive Message *</label>
                <textarea formControlName="directiveMessage" class="form-input" rows="3"
                  placeholder="Describe the issues found..."></textarea>
              </div>

              <div class="mb-4">
                <label class="form-label">Required Corrections</label>
                <textarea formControlName="requiredCorrections" class="form-input" rows="2"
                  placeholder="List specific corrections required..."></textarea>
              </div>

              <div class="mb-5">
                <label class="form-label">Due Date</label>
                <input type="date" formControlName="dueDate" class="form-input" />
              </div>

              <!-- Affected sections -->
              <div class="mb-5">
                <label class="form-label">Affected Checklist Sections</label>
                <p class="text-xs text-gray-400 mb-3">Select all sections that require correction</p>
                <div class="space-y-1 max-h-72 overflow-y-auto border border-gray-200 rounded-md p-3">
                  <label *ngFor="let s of CHECKLIST_SECTIONS"
                    class="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 rounded px-1">
                    <input type="checkbox"
                      [checked]="selectedSections[s.key]"
                      (change)="toggleSection(s.key)"
                      class="h-4 w-4 rounded border-gray-300 text-orange-600" />
                    <span class="text-sm text-gray-700">{{ s.label }}</span>
                  </label>
                </div>
                <p *ngIf="selectedSectionLabels.length > 0" class="mt-2 text-xs text-orange-700">
                  {{ selectedSectionLabels.length }} section(s) selected
                </p>
              </div>

              <button type="submit" class="btn-primary w-full" [disabled]="directiveIssuing">
                {{ directiveIssuing ? 'Issuing...' : 'Issue Directive' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ng-container>

    <div *ngIf="!pageLoading && application">
      <app-page-header [title]="application.productName" [subtitle]="application.applicationNo" />

      <!-- Tabs -->
      <div class="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        <button *ngFor="let tab of visibleTabs"
          (click)="activeTab = tab.key"
          class="px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
          [class.border-primary-600]="activeTab === tab.key"
          [class.text-primary-700]="activeTab === tab.key"
          [class.border-transparent]="activeTab !== tab.key"
          [class.text-gray-500]="activeTab !== tab.key">
          {{ tab.label }}
          <span *ngIf="tab.key === 'directives' && openDirectiveCount > 0"
            class="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-orange-500 text-white text-xs">
            {{ openDirectiveCount }}
          </span>
        </button>
      </div>

      <!-- Overview -->
      <div *ngIf="activeTab === 'overview'" class="card space-y-4">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div><span class="text-gray-500">Application No.</span><p class="font-medium">{{ application.applicationNo }}</p></div>
          <div><span class="text-gray-500">Product</span><p class="font-medium">{{ application.productName }}</p></div>
          <div><span class="text-gray-500">Strength &amp; Form</span><p class="font-medium">{{ application.strengthAndDosageForm }}</p></div>
          <div><span class="text-gray-500">Status</span><div class="mt-1"><app-status-badge [status]="application.currentStatus" /></div></div>
          <div><span class="text-gray-500">Review Status</span><div class="mt-1"><app-status-badge [status]="application.reviewStatus" /></div></div>
          <div *ngIf="application.finalDecision"><span class="text-gray-500">Final Decision</span><div class="mt-1"><app-status-badge [status]="application.finalDecision!" /></div></div>
          <div><span class="text-gray-500">Submitted</span><p class="font-medium">{{ (application.submittedAt | date:'mediumDate') ?? '—' }}</p></div>
          <div *ngIf="application.resubmittedAt"><span class="text-gray-500">Resubmitted</span><p class="font-medium">{{ application.resubmittedAt | date:'mediumDate' }}</p></div>
          <div *ngIf="application.finalizedAt"><span class="text-gray-500">Finalized</span><p class="font-medium">{{ application.finalizedAt | date:'mediumDate' }}</p></div>
        </div>
        <div *ngIf="auth.isApplicant()" class="pt-3 border-t border-gray-100 flex flex-wrap gap-2">
          <button *ngIf="application.currentStatus === 'draft'" (click)="activeTab = 'checklist'" class="btn-primary">Continue Filling Checklist</button>
          <button *ngIf="application.currentStatus === 'compliance_directive_issued'" (click)="activeTab = 'directives'" class="btn-primary bg-orange-600 hover:bg-orange-700">View &amp; Respond to Directive</button>
        </div>
        <div *ngIf="application.finalDecision && application.finalDecisionNote"
          class="rounded-md p-4 text-sm"
          [class.bg-green-50]="application.finalDecision === 'Approved'"
          [class.bg-red-50]="application.finalDecision === 'Rejected'"
          [class.bg-orange-50]="application.finalDecision === 'CD'">
          <p class="font-semibold mb-1">Decision Note</p>
          <p>{{ application.finalDecisionNote }}</p>
          <p *ngIf="application.finalDecisionDate" class="text-xs text-gray-500 mt-2">Decided on {{ application.finalDecisionDate | date:'mediumDate' }}</p>
        </div>
      </div>

      <!-- Checklist (with inline screening actions for admin) -->
      <div *ngIf="activeTab === 'checklist'">

        <!-- Admin: not yet started screening -->
        <div *ngIf="auth.isAdmin() && (application.currentStatus === 'submitted' || application.currentStatus === 'resubmitted_after_compliance_directive')"
          class="mb-4 flex items-center justify-between gap-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <div>
            <p class="text-sm font-semibold text-blue-800">Ready for Screening</p>
            <p class="text-xs text-blue-600 mt-0.5">Review the checklist below, then start screening.</p>
          </div>
          <button (click)="startScreening()" class="btn-primary text-xs shrink-0" [disabled]="screeningLoading">
            {{ screeningLoading ? 'Starting...' : 'Start Screening' }}
          </button>
        </div>

        <!-- Admin: screening in progress -->
        <div *ngIf="auth.isAdmin() && application.currentStatus === 'under_admin_screening'"
          class="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
          <div class="flex items-center justify-between gap-4 mb-3">
            <div>
              <p class="text-sm font-semibold text-yellow-800">Screening in Progress</p>
              <p class="text-xs text-yellow-700 mt-0.5">Review the checklist. Issue a compliance directive if corrections are needed, or mark as satisfactory when done.</p>
            </div>
            <button (click)="markSatisfactory()" class="btn-primary text-xs shrink-0" [disabled]="screeningLoading">
              {{ screeningLoading ? 'Saving...' : 'Mark Satisfactory' }}
            </button>
          </div>
          <!-- Inline screening notes -->
          <form [formGroup]="noteForm" (ngSubmit)="addNote()" class="flex gap-2">
            <input type="text" formControlName="note" class="form-input flex-1 text-sm" placeholder="Add a screening note..." />
            <button type="submit" class="btn-secondary text-xs shrink-0" [disabled]="noteLoading">
              {{ noteLoading ? '...' : 'Add Note' }}
            </button>
          </form>
          <div *ngIf="notes.length > 0" class="mt-2 space-y-1">
            <div *ngFor="let n of notes" class="text-xs bg-white rounded px-3 py-1.5 text-gray-600">
              {{ n.note }} <span class="text-gray-400 ml-2">{{ n.createdAt | date:'short' }}</span>
            </div>
          </div>
        </div>

        <app-checklist [applicationStatus]="application.currentStatus" [appId]="application.id" />

        <!-- Screening CDs (admin) -->
        <ng-container *ngIf="auth.isAdmin() && !directivesLoading && screeningDirectives.length > 0">
          <div class="mt-6">
            <h3 class="font-semibold text-gray-800 mb-3">Compliance Directives from Screening</h3>
            <div class="space-y-3">
              <div *ngFor="let d of screeningDirectives" class="card">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <p class="font-semibold text-gray-800">{{ d.title }}</p>
                    <p class="text-xs text-gray-400">{{ d.directiveNumber }} · Issued {{ d.issuedAt | date:'mediumDate' }}</p>
                  </div>
                  <app-status-badge [status]="d.status" />
                </div>
                <p class="text-sm text-gray-700 mb-2">{{ d.directiveMessage }}</p>
                <div *ngIf="d.requiredCorrections" class="bg-orange-50 rounded p-3 text-sm text-orange-800 mb-2">
                  <strong>Required corrections:</strong> {{ d.requiredCorrections }}
                </div>
                <div *ngIf="d.affectedSections?.length" class="flex flex-wrap gap-1 mb-2">
                  <span *ngFor="let s of d.affectedSections" class="badge bg-gray-100 text-gray-600 text-xs">{{ s }}</span>
                </div>
                <div *ngIf="d.dueDate" class="text-xs text-gray-500 mb-2">Due: {{ d.dueDate | date:'mediumDate' }}</div>
                <div *ngIf="d.status === 'responded'" class="border-t pt-2 mt-2">
                  <button (click)="closeDirective(d.id)" class="btn-secondary text-xs" [disabled]="closingDirective[d.id]">
                    {{ closingDirective[d.id] ? 'Closing...' : 'Close Directive' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>

      <!-- Compliance Directives tab (applicant only) -->
      <div *ngIf="activeTab === 'directives'" class="space-y-4">
        <app-spinner *ngIf="directivesLoading" message="Loading directives..." />
        <ng-container *ngIf="!directivesLoading">
          <div *ngIf="directives.length === 0" class="card text-center text-gray-400 py-10">No compliance directives for this application.</div>
          <div *ngFor="let d of directives" class="card">
            <div class="flex justify-between items-start mb-3">
              <div>
                <p class="font-semibold text-gray-800">{{ d.title }}</p>
                <p class="text-xs text-gray-400">{{ d.directiveNumber }} · Issued {{ d.issuedAt | date:'mediumDate' }}</p>
              </div>
              <app-status-badge [status]="d.status" />
            </div>
            <p class="text-sm text-gray-700 mb-2">{{ d.directiveMessage }}</p>
            <div *ngIf="d.requiredCorrections" class="bg-orange-50 rounded p-3 text-sm text-orange-800 mb-3">
              <strong>Required corrections:</strong> {{ d.requiredCorrections }}
            </div>
            <div *ngIf="d.affectedSections?.length" class="flex flex-wrap gap-1 mb-2">
              <span *ngFor="let s of d.affectedSections" class="badge bg-gray-100 text-gray-600 text-xs">{{ s }}</span>
            </div>
            <div *ngIf="d.dueDate" class="text-xs text-gray-500 mb-3">Due: {{ d.dueDate | date:'mediumDate' }}</div>
            <div *ngIf="auth.isApplicant() && d.status === 'open'" class="border-t pt-4 mt-3">
              <p class="text-sm font-medium text-gray-700 mb-3">Submit your response</p>
              <form [formGroup]="getDirectiveResponseForm(d.id)" (ngSubmit)="respondToDirective(d.id)">
                <div class="mb-3">
                  <label class="form-label">Response message *</label>
                  <textarea formControlName="responseMessage" class="form-input" rows="3" placeholder="Describe the corrections made..."></textarea>
                </div>
                <p *ngIf="directiveErrors[d.id]" class="text-sm text-red-600 mb-2">{{ directiveErrors[d.id] }}</p>
                <button type="submit" class="btn-primary" [disabled]="directiveLoading[d.id]">
                  {{ directiveLoading[d.id] ? 'Submitting...' : 'Submit Response' }}
                </button>
              </form>
            </div>
          </div>
        </ng-container>
      </div>

      <!-- Classification -->
      <div *ngIf="activeTab === 'classification' && auth.isAdmin()" class="card">
        <h3 class="font-semibold text-gray-800 mb-4">Product Classification</h3>
        <div class="mb-5 rounded-md border border-gray-200 bg-gray-50 p-4">
          <label class="form-label">Search Product in NTI and BCS Lists</label>
          <div class="flex flex-col gap-3 md:flex-row">
            <input type="search" [(ngModel)]="classificationSearch" [ngModelOptions]="{standalone:true}" class="form-input" placeholder="Type product name" />
            <button type="button" class="btn-secondary md:w-40" [disabled]="classificationSearchLoading || classificationSearch.trim().length < 2" (click)="searchClassification()">
              {{ classificationSearchLoading ? 'Searching...' : 'Search' }}
            </button>
          </div>
          <p *ngIf="classificationSearchError" class="mt-3 text-sm text-red-600">{{ classificationSearchError }}</p>
          <div *ngIf="classificationSuggestion" class="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
            <div class="rounded-md border border-gray-200 bg-white p-3">
              <span class="text-gray-500">NTI Status</span>
              <p class="font-semibold text-gray-800">{{ classificationSuggestion.therapeuticIndexClass }}</p>
              <p class="text-xs text-gray-500">{{ classificationSuggestion.matchedNtiProduct || 'No NTI match found' }}</p>
            </div>
            <div class="rounded-md border border-gray-200 bg-white p-3">
              <span class="text-gray-500">BCS Class</span>
              <p class="font-semibold text-gray-800">{{ classificationSuggestion.bcsClass }}</p>
              <p class="text-xs text-gray-500">{{ classificationSuggestion.matchedBcsProduct || 'No BCS match found' }}</p>
            </div>
            <div class="rounded-md border border-gray-200 bg-white p-3">
              <span class="text-gray-500">Workbook Value</span>
              <p class="font-semibold text-gray-800">{{ classificationSuggestion.rawBcsClass || 'None' }}</p>
              <button type="button" class="btn-primary mt-2 text-xs" (click)="applyClassificationSuggestion()">Apply Suggestion</button>
            </div>
          </div>
        </div>
        <form [formGroup]="classificationForm" (ngSubmit)="saveClassification()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label class="form-label">Therapeutic Index Class</label>
              <select formControlName="therapeuticIndexClass" class="form-input">
                <option value="">Select...</option>
                <option *ngFor="let c of ['NTI','Non-NTI','Mixed','Unknown']" [value]="c">{{ c }}</option>
              </select>
            </div>
            <div><label class="form-label">BCS Class</label>
              <select formControlName="bcsClass" class="form-input">
                <option value="">Select...</option>
                <option *ngFor="let c of ['Class I','Class II','Class III','Class IV','Unknown','Not Applicable']" [value]="c">{{ c }}</option>
              </select>
            </div>
            <div><label class="form-label">Pharmacological Class</label><input type="text" formControlName="pharmacologicalClass" class="form-input" /></div>
            <div><label class="form-label">Local / Foreign</label>
              <select formControlName="localOrForeign" class="form-input">
                <option value="">Select...</option>
                <option value="Local">Local</option>
                <option value="Foreign">Foreign</option>
              </select>
            </div>
          </div>
          <button type="submit" class="btn-primary mt-4" [disabled]="classificationSaving">
            {{ classificationSaving ? 'Saving...' : 'Save Classification' }}
          </button>
          <span *ngIf="classificationSaved" class="ml-3 text-sm text-green-600">Saved ✓</span>
        </form>
      </div>

      <!-- Assignments -->
      <div *ngIf="activeTab === 'assignments' && auth.isAdmin()" class="space-y-4">
        <div class="card">
          <div class="flex flex-col gap-1 mb-4">
            <h3 class="font-semibold text-gray-800">Assign Assessor</h3>
            <p class="text-sm text-gray-500">Choose from active assessor users. Current workload is shown beside each name.</p>
          </div>
          <div *ngIf="!canAssignFirst && !canAssignSecond" class="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ assignmentBlockedMessage }}</div>
          <form [formGroup]="assignForm" (ngSubmit)="assignAssessor()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div><label class="form-label">Assessment Stage *</label>
                <select formControlName="assessmentStage" class="form-input">
                  <option value="first_assessment" [disabled]="!canAssignFirst">First Assessor</option>
                  <option value="second_assessment" [disabled]="!canAssignSecond">Second Assessor</option>
                </select>
              </div>
              <div><label class="form-label">Due Date</label><input type="date" formControlName="dueDate" class="form-input" /></div>
              <div class="md:col-span-2"><label class="form-label">Note</label><input type="text" formControlName="assignmentNote" class="form-input" /></div>
              <div *ngIf="assignForm.value.assessmentStage === 'second_assessment'" class="md:col-span-2">
                <label class="form-label">Reason for second assessment</label>
                <input type="text" formControlName="reasonForSecondAssessment" class="form-input" />
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label">Find Assessor *</label>
              <input type="search" [(ngModel)]="assessorSearch" [ngModelOptions]="{standalone:true}" class="form-input" placeholder="Search by name or email" />
            </div>
            <app-spinner *ngIf="assessorsLoading" message="Loading assessors..." />
            <div *ngIf="!assessorsLoading" class="max-h-72 overflow-y-auto rounded-md border border-gray-200 divide-y divide-gray-100 mb-4">
              <button *ngFor="let assessor of filteredAssessors" type="button" (click)="selectAssessor(assessor)"
                class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                [class.bg-primary-50]="assignForm.value.assessorUserId === assessor.id">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-sm font-medium text-gray-800">{{ assessor.fullName }}</p>
                    <p class="text-xs text-gray-500">{{ assessor.email }}</p>
                  </div>
                  <span class="badge bg-gray-100 text-gray-700">{{ assessor.activeAssignmentCount ?? 0 }} active</span>
                </div>
              </button>
              <div *ngIf="filteredAssessors.length === 0" class="px-4 py-8 text-center text-sm text-gray-400">No active assessors found.</div>
            </div>
            <div *ngIf="selectedAssessor" class="mb-4 rounded-md bg-primary-50 px-4 py-3 text-sm text-primary-900">
              Selected: <span class="font-medium">{{ selectedAssessor.fullName }}</span>
            </div>
            <button type="submit" class="btn-primary" [disabled]="!canSubmitAssignment || assignLoading">
              {{ assignLoading ? 'Assigning...' : 'Assign ' + (assignForm.value.assessmentStage === 'second_assessment' ? 'Second' : 'First') + ' Assessor' }}
            </button>
            <span *ngIf="assignSuccess" class="ml-3 text-sm text-green-600">Assigned ✓</span>
          </form>
        </div>
        <app-spinner *ngIf="assignmentsLoading" message="Loading assignments..." />
        <div *ngIf="!assignmentsLoading" class="space-y-3">
          <div *ngFor="let a of assignments" class="card flex justify-between items-center">
            <div>
              <p class="text-sm font-medium text-gray-800 capitalize">{{ a.assessmentStage | replaceUnderscore }}</p>
              <p class="text-xs text-gray-500">{{ assessorName(a.assessorUserId) }} · Assigned {{ a.assignedAt | date:'mediumDate' }}</p>
            </div>
            <app-status-badge [status]="a.status" />
          </div>
        </div>
      </div>

      <!-- Assessor Reports -->
      <div *ngIf="activeTab === 'reports'">
        <app-spinner *ngIf="reportsLoading" message="Loading reports..." />
        <div *ngIf="!reportsLoading" class="space-y-6">

          <!-- First Assessment -->
          <div>
            <h3 class="font-semibold text-gray-700 mb-3">First Assessment</h3>
            <div class="space-y-3">
              <div *ngFor="let r of firstAssessmentReports" class="card flex justify-between items-center">
                <div>
                  <p class="font-medium text-gray-800">{{ r.reportTitle }}</p>
                  <p class="text-xs text-gray-500">Uploaded {{ r.uploadedAt | date:'mediumDate' }}</p>
                </div>
                <a [href]="r.fileUrl" target="_blank" class="btn-secondary text-xs">Download</a>
              </div>
              <div *ngFor="let c of firstAssessmentComments" class="card">
                <div class="flex items-start justify-between mb-2">
                  <p class="text-xs text-gray-400">{{ c.submittedAt | date:'mediumDate' }}</p>
                  <span class="badge"
                    [class.bg-green-100]="c.recommendation === 'recommend_approval'"
                    [class.text-green-700]="c.recommendation === 'recommend_approval'"
                    [class.bg-orange-100]="c.recommendation === 'recommend_compliance_directive'"
                    [class.text-orange-700]="c.recommendation === 'recommend_compliance_directive'"
                    [class.bg-red-100]="c.recommendation === 'recommend_rejection'"
                    [class.text-red-700]="c.recommendation === 'recommend_rejection'"
                    [class.bg-gray-100]="!['recommend_approval','recommend_compliance_directive','recommend_rejection'].includes(c.recommendation)"
                    [class.text-gray-700]="!['recommend_approval','recommend_compliance_directive','recommend_rejection'].includes(c.recommendation)">
                    {{ c.recommendation | replaceUnderscore }}
                  </span>
                </div>
                <p class="text-sm text-gray-700">{{ c.comment }}</p>
              </div>
              <div *ngIf="firstAssessmentReports.length === 0 && firstAssessmentComments.length === 0"
                class="card text-center text-gray-400 py-6">No first assessment reports yet.</div>
            </div>

            <!-- First assessment CDs -->
            <div *ngIf="firstAssessmentDirectives.length > 0" class="mt-4">
              <h4 class="text-sm font-semibold text-gray-600 mb-2">Compliance Directives from First Assessment</h4>
              <div class="space-y-3">
                <div *ngFor="let d of firstAssessmentDirectives" class="card border-l-4 border-l-orange-400">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <p class="font-semibold text-gray-800">{{ d.title }}</p>
                      <p class="text-xs text-gray-400">{{ d.directiveNumber }} · {{ d.issuedAt | date:'mediumDate' }}</p>
                    </div>
                    <app-status-badge [status]="d.status" />
                  </div>
                  <p class="text-sm text-gray-700 mb-2">{{ d.directiveMessage }}</p>
                  <div *ngIf="d.requiredCorrections" class="bg-orange-50 rounded p-2 text-sm text-orange-800 mb-2">
                    <strong>Required corrections:</strong> {{ d.requiredCorrections }}
                  </div>
                  <div *ngIf="d.affectedSections?.length" class="flex flex-wrap gap-1 mb-2">
                    <span *ngFor="let s of d.affectedSections" class="badge bg-gray-100 text-gray-600 text-xs">{{ s }}</span>
                  </div>
                  <div *ngIf="d.status === 'responded'" class="border-t pt-2 mt-2">
                    <button (click)="closeDirective(d.id)" class="btn-secondary text-xs" [disabled]="closingDirective[d.id]">
                      {{ closingDirective[d.id] ? 'Closing...' : 'Close Directive' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Second Assessment -->
          <div *ngIf="secondAssessmentReports.length > 0 || secondAssessmentComments.length > 0 || secondAssessmentDirectives.length > 0">
            <h3 class="font-semibold text-gray-700 mb-3">Second Assessment</h3>
            <div class="space-y-3">
              <div *ngFor="let r of secondAssessmentReports" class="card flex justify-between items-center">
                <div>
                  <p class="font-medium text-gray-800">{{ r.reportTitle }}</p>
                  <p class="text-xs text-gray-500">Uploaded {{ r.uploadedAt | date:'mediumDate' }}</p>
                </div>
                <a [href]="r.fileUrl" target="_blank" class="btn-secondary text-xs">Download</a>
              </div>
              <div *ngFor="let c of secondAssessmentComments" class="card">
                <div class="flex items-start justify-between mb-2">
                  <p class="text-xs text-gray-400">{{ c.submittedAt | date:'mediumDate' }}</p>
                  <span class="badge"
                    [class.bg-green-100]="c.recommendation === 'recommend_approval'"
                    [class.text-green-700]="c.recommendation === 'recommend_approval'"
                    [class.bg-orange-100]="c.recommendation === 'recommend_compliance_directive'"
                    [class.text-orange-700]="c.recommendation === 'recommend_compliance_directive'"
                    [class.bg-red-100]="c.recommendation === 'recommend_rejection'"
                    [class.text-red-700]="c.recommendation === 'recommend_rejection'"
                    [class.bg-gray-100]="!['recommend_approval','recommend_compliance_directive','recommend_rejection'].includes(c.recommendation)"
                    [class.text-gray-700]="!['recommend_approval','recommend_compliance_directive','recommend_rejection'].includes(c.recommendation)">
                    {{ c.recommendation | replaceUnderscore }}
                  </span>
                </div>
                <p class="text-sm text-gray-700">{{ c.comment }}</p>
              </div>
            </div>

            <!-- Second assessment CDs -->
            <div *ngIf="secondAssessmentDirectives.length > 0" class="mt-4">
              <h4 class="text-sm font-semibold text-gray-600 mb-2">Compliance Directives from Second Assessment</h4>
              <div class="space-y-3">
                <div *ngFor="let d of secondAssessmentDirectives" class="card border-l-4 border-l-orange-400">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <p class="font-semibold text-gray-800">{{ d.title }}</p>
                      <p class="text-xs text-gray-400">{{ d.directiveNumber }} · {{ d.issuedAt | date:'mediumDate' }}</p>
                    </div>
                    <app-status-badge [status]="d.status" />
                  </div>
                  <p class="text-sm text-gray-700 mb-2">{{ d.directiveMessage }}</p>
                  <div *ngIf="d.requiredCorrections" class="bg-orange-50 rounded p-2 text-sm text-orange-800 mb-2">
                    <strong>Required corrections:</strong> {{ d.requiredCorrections }}
                  </div>
                  <div *ngIf="d.affectedSections?.length" class="flex flex-wrap gap-1 mb-2">
                    <span *ngFor="let s of d.affectedSections" class="badge bg-gray-100 text-gray-600 text-xs">{{ s }}</span>
                  </div>
                  <div *ngIf="d.status === 'responded'" class="border-t pt-2 mt-2">
                    <button (click)="closeDirective(d.id)" class="btn-secondary text-xs" [disabled]="closingDirective[d.id]">
                      {{ closingDirective[d.id] ? 'Closing...' : 'Close Directive' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Final Decision -->
      <div *ngIf="activeTab === 'decision' && auth.isAdmin()" class="card">
        <h3 class="font-semibold text-gray-800 mb-4">Final Decision</h3>
        <div *ngIf="application.finalDecision" class="mb-4">
          <app-status-badge [status]="application.finalDecision" />
          <p class="text-sm text-gray-600 mt-2">{{ application.finalDecisionNote }}</p>
        </div>
        <form *ngIf="!application.finalDecision" [formGroup]="decisionForm" (ngSubmit)="recordDecision()">
          <div class="mb-3"><label class="form-label">Decision *</label>
            <select formControlName="decision" class="form-input">
              <option value="">Select...</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="CD">CD</option>
            </select>
          </div>
          <div class="mb-3"><label class="form-label">Note</label><textarea formControlName="decisionNote" class="form-input" rows="2"></textarea></div>
          <button type="submit" class="btn-primary" [disabled]="decisionLoading">
            {{ decisionLoading ? 'Recording...' : 'Record Decision' }}
          </button>
        </form>
        <button *ngIf="application.currentStatus === 'finalized' && auth.isSuperAdmin()" (click)="reopen()" class="btn-danger mt-4" [disabled]="reopenLoading">
          {{ reopenLoading ? 'Reopening...' : 'Reopen Application' }}
        </button>
      </div>

      <!-- Timeline -->
      <div *ngIf="activeTab === 'timeline'">
        <app-spinner *ngIf="timelineLoading" message="Loading timeline..." />
        <div *ngIf="!timelineLoading" class="space-y-2">
          <div *ngFor="let log of timeline" class="flex gap-3 text-sm">
            <div class="w-32 text-xs text-gray-400 pt-0.5 shrink-0">{{ log.createdAt | date:'short' }}</div>
            <div class="flex-1 bg-white border border-gray-100 rounded p-3">
              <p class="font-medium text-gray-700">{{ log.action | replaceUnderscore }}</p>
              <p *ngIf="log.entityType" class="text-xs text-gray-400">{{ log.entityType }}</p>
            </div>
          </div>
          <div *ngIf="timeline.length === 0" class="card text-center text-gray-400 py-8">No timeline events.</div>
        </div>
      </div>
    </div>

    <div *ngIf="!pageLoading && !application" class="card text-center py-16">
      <p class="text-gray-500">Application not found or you do not have access.</p>
    </div>
  `,
})
export class ApplicationDetailComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  application: Application | null = null;
  pageLoading = true;
  activeTab = 'overview';

  directives: ComplianceDirective[] = [];
  directivesLoading = true;
  directiveIssuing = false;
  closingDirective: Record<string, boolean> = {};
  directiveErrors: Record<string, string> = {};
  directiveLoading: Record<string, boolean> = {};
  directiveForms: Record<string, ReturnType<FormBuilder['group']>> = {};

  assignments: AssessorAssignment[] = [];
  assignmentsLoading = true;
  assignLoading = false;
  assignSuccess = false;

  assessors: User[] = [];
  assessorsLoading = true;
  assessorSearch = '';

  reports: AssessorReport[] = [];
  reportsLoading = true;
  comments: AssessorComment[] = [];

  classification: ProductClassification | null = null;
  classificationSearch = '';
  classificationSearchLoading = false;
  classificationSearchError = '';
  classificationSuggestion: ClassificationSuggestion | null = null;
  classificationSaving = false;
  classificationSaved = false;

  timeline: AuditLog[] = [];
  timelineLoading = true;

  notes: any[] = [];
  notesLoading = true;
  noteLoading = false;
  screeningLoading = false;
  decisionLoading = false;
  reopenLoading = false;

  // CD panel
  showCdPanel = false;

  readonly CHECKLIST_SECTIONS = [
    { key: 'general_instructions', label: 'General Instructions' },
    { key: 'certification', label: 'Certification' },
    { key: 'a1', label: 'A.1 — Study number / protocol number' },
    { key: 'a2', label: 'A.2 — Study title' },
    { key: 'a3', label: 'A.3 — Clinical study periods' },
    { key: 'a4', label: 'A.4 — Bioanalytical study dates' },
    { key: 'a5', label: 'A.5 — Clinical study facility' },
    { key: 'a6', label: 'A.6 — Bioanalytical facility' },
    { key: 'a7', label: 'A.7 — Ethics committee / IRB' },
    { key: 'a8', label: 'A.8 — Test product information' },
    { key: 'a9', label: 'A.9 — Reference product information' },
    { key: 'a10', label: 'A.10 — Summary results' },
    { key: 'b1',  label: 'B.1 — COA of BE test product' },
    { key: 'b2',  label: 'B.2 — COA of reference product' },
    { key: 'b3',  label: 'B.3 — Outer packaging / SmPC of reference product' },
    { key: 'b4',  label: 'B.4 — Dissolution study report (test vs reference)' },
    { key: 'b5',  label: 'B.5 — Bridging data / WHO comparator justification' },
    { key: 'b6',  label: 'B.6 — Biowaiver of additional strength' },
    { key: 'b7',  label: 'B.7 — Clinical study report' },
    { key: 'b8',  label: 'B.8 — PK and statistical analysis report' },
    { key: 'b9',  label: 'B.9 — Bioanalytical method validation report' },
    { key: 'b10', label: 'B.10 — Bioanalytical study report' },
    { key: 'b11', label: 'B.11 — Quality assurance statement' },
    { key: 'b12', label: 'B.12 — IRB/IEC approval letter' },
    { key: 'b13', label: 'B.13 — IEC-approved study protocol' },
    { key: 'b14', label: 'B.14 — Informed consent form' },
    { key: 'b15', label: 'B.15 — BTIF (MS Word and PDF)' },
    { key: 'b16', label: 'B.16 — Literature references' },
  ];

  selectedSections: Record<string, boolean> = {};

  toggleSection(key: string) {
    this.selectedSections[key] = !this.selectedSections[key];
  }

  get selectedSectionLabels(): string[] {
    return this.CHECKLIST_SECTIONS
      .filter((s) => this.selectedSections[s.key])
      .map((s) => s.label);
  }

  noteForm = this.fb.group({ note: ['', Validators.required] });
  directiveForm = this.fb.group({ title: ['', Validators.required], directiveMessage: ['', Validators.required], requiredCorrections: [''], dueDate: [''] });
  classificationForm = this.fb.group({ therapeuticIndexClass: [''], bcsClass: [''], pharmacologicalClass: [''], localOrForeign: [''] });
  assignForm = this.fb.group({ assessmentStage: ['first_assessment', Validators.required], assessorUserId: ['', Validators.required], dueDate: [''], assignmentNote: [''], reasonForSecondAssessment: [''] });
  decisionForm = this.fb.group({ decision: ['', Validators.required], decisionNote: [''] });

  get firstAssessmentReports() { return this.reports.filter((r) => r.assessmentStage === 'first_assessment'); }
  get secondAssessmentReports() { return this.reports.filter((r) => r.assessmentStage === 'second_assessment'); }
  get firstAssessmentComments() { return this.comments.filter((c) => c.assessmentStage === 'first_assessment'); }
  get secondAssessmentComments() { return this.comments.filter((c) => c.assessmentStage === 'second_assessment'); }

  get openDirectiveCount() { return this.directives.filter((d) => d.status === 'open').length; }

  // Screening CDs: issued before any assessor was assigned
  get screeningDirectives() {
    const assessmentStatuses = [
      'assigned_first_assessor','first_assessment_ongoing','first_assessment_reverted',
      'assigned_second_assessor','second_assessment_ongoing','second_assessment_reverted',
      'awaiting_final_decision','finalized',
    ];
    // If we have timeline events, use them; otherwise show all CDs during screening statuses
    // Simple heuristic: first half of CDs are screening, rest are assessment
    // Better: tag by application status at time of issue — we use issuedAt vs assignment dates
    const firstAssignment = this.assignments.find((a) => a.assessmentStage === 'first_assessment');
    if (!firstAssignment) return this.directives;
    return this.directives.filter((d) => new Date(d.issuedAt) < new Date(firstAssignment.assignedAt));
  }

  // First assessment CDs
  get firstAssessmentDirectives() {
    const first = this.assignments.find((a) => a.assessmentStage === 'first_assessment');
    const second = this.assignments.find((a) => a.assessmentStage === 'second_assessment');
    if (!first) return [];
    return this.directives.filter((d) => {
      const t = new Date(d.issuedAt).getTime();
      const after = t >= new Date(first.assignedAt).getTime();
      const before = second ? t < new Date(second.assignedAt).getTime() : true;
      return after && before;
    });
  }

  // Second assessment CDs
  get secondAssessmentDirectives() {
    const second = this.assignments.find((a) => a.assessmentStage === 'second_assessment');
    if (!second) return [];
    return this.directives.filter((d) => new Date(d.issuedAt) >= new Date(second.assignedAt));
  }

  get canIssueDirective() {
    return [
      'under_admin_screening',
      'resubmitted_after_compliance_directive',
      'first_assessment_ongoing',
      'first_assessment_reverted',
      'second_assessment_ongoing',
      'second_assessment_reverted',
      'awaiting_final_decision',
    ].includes(this.application?.currentStatus ?? '');
  }
  get hasFirstAssignment() { return this.assignments.some((a) => a.assessmentStage === 'first_assessment' && a.status !== 'cancelled'); }
  get hasSecondAssignment() { return this.assignments.some((a) => a.assessmentStage === 'second_assessment' && a.status !== 'cancelled'); }
  get canAssignFirst() { return this.application?.currentStatus === 'classified' && !this.hasFirstAssignment; }
  get canAssignSecond() { return this.application?.currentStatus === 'first_assessment_reverted' && !this.hasSecondAssignment; }

  get assignmentBlockedMessage() {
    if (!this.application) return 'Load an application before assigning assessors.';
    if (!['classified', 'first_assessment_reverted'].includes(this.application.currentStatus))
      return 'Assessors can be assigned after classification, or after a first assessment is reverted.';
    if (this.hasFirstAssignment && this.application.currentStatus === 'classified')
      return 'A first assessor has already been assigned.';
    if (this.hasSecondAssignment && this.application.currentStatus === 'first_assessment_reverted')
      return 'A second assessor has already been assigned.';
    return 'Assessor assignment is not available for this application state.';
  }

  get selectedAssessor() { return this.assessors.find((a) => a.id === this.assignForm.value.assessorUserId) ?? null; }

  get filteredAssessors() {
    const q = this.assessorSearch.trim().toLowerCase();
    const rows = q ? this.assessors.filter((a) => `${a.fullName} ${a.email}`.toLowerCase().includes(q)) : this.assessors;
    return [...rows].sort((a, b) => (a.activeAssignmentCount ?? 0) - (b.activeAssignmentCount ?? 0) || a.fullName.localeCompare(b.fullName));
  }

  get canSubmitAssignment() {
    const stage = this.assignForm.value.assessmentStage;
    return this.assignForm.valid && (stage === 'second_assessment' ? this.canAssignSecond : this.canAssignFirst);
  }

  get visibleTabs() {
    const role = this.auth.role();
    const all = [
      { key: 'overview',        label: 'Overview',              roles: ['applicant', 'assessor', 'admin', 'super_admin'] },
      { key: 'checklist',       label: this.auth.isAdmin() ? 'Screening' : 'Checklist',  roles: ['applicant', 'assessor', 'admin', 'super_admin'] },
      { key: 'directives',      label: 'Compliance Directives', roles: ['applicant'] },
      { key: 'classification',  label: 'Classification',        roles: ['admin', 'super_admin'] },
      { key: 'assignments',     label: 'Assignments',           roles: ['admin', 'super_admin'] },
      { key: 'reports',         label: 'Assessor Reports',      roles: ['assessor', 'admin', 'super_admin'] },
      { key: 'decision',        label: 'Final Decision',        roles: ['admin', 'super_admin'] },
      { key: 'timeline',        label: 'Timeline',              roles: ['admin', 'super_admin'] },
    ];
    return all.filter((t) => role && t.roles.includes(role));
  }

  ngOnInit() {
    const appId = this.route.snapshot.paramMap.get('applicationId')!;
    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    if (tabParam) this.activeTab = tabParam;

    this.api.getApplication(appId).subscribe({
      next: ({ application }) => {
        this.application = application;
        this.pageLoading = false;
        this.classificationSearch = application.productName;

        this.api.getDirectives(appId).subscribe(({ directives }) => {
          this.directives = directives;
          this.directivesLoading = false;
          directives.forEach((d) => { this.directiveForms[d.id] = this.fb.group({ responseMessage: ['', Validators.required] }); });
        });

        this.api.getAssignments(appId).subscribe(({ assignments }) => {
          this.assignments = assignments;
          this.assignmentsLoading = false;
          this.syncAssignmentStage();
        });

        this.api.getApplicationReports(appId).subscribe(({ reports }) => { this.reports = reports; this.reportsLoading = false; });
        this.api.getApplicationComments(appId).subscribe(({ comments }) => (this.comments = comments));
        this.api.getApplicationTimeline(appId).subscribe(({ timeline }) => { this.timeline = timeline; this.timelineLoading = false; });

        if (this.auth.isAdmin()) {
          this.api.getAssessors().subscribe(({ assessors }) => { this.assessors = assessors; this.assessorsLoading = false; });
          this.api.getClassification(appId).subscribe(({ classification }) => { if (classification) this.classificationForm.patchValue(classification as any); });
          this.api.getInternalNotes(appId).subscribe(({ notes }) => { this.notes = notes; this.notesLoading = false; });
        }
      },
      error: () => (this.pageLoading = false),
    });
  }

  getDirectiveResponseForm(id: string) {
    if (!this.directiveForms[id]) this.directiveForms[id] = this.fb.group({ responseMessage: ['', Validators.required] });
    return this.directiveForms[id];
  }

  respondToDirective(directiveId: string) {
    const form = this.directiveForms[directiveId];
    if (!form || form.invalid) { form?.markAllAsTouched(); return; }
    this.directiveLoading[directiveId] = true;
    this.directiveErrors[directiveId] = '';
    this.api.respondToDirective(directiveId, form.value).subscribe({
      next: () => {
        const d = this.directives.find((x) => x.id === directiveId);
        if (d) d.status = 'responded';
        this.directiveLoading[directiveId] = false;
        this.api.getApplication(this.application!.id).subscribe(({ application }) => (this.application = application));
      },
      error: (e) => { this.directiveErrors[directiveId] = e.error?.message ?? 'Failed'; this.directiveLoading[directiveId] = false; },
    });
  }

  startScreening() {
    this.screeningLoading = true;
    this.api.startScreening(this.application!.id).subscribe({
      next: ({ application }) => { this.application = application; this.screeningLoading = false; },
      error: () => (this.screeningLoading = false),
    });
  }

  markSatisfactory() {
    this.screeningLoading = true;
    this.api.markScreeningSatisfactory(this.application!.id).subscribe({
      next: ({ application }) => { this.application = application; this.screeningLoading = false; },
      error: () => (this.screeningLoading = false),
    });
  }

  addNote() {
    if (this.noteForm.invalid) return;
    this.noteLoading = true;
    this.api.addScreeningNote(this.application!.id, this.noteForm.value.note!).subscribe({
      next: () => { this.notes.push({ note: this.noteForm.value.note, createdAt: new Date().toISOString() }); this.noteForm.reset(); this.noteLoading = false; },
      error: () => (this.noteLoading = false),
    });
  }

  issueDirective() {
    if (this.directiveForm.invalid) { this.directiveForm.markAllAsTouched(); return; }
    this.directiveIssuing = true;
    const payload = {
      ...this.directiveForm.value,
      affectedSections: this.selectedSectionLabels,
    };
    this.api.issueDirective(this.application!.id, payload).subscribe({
      next: ({ directive }) => {
        this.directives.push(directive);
        this.directiveForms[directive.id] = this.fb.group({ responseMessage: ['', Validators.required] });
        this.directiveForm.reset();
        this.selectedSections = {};
        this.application!.currentStatus = 'compliance_directive_issued';
        this.directiveIssuing = false;
        this.showCdPanel = false;
      },
      error: () => (this.directiveIssuing = false),
    });
  }

  closeDirective(id: string) {
    this.closingDirective[id] = true;
    this.api.closeDirective(id).subscribe({
      next: () => { const d = this.directives.find((x) => x.id === id); if (d) d.status = 'closed'; this.closingDirective[id] = false; },
      error: () => (this.closingDirective[id] = false),
    });
  }

  saveClassification() {
    this.classificationSaving = true;
    this.api.upsertClassification(this.application!.id, this.classificationForm.value).subscribe({
      next: () => { this.classificationSaving = false; this.classificationSaved = true; setTimeout(() => (this.classificationSaved = false), 3000); },
      error: () => (this.classificationSaving = false),
    });
  }

  searchClassification() {
    const name = this.classificationSearch.trim();
    if (name.length < 2) return;
    this.classificationSearchLoading = true;
    this.classificationSearchError = '';
    this.api.getClassificationSuggestions(name).subscribe({
      next: (s) => { this.classificationSuggestion = s; this.classificationSearchLoading = false; },
      error: () => { this.classificationSuggestion = null; this.classificationSearchError = 'Could not search.'; this.classificationSearchLoading = false; },
    });
  }

  applyClassificationSuggestion() {
    if (!this.classificationSuggestion) return;
    const notes = [
      this.classificationSuggestion.matchedNtiProduct ? `NTI match: ${this.classificationSuggestion.matchedNtiProduct}` : 'NTI match: none',
      this.classificationSuggestion.matchedBcsProduct ? `BCS match: ${this.classificationSuggestion.matchedBcsProduct}` : 'BCS match: none',
      this.classificationSuggestion.rawBcsClass ? `Raw BCS: ${this.classificationSuggestion.rawBcsClass}` : '',
    ].filter(Boolean);
    this.classificationForm.patchValue({
      therapeuticIndexClass: this.classificationSuggestion.therapeuticIndexClass,
      bcsClass: this.classificationSuggestion.bcsClass,
    });
  }

  assignAssessor() {
    if (this.assignForm.invalid) { this.assignForm.markAllAsTouched(); return; }
    this.assignLoading = true;
    this.assignSuccess = false;
    const isFirst = this.assignForm.value.assessmentStage !== 'second_assessment';
    const payload = { assessorUserId: this.assignForm.value.assessorUserId, dueDate: this.assignForm.value.dueDate || undefined, assignmentNote: this.assignForm.value.assignmentNote || undefined, reasonForSecondAssessment: this.assignForm.value.reasonForSecondAssessment || undefined };
    const call = isFirst ? this.api.assignFirstAssessor(this.application!.id, payload) : this.api.assignSecondAssessor(this.application!.id, payload);
    call.subscribe({
      next: ({ assignment }) => {
        this.assignments.push(assignment);
        this.application!.currentStatus = isFirst ? 'assigned_first_assessor' : 'assigned_second_assessor';
        this.assignForm.reset({ assessmentStage: 'first_assessment', assessorUserId: '', dueDate: '', assignmentNote: '', reasonForSecondAssessment: '' });
        this.assessorSearch = '';
        this.assignLoading = false;
        this.assignSuccess = true;
        setTimeout(() => (this.assignSuccess = false), 3000);
        this.api.getAssessors().subscribe(({ assessors }) => (this.assessors = assessors));
      },
      error: () => (this.assignLoading = false),
    });
  }

  selectAssessor(assessor: User) { this.assignForm.patchValue({ assessorUserId: assessor.id }); }
  assessorName(id: string) { return this.assessors.find((a) => a.id === id)?.fullName ?? id; }

  private syncAssignmentStage() {
    if (this.canAssignSecond) { this.assignForm.patchValue({ assessmentStage: 'second_assessment' }); return; }
    if (this.canAssignFirst) { this.assignForm.patchValue({ assessmentStage: 'first_assessment' }); }
  }

  recordDecision() {
    if (this.decisionForm.invalid) { this.decisionForm.markAllAsTouched(); return; }
    this.decisionLoading = true;
    this.api.recordFinalDecision(this.application!.id, this.decisionForm.value).subscribe({
      next: () => { this.application!.finalDecision = this.decisionForm.value.decision as any; this.application!.currentStatus = 'finalized'; this.decisionLoading = false; },
      error: () => (this.decisionLoading = false),
    });
  }

  reopen() {
    const reason = prompt('Reason for reopening:');
    if (!reason) return;
    this.reopenLoading = true;
    this.api.reopenApplication(this.application!.id, reason).subscribe({
      next: (res: any) => { this.application = res.application; this.reopenLoading = false; },
      error: () => (this.reopenLoading = false),
    });
  }
}
