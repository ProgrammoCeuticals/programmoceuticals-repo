import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import type { Application } from '../../../core/models';

@Component({
  selector: 'app-submitted-queue',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, StatusBadgeComponent, SpinnerComponent],
  template: `
    <app-page-header title="Submitted Applications" subtitle="Applications awaiting or under screening" />

    <!-- Filter tabs -->
    <div class="flex gap-2 mb-5 border-b border-gray-200">
      <button *ngFor="let f of filters"
        (click)="activeFilter = f.key; applyFilter()"
        class="px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
        [class.border-primary-600]="activeFilter === f.key"
        [class.text-primary-700]="activeFilter === f.key"
        [class.border-transparent]="activeFilter !== f.key"
        [class.text-gray-500]="activeFilter !== f.key">
        {{ f.label }}
        <span *ngIf="countByFilter(f.key) > 0"
          class="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary-600 text-white text-xs">
          {{ countByFilter(f.key) }}
        </span>
      </button>
    </div>

    <app-spinner *ngIf="loading" message="Loading applications..." />
    <div *ngIf="!loading && filtered.length === 0" class="card text-center py-12 text-gray-400">
      No applications in this category.
    </div>
    <div class="space-y-3">
      <div *ngFor="let app of filtered" class="card flex items-center justify-between gap-4">
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-800 truncate">{{ app.productName }}</p>
          <p class="text-sm text-gray-500">{{ app.applicationNo }} · {{ app.strengthAndDosageForm }}</p>
          <p class="text-xs text-gray-400 mt-1">
            Submitted {{ app.submittedAt | date:'mediumDate' }}
            <span *ngIf="app.resubmittedAt" class="text-orange-600"> · Resubmitted {{ app.resubmittedAt | date:'mediumDate' }}</span>
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <app-status-badge [status]="app.currentStatus" />
          <a [routerLink]="['/admin/applications', app.id]" [queryParams]="{tab: 'screening'}" class="btn-secondary text-xs">Open</a>
          <button
            *ngIf="app.currentStatus === 'submitted' || app.currentStatus === 'resubmitted_after_compliance_directive'"
            (click)="startScreening(app)" class="btn-primary text-xs" [disabled]="starting[app.id]">
            {{ starting[app.id] ? 'Starting...' : 'Start Screening' }}
          </button>
          <button
            *ngIf="app.currentStatus === 'under_admin_screening'"
            (click)="markSatisfactory(app)" class="btn-primary text-xs" [disabled]="marking[app.id]">
            {{ marking[app.id] ? 'Saving...' : 'Mark Satisfactory' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SubmittedQueueComponent implements OnInit {
  private api = inject(ApiService);
  applications: Application[] = [];
  filtered: Application[] = [];
  loading = true;
  starting: Record<string, boolean> = {};
  marking: Record<string, boolean> = {};
  activeFilter = 'all';

  filters = [
    { key: 'all',          label: 'All' },
    { key: 'submitted',    label: 'New Submissions' },
    { key: 'resubmitted',  label: 'Resubmissions' },
    { key: 'screening',    label: 'Under Screening' },
  ];

  countByFilter(key: string) {
    return this.applications.filter((a) => this.matchesFilter(a, key)).length;
  }

  matchesFilter(app: Application, key: string): boolean {
    if (key === 'all') return true;
    if (key === 'submitted') return app.currentStatus === 'submitted';
    if (key === 'resubmitted') return app.currentStatus === 'resubmitted_after_compliance_directive';
    if (key === 'screening') return app.currentStatus === 'under_admin_screening';
    return true;
  }

  applyFilter() {
    this.filtered = this.applications.filter((a) => this.matchesFilter(a, this.activeFilter));
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    // Fetch submitted + under_admin_screening
    Promise.all([
      this.api.getSubmittedApplications().toPromise(),
      this.api.getRegistry({ currentStatus: 'under_admin_screening' }).toPromise(),
    ]).then(([submitted, screening]) => {
      const all = [
        ...(submitted?.applications ?? []),
        ...(screening?.applications ?? []).filter((a: Application) => a.currentStatus === 'under_admin_screening'),
      ];
      // Deduplicate
      const seen = new Set<string>();
      this.applications = all.filter((a) => { if (seen.has(a.id)) return false; seen.add(a.id); return true; })
        .sort((a, b) => new Date(b.submittedAt ?? 0).getTime() - new Date(a.submittedAt ?? 0).getTime());
      this.applyFilter();
      this.loading = false;
    }).catch(() => (this.loading = false));
  }

  startScreening(app: Application) {
    this.starting[app.id] = true;
    this.api.startScreening(app.id).subscribe({
      next: ({ application }) => {
        const idx = this.applications.findIndex((a) => a.id === app.id);
        if (idx > -1) this.applications[idx] = application;
        this.applyFilter();
        this.starting[app.id] = false;
      },
      error: () => (this.starting[app.id] = false),
    });
  }

  markSatisfactory(app: Application) {
    this.marking[app.id] = true;
    this.api.markScreeningSatisfactory(app.id).subscribe({
      next: ({ application }) => {
        this.applications = this.applications.filter((a) => a.id !== application.id);
        this.applyFilter();
        this.marking[app.id] = false;
      },
      error: () => (this.marking[app.id] = false),
    });
  }
}
