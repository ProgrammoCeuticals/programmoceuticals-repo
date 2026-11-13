import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import type { Application, ComplianceDirective } from '../../../core/models';

interface DirectiveWithApp extends ComplianceDirective {
  application: Application;
}

@Component({
  selector: 'app-my-directives',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PageHeaderComponent, StatusBadgeComponent, SpinnerComponent],
  template: `
    <app-page-header
      title="Compliance Directives"
      subtitle="All directives issued across your applications" />

    <app-spinner *ngIf="loading" message="Loading compliance directives..." />

    <ng-container *ngIf="!loading">

      <!-- Summary bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="card text-center">
          <p class="text-2xl font-bold text-gray-700">{{ all.length }}</p>
          <p class="text-sm text-gray-500 mt-1">Total</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-bold text-orange-600">{{ countByStatus('open') }}</p>
          <p class="text-sm text-gray-500 mt-1">Open — Action Required</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-bold text-blue-600">{{ countByStatus('responded') }}</p>
          <p class="text-sm text-gray-500 mt-1">Responded</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-bold text-green-600">{{ countByStatus('closed') }}</p>
          <p class="text-sm text-gray-500 mt-1">Closed</p>
        </div>
      </div>

      <!-- Filter tabs -->
      <div class="flex gap-2 mb-5 border-b border-gray-200">
        <button *ngFor="let f of filters"
          (click)="activeFilter = f.key"
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
          [class.border-primary-600]="activeFilter === f.key"
          [class.text-primary-700]="activeFilter === f.key"
          [class.border-transparent]="activeFilter !== f.key"
          [class.text-gray-500]="activeFilter !== f.key">
          {{ f.label }}
          <span *ngIf="f.key === 'open' && countByStatus('open') > 0"
            class="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-orange-500 text-white text-xs">
            {{ countByStatus('open') }}
          </span>
        </button>
      </div>

      <!-- Empty state -->
      <div *ngIf="filtered.length === 0" class="card text-center py-12 text-gray-400">
        <svg class="mx-auto h-10 w-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>No {{ activeFilter === 'all' ? '' : activeFilter }} directives.</p>
      </div>

      <!-- Directive cards -->
      <div class="space-y-4">
        <div *ngFor="let d of filtered" class="card"
          [class.border-l-4]="d.status === 'open'"
          [class.border-l-orange-500]="d.status === 'open'">

          <!-- Header -->
          <div class="flex items-start justify-between gap-4 mb-3">
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-800">{{ d.title }}</p>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ d.directiveNumber }} · Issued {{ d.issuedAt | date:'mediumDate' }}
                <span *ngIf="d.dueDate" class="text-orange-600 font-medium"> · Due {{ d.dueDate | date:'mediumDate' }}</span>
              </p>
            </div>
            <app-status-badge [status]="d.status" />
          </div>

          <!-- Application link -->
          <a [routerLink]="['/applications', d.application.id]" [queryParams]="{tab: 'directives'}"
            class="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:underline mb-3">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ d.application.productName }} — {{ d.application.applicationNo }}
          </a>

          <!-- Message -->
          <p class="text-sm text-gray-700 mb-3">{{ d.directiveMessage }}</p>

          <!-- Required corrections -->
          <div *ngIf="d.requiredCorrections"
            class="bg-orange-50 border border-orange-100 rounded-md p-3 text-sm text-orange-800 mb-3">
            <p class="font-medium mb-1">Required corrections:</p>
            <p>{{ d.requiredCorrections }}</p>
          </div>

          <!-- Affected sections -->
          <div *ngIf="d.affectedSections?.length" class="mb-3">
            <p class="text-xs font-medium text-gray-600 mb-1.5">Affected checklist sections:</p>
            <div class="flex flex-wrap gap-1.5">
              <span *ngFor="let s of d.affectedSections"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                {{ s }}
              </span>
            </div>
          </div>

          <!-- Open directive: action buttons -->
          <div *ngIf="d.status === 'open'" class="border-t border-gray-100 pt-4 mt-3">
            <div class="flex flex-wrap gap-2 mb-4">
              <a [routerLink]="['/applications', d.application.id]" [queryParams]="{tab: 'checklist'}"
                class="btn-secondary text-xs">
                Go to Checklist
              </a>
            </div>

            <p class="text-sm font-medium text-gray-700 mb-3">Submit your response</p>
            <form [formGroup]="getForm(d.id)" (ngSubmit)="respond(d)">
              <div class="mb-3">
                <label class="form-label">Response message *</label>
                <textarea formControlName="responseMessage" class="form-input" rows="3"
                  placeholder="Describe the corrections you have made..."></textarea>
                <p *ngIf="getForm(d.id).get('responseMessage')?.touched && getForm(d.id).get('responseMessage')?.invalid"
                  class="form-error">Response message is required</p>
              </div>
              <p *ngIf="errors[d.id]" class="text-sm text-red-600 mb-2">{{ errors[d.id] }}</p>
              <button type="submit" class="btn-primary" [disabled]="loading_[d.id]">
                {{ loading_[d.id] ? 'Submitting...' : 'Submit Response' }}
              </button>
            </form>
          </div>

          <!-- Responded state: show resubmit if all directives responded -->
          <div *ngIf="d.status === 'responded'"
            class="border-t border-gray-100 pt-3 mt-3 space-y-3">
            <div class="flex items-center gap-2 text-sm text-blue-700">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Response submitted — awaiting admin review.
            </div>
            <div *ngIf="canResubmit(d)" class="flex items-center gap-3 rounded-md bg-blue-50 border border-blue-100 px-4 py-3">
              <div class="flex-1">
                <p class="text-sm font-medium text-blue-800">All directives responded</p>
                <p class="text-xs text-blue-600 mt-0.5">You can now resubmit your application for review.</p>
              </div>
              <button (click)="resubmit(d.application)" class="btn-primary text-xs" [disabled]="resubmitting[d.application.id]">
                {{ resubmitting[d.application.id] ? 'Resubmitting...' : 'Resubmit Application' }}
              </button>
            </div>
          </div>

          <!-- Closed state -->
          <div *ngIf="d.status === 'closed'"
            class="border-t border-gray-100 pt-3 mt-3 flex items-center gap-2 text-sm text-green-700">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Directive closed by admin.
          </div>

        </div>
      </div>
    </ng-container>
  `,
})
export class MyDirectivesComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  loading = true;
  all: DirectiveWithApp[] = [];
  activeFilter = 'open';
  forms: Record<string, ReturnType<FormBuilder['group']>> = {};
  loading_: Record<string, boolean> = {};
  errors: Record<string, string> = {};

  filters = [
    { key: 'open',      label: 'Open' },
    { key: 'responded', label: 'Responded' },
    { key: 'closed',    label: 'Closed' },
    { key: 'all',       label: 'All' },
  ];

  get filtered() {
    return this.activeFilter === 'all'
      ? this.all
      : this.all.filter((d) => d.status === this.activeFilter);
  }

  countByStatus(status: string) {
    return this.all.filter((d) => d.status === status).length;
  }

  ngOnInit() {
    this.api.getMyApplications().subscribe(({ applications }) => {
      if (applications.length === 0) { this.loading = false; return; }

      let pending = applications.length;
      applications.forEach((app) => {
        this.api.getDirectives(app.id).subscribe(({ directives }) => {
          directives.forEach((d) => {
            this.all.push({ ...d, application: app });
            this.forms[d.id] = this.fb.group({ responseMessage: ['', Validators.required] });
          });
          pending--;
          if (pending === 0) {
            // Sort: open first, then by issued date desc
            this.all.sort((a, b) => {
              if (a.status === 'open' && b.status !== 'open') return -1;
              if (a.status !== 'open' && b.status === 'open') return 1;
              return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
            });
            this.loading = false;
          }
        });
      });
    });
  }

  resubmitting: Record<string, boolean> = {};

  // An application can be resubmitted when ALL its open directives have been responded to
  canResubmit(d: DirectiveWithApp): boolean {
    if (d.application.currentStatus !== 'compliance_directive_issued') return false;
    const appDirectives = this.all.filter((x) => x.application.id === d.application.id);
    return appDirectives.every((x) => x.status !== 'open');
  }

  resubmit(application: Application) {
    this.resubmitting[application.id] = true;
    this.api.submitApplication(application.id).subscribe({
      next: ({ application: updated }) => {
        // Update all directives for this app with the new status
        this.all.forEach((d) => {
          if (d.application.id === updated.id) d.application = updated;
        });
        this.resubmitting[application.id] = false;
      },
      error: () => (this.resubmitting[application.id] = false),
    });
  }

  getForm(id: string) { return this.forms[id]; }

  respond(directive: DirectiveWithApp) {
    const form = this.forms[directive.id];
    if (form.invalid) { form.markAllAsTouched(); return; }
    this.loading_[directive.id] = true;
    this.errors[directive.id] = '';
    this.api.respondToDirective(directive.id, form.value).subscribe({
      next: () => {
        directive.status = 'responded';
        this.loading_[directive.id] = false;
      },
      error: (e) => {
        this.errors[directive.id] = e.error?.message ?? 'Failed to submit response';
        this.loading_[directive.id] = false;
      },
    });
  }
}
