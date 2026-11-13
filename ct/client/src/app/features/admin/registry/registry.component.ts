import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import type { Application } from '../../../core/models';

@Component({
  selector: 'app-registry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PageHeaderComponent, StatusBadgeComponent, SpinnerComponent],
  template: `
    <app-page-header title="Application Registry" subtitle="Excel-like tracking table" />

    <!-- Filters -->
    <div class="card mb-4">
      <form [formGroup]="filterForm" (ngSubmit)="load()">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div><label class="form-label text-xs">Product Name</label><input type="text" formControlName="productName" class="form-input" /></div>
          <div><label class="form-label text-xs">Application No.</label><input type="text" formControlName="applicationNo" class="form-input" /></div>
          <div>
            <label class="form-label text-xs">Review Status</label>
            <select formControlName="reviewStatus" class="form-input">
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label class="form-label text-xs">Final Decision</label>
            <select formControlName="finalDecision" class="form-input">
              <option value="">All</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="CD">CD</option>
            </select>
          </div>
        </div>
        <!-- Advanced filters (collapsible) -->
        <div *ngIf="showAdvanced" class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 pt-3 border-t border-gray-100">
          <div>
            <label class="form-label text-xs">NTI Class</label>
            <select formControlName="therapeuticIndexClass" class="form-input">
              <option value="">All</option>
              <option value="NTI">NTI</option>
              <option value="Non-NTI">Non-NTI</option>
              <option value="Mixed">Mixed</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
          <div>
            <label class="form-label text-xs">BCS Class</label>
            <select formControlName="bcsClass" class="form-input">
              <option value="">All</option>
              <option *ngFor="let c of ['Class I','Class II','Class III','Class IV','Unknown','Not Applicable']" [value]="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label class="form-label text-xs">Local / Foreign</label>
            <select formControlName="localOrForeign" class="form-input">
              <option value="">All</option>
              <option value="Local">Local</option>
              <option value="Foreign">Foreign</option>
            </select>
          </div>
          <div><label class="form-label text-xs">Pharmacological Class</label><input type="text" formControlName="pharmacologicalClass" class="form-input" /></div>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button type="submit" class="btn-primary">Filter</button>
          <button type="button" class="btn-secondary" (click)="reset()">Reset</button>
          <button type="button" class="btn-secondary" (click)="showAdvanced = !showAdvanced">
            {{ showAdvanced ? 'Hide Advanced' : 'Advanced Filters' }}
          </button>
          <button type="button" class="btn-secondary ml-auto" (click)="exportExcel()" [disabled]="exporting">{{ exporting ? 'Exporting...' : 'Export Excel' }}</button>
          <button type="button" class="btn-secondary" (click)="exportCSV()" [disabled]="exporting">{{ exporting ? '...' : 'Export CSV' }}</button>
        </div>
      </form>
    </div>

    <!-- Table -->
    <app-spinner *ngIf="loading" message="Loading registry..." />
    <div *ngIf="!loading" class="card p-0 overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 text-left border-b">
            <th class="px-4 py-3 font-medium text-gray-600">S/N</th>
            <th class="px-4 py-3 font-medium text-gray-600">Application No.</th>
            <th class="px-4 py-3 font-medium text-gray-600">Product</th>
            <th class="px-4 py-3 font-medium text-gray-600">Strength & Form</th>
            <th class="px-4 py-3 font-medium text-gray-600">Review Status</th>
            <th class="px-4 py-3 font-medium text-gray-600">Final Decision</th>
            <th class="px-4 py-3 font-medium text-gray-600">Status</th>
            <th class="px-4 py-3 font-medium text-gray-600">Last Updated</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let app of applications; let i = index" class="border-b hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-500">{{ i + 1 }}</td>
            <td class="px-4 py-3 font-mono text-xs">{{ app.applicationNo }}</td>
            <td class="px-4 py-3 font-medium text-gray-800">{{ app.productName }}</td>
            <td class="px-4 py-3 text-gray-600">{{ app.strengthAndDosageForm }}</td>
            <td class="px-4 py-3"><app-status-badge [status]="app.reviewStatus" /></td>
            <td class="px-4 py-3"><app-status-badge *ngIf="app.finalDecision" [status]="app.finalDecision!" /></td>
            <td class="px-4 py-3"><app-status-badge [status]="app.currentStatus" /></td>
            <td class="px-4 py-3 text-xs text-gray-400">{{ app.updatedAt | date:'mediumDate' }}</td>
            <td class="px-4 py-3">
              <a [routerLink]="['/admin/applications', app.id]" class="text-primary-600 text-xs hover:underline">View</a>
            </td>
          </tr>
          <tr *ngIf="applications.length === 0">
            <td colspan="9" class="px-4 py-8 text-center text-gray-400">No applications found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class RegistryComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  applications: Application[] = [];
  loading = false;
  exporting = false;
  showAdvanced = false;

  filterForm = this.fb.group({
    productName: [''], applicationNo: [''], reviewStatus: [''], finalDecision: [''],
    therapeuticIndexClass: [''], bcsClass: [''], localOrForeign: [''], pharmacologicalClass: [''],
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params = Object.fromEntries(
      Object.entries(this.filterForm.value).filter(([, v]) => v),
    );
    this.api.getRegistry(params).subscribe({
      next: ({ applications }) => { this.applications = applications; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  reset() { this.filterForm.reset(); this.load(); }

  exportExcel() {
    this.exporting = true;
    const params = Object.fromEntries(Object.entries(this.filterForm.value).filter(([, v]) => v));
    this.api.exportRegistryExcel(params).subscribe({
      next: (blob) => { this.download(blob, 'registry.xlsx'); this.exporting = false; },
      error: () => (this.exporting = false),
    });
  }

  exportCSV() {
    this.exporting = true;
    const params = Object.fromEntries(Object.entries(this.filterForm.value).filter(([, v]) => v));
    this.api.exportRegistryCSV(params).subscribe({
      next: (blob) => { this.download(blob, 'registry.csv'); this.exporting = false; },
      error: () => (this.exporting = false),
    });
  }

  private download(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
}
