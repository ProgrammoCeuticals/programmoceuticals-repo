import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import type { Application } from '../../../core/models';

@Component({
  selector: 'app-applicant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, PageHeaderComponent, SpinnerComponent],
  template: `
    <app-page-header
      title="Dashboard"
      [subtitle]="'Welcome back, ' + (auth.user()?.fullName ?? '')" />

    <!-- Summary cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="card text-center">
        <p class="text-3xl font-bold text-primary-700">{{ applications.length }}</p>
        <p class="text-sm text-gray-500 mt-1">Total Submissions</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-yellow-600">{{ countByStatus('draft') }}</p>
        <p class="text-sm text-gray-500 mt-1">Drafts</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-orange-600">{{ countByStatus('compliance_directive_issued') }}</p>
        <p class="text-sm text-gray-500 mt-1">Directives Pending</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-green-600">{{ countByStatus('finalized') }}</p>
        <p class="text-sm text-gray-500 mt-1">Finalized</p>
      </div>
    </div>

    <!-- Compliance directive alert -->
    <div *ngIf="countByStatus('compliance_directive_issued') > 0"
      class="mb-6 flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
      <svg class="h-5 w-5 text-orange-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      </svg>
      <div>
        <p class="text-sm font-semibold text-orange-800">Action Required</p>
        <p class="text-sm text-orange-700">
          You have {{ countByStatus('compliance_directive_issued') }}
          application{{ countByStatus('compliance_directive_issued') > 1 ? 's' : '' }}
          with open compliance directives that require your response.
          <a routerLink="/my-directives" class="font-semibold underline ml-1">View all directives →</a>
        </p>
      </div>
    </div>

    <!-- Applications list -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-800">My Applications</h2>
      <a routerLink="/new-application" class="btn-primary">+ New Submission</a>
    </div>

    <app-spinner *ngIf="loading" message="Loading your applications..." />

    <div *ngIf="!loading && applications.length === 0" class="card text-center py-12 text-gray-400">
      No applications yet.
      <a routerLink="/new-application" class="block mt-3 text-primary-600 font-medium hover:underline">
        Start your first BE submission →
      </a>
    </div>

    <div class="space-y-3">
      <div *ngFor="let app of applications" class="card hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-800 truncate">{{ app.productName }}</p>
            <p class="text-sm text-gray-500 mt-0.5">
              {{ app.applicationNo }}
              <span *ngIf="app.strengthAndDosageForm"> · {{ app.strengthAndDosageForm }}</span>
            </p>
            <p class="text-xs text-gray-400 mt-1">
              Created {{ app.createdAt | date:'mediumDate' }}
              <span *ngIf="app.submittedAt"> · Submitted {{ app.submittedAt | date:'mediumDate' }}</span>
            </p>
          </div>
          <div class="flex flex-col items-end gap-2 shrink-0">
            <app-status-badge [status]="app.currentStatus" />
            <app-status-badge *ngIf="app.finalDecision" [status]="app.finalDecision!" />
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
          <a *ngIf="app.currentStatus === 'draft'"
            [routerLink]="['/applications', app.id]" [queryParams]="{tab: 'checklist'}"
            class="btn-primary text-xs">Continue Filling Checklist</a>
          <a *ngIf="app.currentStatus === 'compliance_directive_issued'"
            [routerLink]="['/applications', app.id]" [queryParams]="{tab: 'directives'}"
            class="btn-primary text-xs bg-orange-600 hover:bg-orange-700">View &amp; Respond to Directive</a>
          <a [routerLink]="['/applications', app.id]" class="btn-secondary text-xs">View Application</a>
          <a *ngIf="app.currentStatus !== 'draft'"
            [routerLink]="['/applications', app.id, 'status']" class="btn-secondary text-xs">Track Status</a>
        </div>
      </div>
    </div>
  `,
})
export class ApplicantDashboardComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);

  loading = true;
  applications: Application[] = [];

  ngOnInit() {
    this.api.getMyApplications().subscribe({
      next: ({ applications }) => {
        this.applications = applications.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  countByStatus(status: string) {
    return this.applications.filter((a) => a.currentStatus === status).length;
  }
}
