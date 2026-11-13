import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-new-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent],
  template: `
    <app-page-header title="New BE Submission" subtitle="Create a draft application to begin filling the checklist" />
    <div class="max-w-lg">
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="mb-4">
            <label class="form-label">Product Name *</label>
            <input type="text" formControlName="productName" class="form-input" />
          </div>
          <div class="mb-4">
            <label class="form-label">Strength</label>
            <input type="text" formControlName="strength" class="form-input" placeholder="e.g. 500mg" />
          </div>
          <div class="mb-4">
            <label class="form-label">Dosage Form</label>
            <input type="text" formControlName="dosageForm" class="form-input" placeholder="e.g. Tablet" />
          </div>
          <p *ngIf="error" class="mb-4 text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">{{ error }}</p>
          <div class="flex gap-3">
            <button type="submit" class="btn-primary" [disabled]="loading">
              {{ loading ? 'Creating...' : 'Create Draft' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class NewApplicationComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

  form = this.fb.group({
    productName: ['', Validators.required],
    strength: [''],
    dosageForm: [''],
  });

  loading = false;
  error = '';

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.api.createApplication(this.form.value).subscribe({
      next: ({ application }) => this.router.navigate(['/applications', application.id], { queryParams: { tab: 'checklist' } }),
      error: (e) => { this.error = e.error?.message ?? 'Failed to create application'; this.loading = false; },
    });
  }
}
