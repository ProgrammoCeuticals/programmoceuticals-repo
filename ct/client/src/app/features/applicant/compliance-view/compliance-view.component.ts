import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import type { ComplianceDirective } from '../../../core/models';

@Component({
  selector: 'app-compliance-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <app-page-header title="Compliance Directives" />
    <div class="space-y-4">
      <div *ngFor="let d of directives" class="card">
        <div class="flex items-start justify-between mb-3">
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
        <div *ngIf="d.affectedSections?.length" class="text-xs text-gray-500 mb-3">
          Affected sections: {{ d.affectedSections.join(', ') }}
        </div>

        <!-- Respond form -->
        <div *ngIf="d.status === 'open'" class="border-t pt-4 mt-4">
          <p class="text-sm font-medium text-gray-700 mb-3">Submit your response</p>
          <form [formGroup]="getForm(d.id)" (ngSubmit)="respond(d.id)">
            <div class="mb-3">
              <label class="form-label">Response message *</label>
              <textarea formControlName="responseMessage" class="form-input" rows="3"
                placeholder="Describe the corrections made..."></textarea>
            </div>
            <p *ngIf="errors[d.id]" class="text-sm text-red-600 mb-2">{{ errors[d.id] }}</p>
            <button type="submit" class="btn-primary" [disabled]="loading[d.id]">
              {{ loading[d.id] ? 'Submitting...' : 'Submit Response' }}
            </button>
          </form>
        </div>
      </div>
      <div *ngIf="directives.length === 0" class="card text-center text-gray-400 py-12">
        No compliance directives for this application.
      </div>
    </div>
  `,
})
export class ComplianceViewComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  directives: ComplianceDirective[] = [];
  forms: Record<string, ReturnType<FormBuilder['group']>> = {};
  loading: Record<string, boolean> = {};
  errors: Record<string, string> = {};

  ngOnInit() {
    const appId = this.route.snapshot.paramMap.get('applicationId')!;
    this.api.getDirectives(appId).subscribe(({ directives }) => {
      this.directives = directives;
      directives.forEach((d) => {
        this.forms[d.id] = this.fb.group({ responseMessage: ['', Validators.required] });
      });
    });
  }

  getForm(id: string) { return this.forms[id]; }

  respond(directiveId: string) {
    const form = this.forms[directiveId];
    if (form.invalid) { form.markAllAsTouched(); return; }
    this.loading[directiveId] = true;
    this.api.respondToDirective(directiveId, form.value).subscribe({
      next: () => {
        const d = this.directives.find((x) => x.id === directiveId);
        if (d) d.status = 'responded';
        this.loading[directiveId] = false;
      },
      error: (e) => { this.errors[directiveId] = e.error?.message ?? 'Failed'; this.loading[directiveId] = false; },
    });
  }
}
