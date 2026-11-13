import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { ChecklistComponent } from '../../applicant/checklist/checklist.component';
import type { AssessorAssignment, AssessorReport } from '../../../core/models';

@Component({
  selector: 'app-assessor-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PageHeaderComponent, StatusBadgeComponent, FileUploadComponent, ChecklistComponent],
  template: `
    <app-page-header
      title="Assessment Review"
      [subtitle]="assignment ? (assignment.assessmentStage === 'first_assessment' ? 'First Assessment' : 'Second Assessment') : ''" />

    <div *ngIf="assignment" class="space-y-6">

      <!-- Status card -->
      <div class="card flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500 mb-1">Assignment Status</p>
          <app-status-badge [status]="assignment.status" />
          <p *ngIf="assignment.dueDate" class="text-xs text-gray-400 mt-1">
            Due {{ assignment.dueDate | date:'mediumDate' }}
          </p>
        </div>
        <button *ngIf="assignment.status === 'assigned'" (click)="start()" class="btn-primary" [disabled]="starting">
          {{ starting ? 'Starting...' : 'Start Review' }}
        </button>
      </div>

      <!-- Collapsible checklist -->
      <div class="card p-0 overflow-hidden">
        <button
          type="button"
          (click)="checklistOpen = !checklistOpen"
          class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="font-semibold text-gray-800">Applicant Checklist</span>
            <span class="badge bg-gray-100 text-gray-600 text-xs">Read-only</span>
          </div>
          <svg class="h-5 w-5 text-gray-400 transition-transform"
            [class.rotate-180]="checklistOpen"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div *ngIf="checklistOpen" class="border-t border-gray-100">
          <app-checklist
            [appId]="assignment.applicationId"
            applicationStatus="submitted" />
        </div>
      </div>

      <!-- Upload Report -->
      <div class="card" *ngIf="assignment.status === 'ongoing' || assignment.status === 'assigned'">
        <h3 class="font-semibold text-gray-800 mb-3">Upload Assessment Report</h3>
        <p class="text-sm text-gray-500 mb-4">
          Upload your Word assessment report (.doc or .docx). Your detailed findings and comments should be in the report.
        </p>
        <app-file-upload (fileSelected)="onFileSelected($event)" />
        <div *ngIf="uploadedReport" class="mt-3 flex items-center gap-2 text-sm text-green-700">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Report uploaded: {{ uploadedReport.fileName }}</span>
          <button (click)="deleteReport()" class="text-red-500 text-xs hover:underline ml-2">Remove</button>
        </div>
        <button *ngIf="selectedFile && !uploadedReport" (click)="uploadReport()" class="btn-primary mt-3" [disabled]="uploading">
          {{ uploading ? 'Uploading...' : 'Upload Report' }}
        </button>
        <p *ngIf="uploadError" class="text-sm text-red-600 mt-2">{{ uploadError }}</p>
      </div>

      <!-- Recommendation -->
      <div class="card" *ngIf="assignment.status === 'ongoing'">
        <h3 class="font-semibold text-gray-800 mb-1">Recommendation</h3>
        <p class="text-sm text-gray-500 mb-4">
          State your recommendation based on your review of the checklist and study report.
        </p>
        <form [formGroup]="commentForm" (ngSubmit)="submitComment()">
          <div class="mb-4">
            <textarea
              formControlName="recommendation"
              class="form-input"
              rows="4"
              placeholder="e.g. The bioequivalence study meets all required criteria. I recommend approval of this submission. / The bioanalytical method validation is incomplete. I recommend a compliance directive be issued for Section B items 9 and 10.">
            </textarea>
            <p *ngIf="commentForm.get('recommendation')?.touched && commentForm.get('recommendation')?.invalid"
              class="form-error">Recommendation is required (minimum 10 characters)</p>
          </div>
          <p *ngIf="commentError" class="text-sm text-red-600 mb-2">{{ commentError }}</p>
          <button type="submit" class="btn-primary" [disabled]="commentSaved || commentSaving">
            {{ commentSaved ? 'Recommendation Saved ✓' : commentSaving ? 'Saving...' : 'Save Recommendation' }}
          </button>
        </form>
      </div>

      <!-- Submit / Revert -->
      <div class="card" *ngIf="assignment.status === 'ongoing'">
        <h3 class="font-semibold text-gray-800 mb-2">Submit Assessment</h3>
        <p class="text-sm text-gray-500 mb-4">
          Ensure you have uploaded your report and saved your recommendation before submitting.
        </p>

        <!-- Checklist -->
        <div class="mb-4 space-y-1 text-sm">
          <div class="flex items-center gap-2" [class.text-green-600]="uploadedReport" [class.text-gray-400]="!uploadedReport">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                [attr.d]="uploadedReport ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'" />
            </svg>
            Report {{ uploadedReport ? 'uploaded ✓' : 'not yet uploaded' }}
          </div>
          <div class="flex items-center gap-2" [class.text-green-600]="commentSaved" [class.text-gray-400]="!commentSaved">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                [attr.d]="commentSaved ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'" />
            </svg>
            Recommendation {{ commentSaved ? 'saved ✓' : 'not yet saved' }}
          </div>
        </div>

        <div class="flex gap-3">
          <button (click)="submitAssessment('submit')" class="btn-primary"
            [disabled]="submitting || !uploadedReport || !commentSaved">
            {{ submitting ? 'Submitting...' : 'Submit Assessment' }}
          </button>
          <button (click)="submitAssessment('revert')" class="btn-danger" [disabled]="submitting">
            Revert to Admin
          </button>
        </div>
        <p *ngIf="submitError" class="text-sm text-red-600 mt-2">{{ submitError }}</p>
        <p *ngIf="submitSuccess" class="text-sm text-green-600 mt-2">Assessment submitted successfully!</p>
      </div>

    </div>
  `,
})
export class AssessorReviewComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  assignment: AssessorAssignment | null = null;
  uploadedReport: AssessorReport | null = null;
  selectedFile: File | null = null;
  checklistOpen = false;
  starting = false;
  uploading = false;
  uploadError = '';
  commentSaved = false;
  commentSaving = false;
  commentError = '';
  submitting = false;
  submitError = '';
  submitSuccess = false;

  commentForm = this.fb.group({
    recommendation: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit() {
    const assignmentId = this.route.snapshot.paramMap.get('assignmentId')!;
    this.api.getMyAssignments().subscribe(({ assignments }) => {
      this.assignment = assignments.find((a) => a.id === assignmentId) ?? null;
      if (this.assignment) {
        this.api.getApplicationReports(this.assignment.applicationId).subscribe(({ reports }) => {
          this.uploadedReport = reports.find((r) => r.assessorAssignmentId === assignmentId) ?? null;
        });
      }
    });
  }

  start() {
    this.starting = true;
    this.api.startAssignment(this.assignment!.id).subscribe({
      next: ({ assignment }) => { this.assignment = assignment; this.starting = false; },
      error: () => (this.starting = false),
    });
  }

  onFileSelected(file: File) { this.selectedFile = file ?? null; }

  uploadReport() {
    if (!this.selectedFile) return;
    this.uploading = true;
    this.uploadError = '';
    const fd = new FormData();
    fd.append('report', this.selectedFile);
    this.api.uploadReport(this.assignment!.id, fd).subscribe({
      next: ({ report }) => { this.uploadedReport = report; this.uploading = false; },
      error: (e) => { this.uploadError = e.error?.message ?? 'Upload failed'; this.uploading = false; },
    });
  }

  deleteReport() {
    if (!this.uploadedReport) return;
    this.api.deleteReport(this.uploadedReport.id).subscribe(() => { this.uploadedReport = null; });
  }

  submitComment() {
    if (this.commentForm.invalid) { this.commentForm.markAllAsTouched(); return; }
    this.commentSaving = true;
    this.commentError = '';
    // Use the recommendation text as both the comment and a fixed recommendation value
    const payload = {
      recommendation: 'assessment_completed',
      comment: this.commentForm.value.recommendation,
    };
    this.api.submitComment(this.assignment!.id, payload).subscribe({
      next: () => { this.commentSaved = true; this.commentSaving = false; },
      error: (e) => { this.commentError = e.error?.message ?? 'Failed to save'; this.commentSaving = false; },
    });
  }

  submitAssessment(action: 'submit' | 'revert') {
    this.submitting = true;
    this.submitError = '';
    this.api.submitAssessment(this.assignment!.id, action).subscribe({
      next: ({ assignment }) => { this.assignment = assignment; this.submitSuccess = true; this.submitting = false; },
      error: (e) => { this.submitError = e.error?.message ?? 'Failed'; this.submitting = false; },
    });
  }
}
