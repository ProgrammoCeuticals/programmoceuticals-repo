import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import type { LookupItem } from '../../../core/models';

const LOOKUP_TYPES = [
  'nti_drug', 'bcs_class', 'assessor_reference', 'pharmacological_class',
  'dosage_form', 'final_decision', 'review_status', 'local_foreign',
  'product_classification_reference', 'manufacturer',
];

@Component({
  selector: 'app-lookup-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageHeaderComponent],
  template: `
    <app-page-header title="Lookup List Management" />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Add lookup -->
      <div class="card">
        <h3 class="font-semibold text-gray-800 mb-4">Add Lookup Item</h3>
        <form [formGroup]="form" (ngSubmit)="create()">
          <div class="mb-3">
            <label class="form-label">Type *</label>
            <select formControlName="type" class="form-input" (change)="filterByType()">
              <option value="">Select type...</option>
              <option *ngFor="let t of types" [value]="t">{{ t }}</option>
            </select>
          </div>
          <div class="mb-3"><label class="form-label">Label *</label><input type="text" formControlName="label" class="form-input" /></div>
          <div class="mb-3"><label class="form-label">Value</label><input type="text" formControlName="value" class="form-input" placeholder="Defaults to label" /></div>
          <div class="mb-4"><label class="form-label">Description</label><input type="text" formControlName="description" class="form-input" /></div>
          <button type="submit" class="btn-primary w-full" [disabled]="saving">{{ saving ? 'Saving...' : 'Add Item' }}</button>
        </form>

        <div class="mt-6 border-t pt-4">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Bulk Import (JSON)</h4>
          <textarea [(ngModel)]="importJson" [ngModelOptions]="{standalone: true}" class="form-input text-xs" rows="4"
            placeholder='[{"type":"nti_drug","label":"Warfarin"}]'></textarea>
          <button (click)="bulkImport()" class="btn-secondary w-full mt-2" [disabled]="importing">
            {{ importing ? 'Importing...' : 'Import' }}
          </button>
          <p *ngIf="importResult" class="text-xs text-green-600 mt-1">{{ importResult }}</p>
        </div>
      </div>

      <!-- List -->
      <div class="lg:col-span-2">
        <div class="mb-3 flex gap-2 flex-wrap">
          <button *ngFor="let t of types" (click)="selectedType = t; filterByType()"
            class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
            [class.bg-primary-700]="selectedType === t" [class.text-white]="selectedType === t"
            [class.bg-gray-100]="selectedType !== t" [class.text-gray-600]="selectedType !== t">
            {{ t }}
          </button>
        </div>
        <div class="card p-0 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b">
                <th class="px-4 py-3 text-left font-medium text-gray-600">Label</th>
                <th class="px-4 py-3 text-left font-medium text-gray-600">Value</th>
                <th class="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of filtered" class="border-b hover:bg-gray-50">
                <td class="px-4 py-3 text-gray-800">{{ item.label }}</td>
                <td class="px-4 py-3 text-gray-500 text-xs">{{ item.value }}</td>
                <td class="px-4 py-3">
                  <span class="badge" [class.bg-green-100]="item.isActive" [class.text-green-700]="item.isActive"
                    [class.bg-gray-100]="!item.isActive" [class.text-gray-500]="!item.isActive">
                    {{ item.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <button *ngIf="item.isActive" (click)="deactivate(item)" class="text-xs text-red-500 hover:underline">Deactivate</button>
                </td>
              </tr>
              <tr *ngIf="filtered.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-gray-400">No items.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class LookupManagementComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  types = LOOKUP_TYPES;
  items: LookupItem[] = [];
  filtered: LookupItem[] = [];
  selectedType = LOOKUP_TYPES[0];
  saving = false;
  importing = false;
  importJson = '';
  importResult = '';

  form = this.fb.group({
    type: ['', Validators.required],
    label: ['', Validators.required],
    value: [''],
    description: [''],
  });

  ngOnInit() {
    this.api.getLookups(undefined, false).subscribe(({ lookupItems }) => {
      this.items = lookupItems;
      this.filterByType();
    });
  }

  filterByType() {
    this.filtered = this.items.filter((i) => i.type === this.selectedType);
  }

  create() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.api.createLookup(this.form.value).subscribe({
      next: ({ lookup }) => { this.items.unshift(lookup); this.filterByType(); this.form.reset(); this.saving = false; },
      error: () => (this.saving = false),
    });
  }

  deactivate(item: LookupItem) {
    this.api.deactivateLookup(item.id).subscribe(() => { item.isActive = false; });
  }

  bulkImport() {
    try {
      const items = JSON.parse(this.importJson);
      this.importing = true;
      this.api.importLookups(items).subscribe({
        next: (res: any) => {
          this.importResult = `Imported ${res.imported} items`;
          this.importing = false;
          this.ngOnInit();
        },
        error: () => (this.importing = false),
      });
    } catch { this.importResult = 'Invalid JSON'; }
  }
}
