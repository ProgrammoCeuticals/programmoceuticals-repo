import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import type { Application, AuditLog } from '../../../core/models';

interface WorkflowStep {
  key: string;
  label: string;
  description: string;
  statuses: string[];
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    key: 'draft',
    label: 'Draft',
    description: 'Application created. Fill in the BE checklist and submit when ready.',
    statuses: ['draft'],
  },
  {
    key: 'submitted',
    label: 'Submitted',
    description: 'Application submitted to NAFDAC for screening.',
    statuses: ['submitted', 'resubmitted_after_compliance_directive'],
  },
  {
    key: 'screening',
    label: 'Admin Screening',
    description: 'NAFDAC officer is reviewing your submission for completeness.',
    statuses: ['under_admin_screening'],
  },
  {
    key: 'compliance',
    label: 'Compliance Directive',
    description: 'A compliance directive has been issued. Review, correct the checklist, and resubmit.',
    statuses: ['compliance_directive_issued'],
  },
  {
    key: 'classified',
    label: 'Classified',
    description: 'Your product has been classified. Awaiting assessor assignment.',
    statuses: ['classified'],
  },
  {
    key: 'first_assessment',
    label: 'First Assessment',
    description: 'An assessor is reviewing your bioequivalence study report.',
    statuses: ['assigned_first_assessor', 'first_assessment_ongoing', 'first_assessment_reverted'],
  },
  {
    key: 'second_assessment',
    label: 'Second Assessment',
    description: 'A second assessor has been assigned to review your submission.',
    statuses: ['assigned_second_assessor', 'second_assessment_ongoing', 'second_assessment_reverted'],
  },
  {
    key: 'decision',
    label: 'Awaiting Final Decision',
    description: 'Assessment complete. NAFDAC is recording the final decision.',
    statuses: ['awaiting_final_decision'],
  },
  {
    key: 'finalized',
    label: 'Finalized',
    description: 'A final decision has been recorded for your application.',
    statuses: ['finalized'],
  },
];

@Component({
  selector: 'app-submission-status',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, StatusBadgeComponent, SpinnerComponent],
  template: `
    <app-spinner *ngIf="loading" message="Loading application status..." />

    <ng-container *ngIf="!loading && application">
      <app-page-header
        [title]="application.productName"
        [subtitle]="application.applicationNo" />

      <!-- Current status banner -->
      <div class="card mb-6 flex items-center justify-between gap-4"
        [class.border-l-4]="true"
        [class.border-l-green-500]="application.currentStatus === 'finalized'"
        [class.border-l-orange-500]="application.currentStatus === 'compliance_directive_issued'"
        [class.border-l-primary-500]="application.currentStatus !== 'finalized' && application.currentStatus !== 'compliance_directive_issued'">
        <div>
          <p class="text-sm text-gray-500 mb-1">Current Status</p>
          <app-status-badge [status]="application.currentStatus" />
          <p *ngIf="currentStep" class="text-sm text-gray-600 mt-2">{{ currentStep.description }}</p>
        </div>
        <div *ngIf="application.finalDecision" class="text-right">
          <p class="text-sm text-gray-500 mb-1">Final Decision</p>
          <app-status-badge [status]="application.finalDecision!" />
          <p *ngIf="application.finalDecisionDate" class="text-xs text-gray-400 mt-1">
            {{ application.finalDecisionDate | date:'mediumDate' }}
          </p>
        </div>
      </div>

      <!-- Final decision note -->
      <div *ngIf="application.finalDecision && application.finalDecisionNote"
        class="card mb-6 text-sm"
        [class.bg-green-50]="application.finalDecision === 'Approved'"
        [class.bg-red-50]="application.finalDecision === 'Rejected'"
        [class.bg-orange-50]="application.finalDecision === 'CD'">
        <p class="font-semibold mb-1">Decision Note</p>
        <p class="text-gray-700">{{ application.finalDecisionNote }}</p>
      </div>

      <!-- Compliance directive action alert -->
      <div *ngIf="application.currentStatus === 'compliance_directive_issued'"
        class="mb-6 flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
        <svg class="h-5 w-5 text-orange-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
        <div class="flex-1">
          <p class="text-sm font-semibold text-orange-800">Action Required</p>
          <p class="text-sm text-orange-700 mt-0.5">A compliance directive has been issued. Review the directive, correct the checklist, and resubmit.</p>
        </div>
        <div class="flex gap-2 shrink-0">
          <a [routerLink]="['/applications', application.id]" [queryParams]="{tab: 'directives'}"
            class="btn-primary text-xs bg-orange-600 hover:bg-orange-700">View Directive</a>
          <a [routerLink]="['/applications', application.id]" [queryParams]="{tab: 'checklist'}"
            class="btn-secondary text-xs">Edit Checklist</a>
        </div>
      </div>

      <!-- Workflow progress -->
      <div class="card mb-6">
        <h3 class="font-semibold text-gray-800 mb-5">Workflow Progress</h3>
        <div class="relative">
          <!-- Vertical line -->
          <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div class="space-y-0">
            <div *ngFor="let step of visibleSteps; let last = last"
              class="relative flex gap-4 pb-6"
              [class.pb-0]="last">

              <!-- Step indicator -->
              <div class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                [class.bg-green-500]="isCompleted(step)"
                [class.border-green-500]="isCompleted(step)"
                [class.bg-primary-600]="isCurrent(step)"
                [class.border-primary-600]="isCurrent(step)"
                [class.bg-orange-500]="isWarning(step)"
                [class.border-orange-500]="isWarning(step)"
                [class.bg-white]="isPending(step)"
                [class.border-gray-300]="isPending(step)">
                <!-- Completed checkmark -->
                <svg *ngIf="isCompleted(step)" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
                <!-- Current pulse -->
                <div *ngIf="isCurrent(step) || isWarning(step)" class="h-2.5 w-2.5 rounded-full bg-white"></div>
                <!-- Pending dot -->
                <div *ngIf="isPending(step)" class="h-2 w-2 rounded-full bg-gray-300"></div>
              </div>

              <!-- Step content -->
              <div class="flex-1 pt-0.5 pb-1">
                <div class="flex items-center gap-2 mb-0.5">
                  <p class="text-sm font-semibold"
                    [class.text-green-700]="isCompleted(step)"
                    [class.text-primary-700]="isCurrent(step)"
                    [class.text-orange-700]="isWarning(step)"
                    [class.text-gray-400]="isPending(step)">
                    {{ step.label }}
                  </p>
                  <span *ngIf="isCurrent(step) && !isWarning(step)"
                    class="badge bg-primary-100 text-primary-700 text-xs">Current</span>
                  <span *ngIf="isWarning(step)"
                    class="badge bg-orange-100 text-orange-700 text-xs">Action Required</span>
                </div>
                <p class="text-xs"
                  [class.text-gray-500]="!isPending(step)"
                  [class.text-gray-300]="isPending(step)">
                  {{ step.description }}
                </p>
                <!-- Timestamp from timeline -->
                <p *ngIf="stepTimestamp(step)" class="text-xs text-gray-400 mt-1">
                  {{ stepTimestamp(step) | date:'mediumDate' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="card">
        <h3 class="font-semibold text-gray-800 mb-4">Activity Timeline</h3>
        <app-spinner *ngIf="timelineLoading" message="Loading timeline..." />
        <div *ngIf="!timelineLoading" class="space-y-3">
          <div *ngFor="let log of timeline" class="flex gap-3 text-sm">
            <div class="w-28 text-xs text-gray-400 pt-0.5 shrink-0">{{ log.createdAt | date:'short' }}</div>
            <div class="flex-1 text-gray-700">{{ log.action.split('_').join(' ') }}</div>
          </div>
          <p *ngIf="timeline.length === 0" class="text-sm text-gray-400">No activity yet.</p>
        </div>
      </div>

      <!-- Navigation -->
      <div class="mt-6 flex gap-3">
        <a [routerLink]="['/applications', application.id]" class="btn-secondary">View Full Application</a>
        <a routerLink="/my-applications" class="btn-secondary">Back to My Applications</a>
      </div>
    </ng-container>

    <div *ngIf="!loading && !application" class="card text-center py-16 text-gray-400">
      Application not found.
    </div>
  `,
})
export class SubmissionStatusComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  loading = true;
  timelineLoading = true;
  application: Application | null = null;
  timeline: AuditLog[] = [];

  get currentStep(): WorkflowStep | undefined {
    return WORKFLOW_STEPS.find((s) => s.statuses.includes(this.application?.currentStatus ?? ''));
  }

  get visibleSteps(): WorkflowStep[] {
    // Hide second_assessment if not reached
    const status = this.application?.currentStatus ?? '';
    const secondAssessmentStatuses = ['assigned_second_assessor', 'second_assessment_ongoing', 'second_assessment_reverted'];
    const hasReachedSecond = secondAssessmentStatuses.some((s) =>
      this.getStatusOrder(s) <= this.getStatusOrder(status)
    );
    return WORKFLOW_STEPS.filter((s) => s.key !== 'second_assessment' || hasReachedSecond);
  }

  isCompleted(step: WorkflowStep): boolean {
    const currentOrder = this.getStatusOrder(this.application?.currentStatus ?? '');
    const stepMaxOrder = Math.max(...step.statuses.map((s) => this.getStatusOrder(s)));
    return currentOrder > stepMaxOrder && !step.statuses.includes(this.application?.currentStatus ?? '');
  }

  isCurrent(step: WorkflowStep): boolean {
    return step.statuses.includes(this.application?.currentStatus ?? '');
  }

  isWarning(step: WorkflowStep): boolean {
    return this.isCurrent(step) && step.key === 'compliance';
  }

  isPending(step: WorkflowStep): boolean {
    return !this.isCompleted(step) && !this.isCurrent(step);
  }

  stepTimestamp(step: WorkflowStep): string | null {
    const action = this.timeline.find((l) =>
      step.statuses.some((s) => l.action.includes(s.replace(/_/g, '_')))
    );
    return action?.createdAt ?? null;
  }

  private getStatusOrder(status: string): number {
    const order = [
      'draft', 'submitted', 'resubmitted_after_compliance_directive',
      'under_admin_screening', 'compliance_directive_issued',
      'classified', 'assigned_first_assessor', 'first_assessment_ongoing',
      'first_assessment_reverted', 'assigned_second_assessor',
      'second_assessment_ongoing', 'second_assessment_reverted',
      'awaiting_final_decision', 'finalized', 'archived',
    ];
    return order.indexOf(status);
  }

  ngOnInit() {
    const appId = this.route.snapshot.paramMap.get('applicationId')!;
    this.api.getApplication(appId).subscribe({
      next: ({ application }) => {
        this.application = application;
        this.loading = false;
        this.api.getApplicationTimeline(appId).subscribe({
          next: ({ timeline }) => { this.timeline = timeline; this.timelineLoading = false; },
          error: () => (this.timelineLoading = false),
        });
      },
      error: () => (this.loading = false),
    });
  }
}
