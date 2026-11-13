import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-assessor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, PageHeaderComponent, SpinnerComponent],
  template: `
    <app-page-header
      title="Dashboard"
      [subtitle]="'Welcome back, ' + (auth.user()?.fullName ?? '')" />

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="card text-center">
        <p class="text-3xl font-bold text-primary-700">{{ assignments.length }}</p>
        <p class="text-sm text-gray-500 mt-1">Total Assignments</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-yellow-600">{{ countByStatus('assigned') }}</p>
        <p class="text-sm text-gray-500 mt-1">Pending Start</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-indigo-600">{{ countByStatus('ongoing') }}</p>
        <p class="text-sm text-gray-500 mt-1">Ongoing</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-green-600">{{ countByStatus('completed') }}</p>
        <p class="text-sm text-gray-500 mt-1">Completed</p>
      </div>
    </div>

    <!-- Action alert -->
    <div *ngIf="countByStatus('assigned') > 0"
      class="mb-6 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
      <svg class="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
      <p class="text-sm font-medium text-blue-800">
        You have {{ countByStatus('assigned') }} new assignment{{ countByStatus('assigned') > 1 ? 's' : '' }} waiting to be started.
      </p>
    </div>

    <app-spinner *ngIf="loading" message="Loading your assignments..." />

    <!-- Active assignments -->
    <div *ngIf="!loading">
      <h2 class="text-base font-semibold text-gray-800 mb-3">Active Assignments</h2>
      <div *ngIf="activeAssignments.length === 0" class="card text-center py-8 text-gray-400 mb-6">
        No active assignments.
      </div>
      <div class="space-y-3 mb-6">
        <a *ngFor="let a of activeAssignments"
          [routerLink]="['/assessor/review', a.id]"
          class="card flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div>
            <p class="font-medium text-gray-800">{{ applicationName(a.applicationId) }}</p>
            <p class="text-sm text-gray-500 capitalize">
              {{ a.assessmentStage === 'first_assessment' ? 'First Assessment' : 'Second Assessment' }}
              <span *ngIf="a.dueDate" class="text-orange-600"> · Due {{ a.dueDate | date:'mediumDate' }}</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <app-status-badge [status]="a.status" />
            <span class="btn-primary text-xs">
              {{ a.status === 'assigned' ? 'Start Review' : 'Continue Review' }}
            </span>
          </div>
        </a>
      </div>

      <!-- Completed assignments -->
      <div *ngIf="completedAssignments.length > 0">
        <h2 class="text-base font-semibold text-gray-800 mb-3">Completed Assignments</h2>
        <div class="space-y-2">
          <div *ngFor="let a of completedAssignments"
            class="card flex items-center justify-between opacity-75">
            <div>
              <p class="font-medium text-gray-700">{{ applicationName(a.applicationId) }}</p>
              <p class="text-sm text-gray-500 capitalize">
                {{ a.assessmentStage === 'first_assessment' ? 'First Assessment' : 'Second Assessment' }}
                <span *ngIf="a.completedAt"> · Completed {{ a.completedAt | date:'mediumDate' }}</span>
              </p>
            </div>
            <app-status-badge [status]="a.status" />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AssessorDashboardComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);

  loading = true;
  assignments: any[] = [];
  applicationMap: Record<string, string> = {};

  get activeAssignments() {
    return this.assignments.filter((a) => ['assigned', 'ongoing'].includes(a.status));
  }

  get completedAssignments() {
    return this.assignments.filter((a) => ['completed', 'reverted'].includes(a.status));
  }

  countByStatus(status: string) {
    return this.assignments.filter((a) => a.status === status).length;
  }

  applicationName(id: string) {
    return this.applicationMap[id] ?? 'Loading...';
  }

  ngOnInit() {
    this.api.getMyAssignments().subscribe({
      next: ({ assignments }) => {
        this.assignments = assignments;
        this.loading = false;
        assignments.forEach((a: any) => {
          if (!this.applicationMap[a.applicationId]) {
            this.api.getApplication(a.applicationId).subscribe(({ application }) => {
              this.applicationMap[a.applicationId] = application.productName;
            });
          }
        });
      },
      error: () => (this.loading = false),
    });
  }
}
