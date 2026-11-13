import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import type { Application } from '../../../core/models';

interface ActionGroup {
  label: string;
  description: string;
  color: string;
  statuses: string[];
  action: string;
  actionRoute: (app: Application) => any[];
  actionParams?: (app: Application) => Record<string, string>;
}

const ACTION_GROUPS: ActionGroup[] = [
  {
    label: 'Awaiting Screening',
    description: 'New submissions that need to be screened',
    color: 'blue',
    statuses: ['submitted', 'resubmitted_after_compliance_directive'],
    action: 'Start Screening',
    actionRoute: (app) => ['/admin/applications', app.id],
    actionParams: () => ({ tab: 'screening' }),
  },
  {
    label: 'Under Screening',
    description: 'Applications currently being screened',
    color: 'yellow',
    statuses: ['under_admin_screening'],
    action: 'Continue Screening',
    actionRoute: (app) => ['/admin/applications', app.id],
    actionParams: () => ({ tab: 'screening' }),
  },
  {
    label: 'Directive Responded',
    description: 'Applicants have responded to compliance directives',
    color: 'orange',
    statuses: ['resubmitted_after_compliance_directive'],
    action: 'Review Response',
    actionRoute: (app) => ['/admin/applications', app.id],
    actionParams: () => ({ tab: 'directives' }),
  },
  {
    label: 'Awaiting Classification',
    description: 'Screening complete — classify the product',
    color: 'purple',
    statuses: ['classified'],
    action: 'Classify',
    actionRoute: (app) => ['/admin/applications', app.id],
    actionParams: () => ({ tab: 'classification' }),
  },
  {
    label: 'Awaiting Assessor Assignment',
    description: 'Classified — assign a first assessor',
    color: 'indigo',
    statuses: ['classified'],
    action: 'Assign Assessor',
    actionRoute: (app) => ['/admin/applications', app.id],
    actionParams: () => ({ tab: 'assignments' }),
  },
  {
    label: 'Awaiting Final Decision',
    description: 'Assessment complete — record the final decision',
    color: 'red',
    statuses: ['awaiting_final_decision', 'first_assessment_reverted', 'second_assessment_reverted'],
    action: 'Record Decision',
    actionRoute: (app) => ['/admin/applications', app.id],
    actionParams: () => ({ tab: 'decision' }),
  },
];

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, PageHeaderComponent, SpinnerComponent],
  template: `
    <app-page-header
      title="Admin Dashboard"
      [subtitle]="'Welcome back, ' + (auth.user()?.fullName ?? '')" />

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="card text-center">
        <p class="text-3xl font-bold text-primary-700">{{ stats?.total ?? '—' }}</p>
        <p class="text-sm text-gray-500 mt-1">Total Applications</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-blue-600">{{ stats?.submitted ?? '—' }}</p>
        <p class="text-sm text-gray-500 mt-1">Awaiting Screening</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-indigo-600">{{ stats?.ongoing ?? '—' }}</p>
        <p class="text-sm text-gray-500 mt-1">Ongoing Reviews</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-green-600">{{ stats?.finalized ?? '—' }}</p>
        <p class="text-sm text-gray-500 mt-1">Finalized</p>
      </div>
    </div>

    <!-- Quick links -->
    <div class="flex gap-3 mb-8 flex-wrap">
      <a routerLink="/admin/submitted" class="btn-primary">Submitted Queue</a>
      <a routerLink="/admin/registry" class="btn-secondary">Registry</a>
      <a routerLink="/super-admin/reports" class="btn-secondary">Reports</a>
    </div>

    <app-spinner *ngIf="loading" message="Loading action queues..." />

    <ng-container *ngIf="!loading">

      <!-- Action required banner -->
      <div *ngIf="totalActionItems > 0"
        class="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
        <svg class="h-5 w-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
        <p class="text-sm font-medium text-red-800">
          {{ totalActionItems }} application{{ totalActionItems > 1 ? 's' : '' }} require your attention.
        </p>
      </div>

      <!-- Action groups -->
      <div class="space-y-6">
        <ng-container *ngFor="let group of actionGroups">
          <div *ngIf="group.apps.length > 0">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h2 class="text-base font-semibold text-gray-800">{{ group.label }}</h2>
                <p class="text-xs text-gray-500">{{ group.description }}</p>
              </div>
              <span class="badge bg-gray-100 text-gray-700">{{ group.apps.length }}</span>
            </div>
            <div class="space-y-2">
              <div *ngFor="let app of group.apps"
                class="card flex items-center justify-between gap-4 py-3">
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-800 truncate">{{ app.productName }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ app.applicationNo }}
                    <span *ngIf="app.strengthAndDosageForm"> · {{ app.strengthAndDosageForm }}</span>
                    <span *ngIf="app.submittedAt"> · Submitted {{ app.submittedAt | date:'mediumDate' }}</span>
                  </p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <app-status-badge [status]="app.currentStatus" />
                  <a [routerLink]="group.route(app)"
                    [queryParams]="group.tabParam"
                    class="btn-primary text-xs">
                    {{ group.action }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- All clear -->
        <div *ngIf="totalActionItems === 0" class="card text-center py-12">
          <svg class="mx-auto h-10 w-10 text-green-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-gray-500 font-medium">All caught up!</p>
          <p class="text-sm text-gray-400 mt-1">No applications require your attention right now.</p>
        </div>
      </div>
    </ng-container>
  `,
})
export class AdminDashboardComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);

  loading = true;
  stats: { total: number; submitted: number; finalized: number; ongoing: number } | null = null;
  allApplications: Application[] = [];

  get actionGroups() {
    return [
      {
        label: 'Awaiting Screening',
        description: 'New submissions that need to be screened',
        action: 'Start Screening',
        tabParam: { tab: 'screening' },
        route: (app: Application) => ['/admin/applications', app.id],
        apps: this.allApplications.filter((a) => a.currentStatus === 'submitted'),
      },
      {
        label: 'Under Screening',
        description: 'Applications currently being screened',
        action: 'Continue Screening',
        tabParam: { tab: 'screening' },
        route: (app: Application) => ['/admin/applications', app.id],
        apps: this.allApplications.filter((a) => a.currentStatus === 'under_admin_screening'),
      },
      {
        label: 'Directive Responded — Awaiting Review',
        description: 'Applicants have responded to compliance directives and resubmitted',
        action: 'Review',
        tabParam: { tab: 'directives' },
        route: (app: Application) => ['/admin/applications', app.id],
        apps: this.allApplications.filter((a) => a.currentStatus === 'resubmitted_after_compliance_directive'),
      },
      {
        label: 'Awaiting Assessor Assignment',
        description: 'Classified — assign a first assessor to begin assessment',
        action: 'Assign Assessor',
        tabParam: { tab: 'assignments' },
        route: (app: Application) => ['/admin/applications', app.id],
        apps: this.allApplications.filter((a) => a.currentStatus === 'classified'),
      },
      {
        label: 'Assessment Reverted — Action Needed',
        description: 'Assessor has reverted — assign second assessor or issue directive',
        action: 'Review',
        tabParam: { tab: 'assignments' },
        route: (app: Application) => ['/admin/applications', app.id],
        apps: this.allApplications.filter((a) =>
          ['first_assessment_reverted', 'second_assessment_reverted'].includes(a.currentStatus)
        ),
      },
      {
        label: 'Awaiting Final Decision',
        description: 'Assessment complete — record the final decision',
        action: 'Record Decision',
        tabParam: { tab: 'decision' },
        route: (app: Application) => ['/admin/applications', app.id],
        apps: this.allApplications.filter((a) => a.currentStatus === 'awaiting_final_decision'),
      },
    ];
  }

  get totalActionItems() {
    return this.actionGroups.reduce((sum, g) => sum + g.apps.length, 0);
  }

  ngOnInit() {
    this.api.getDashboardStats().subscribe(({ stats }) => (this.stats = stats));
    this.api.getRegistry().subscribe({
      next: ({ applications }) => {
        this.allApplications = applications;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
