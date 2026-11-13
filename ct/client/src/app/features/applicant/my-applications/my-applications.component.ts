import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import type { Application } from '../../../core/models';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, PageHeaderComponent, SpinnerComponent],
  template: `
    <app-page-header title="My Applications" />
    <div class="flex justify-end mb-4">
      <a routerLink="/new-application" class="btn-primary">+ New Submission</a>
    </div>
    <app-spinner *ngIf="loading" message="Loading your applications..." />
    <div *ngIf="!loading && applications.length === 0" class="card text-center py-12 text-gray-400">
      No applications yet.
    </div>
      <div class="space-y-3">
      <a *ngFor="let app of applications"
         [routerLink]="['/applications', app.id]"
         class="card flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
        <div>
          <p class="font-semibold text-gray-800">{{ app.productName }}</p>
          <p class="text-sm text-gray-500">{{ app.applicationNo }} · {{ app.strengthAndDosageForm }}</p>
          <p class="text-xs text-gray-400 mt-1">Created {{ app.createdAt | date:'mediumDate' }}</p>
        </div>
        <div class="flex flex-col items-end gap-2">
          <app-status-badge [status]="app.currentStatus" />
          <app-status-badge [status]="app.reviewStatus" />
          <a *ngIf="app.currentStatus !== 'draft'"
            [routerLink]="['/applications', app.id, 'status']"
            (click)="$event.stopPropagation()"
            class="text-xs text-primary-600 hover:underline mt-1">Track Status</a>
        </div>
      </a>
    </div>
  `,
})
export class MyApplicationsComponent implements OnInit {
  private api = inject(ApiService);
  applications: Application[] = [];
  loading = true;

  ngOnInit() {
    this.api.getMyApplications().subscribe({
      next: ({ applications }) => { this.applications = applications; this.loading = false; },
      error: () => (this.loading = false),
    });
  }
}
