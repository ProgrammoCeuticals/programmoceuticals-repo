import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <app-page-header title="Reports" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Assessor Workload -->
      <div class="card">
        <h3 class="font-semibold text-gray-800 mb-4">Assessor Workload</h3>
        <div *ngIf="workload.length === 0" class="text-gray-400 text-sm">No data.</div>
        <div *ngFor="let row of workload" class="mb-4 pb-4 border-b last:border-0">
          <p class="font-medium text-gray-800">{{ row.assessor.fullName }}</p>
          <p class="text-xs text-gray-500 mb-2">{{ row.assessor.email }}</p>
          <div class="grid grid-cols-3 gap-2 text-center text-xs">
            <div class="bg-blue-50 rounded p-2"><p class="font-bold text-blue-700">{{ row.ongoing }}</p><p class="text-gray-500">Ongoing</p></div>
            <div class="bg-green-50 rounded p-2"><p class="font-bold text-green-700">{{ row.completed }}</p><p class="text-gray-500">Completed</p></div>
            <div class="bg-gray-50 rounded p-2"><p class="font-bold text-gray-700">{{ row.total }}</p><p class="text-gray-500">Total</p></div>
          </div>
        </div>
      </div>

      <!-- Compliance Directives -->
      <div class="card">
        <h3 class="font-semibold text-gray-800 mb-4">Compliance Directives Summary</h3>
        <div *ngIf="cdSummary" class="grid grid-cols-2 gap-3 mb-4">
          <div class="bg-gray-50 rounded p-3 text-center"><p class="text-2xl font-bold text-gray-700">{{ cdSummary.total }}</p><p class="text-xs text-gray-500">Total</p></div>
          <div class="bg-orange-50 rounded p-3 text-center"><p class="text-2xl font-bold text-orange-600">{{ cdSummary.open }}</p><p class="text-xs text-gray-500">Open</p></div>
          <div class="bg-blue-50 rounded p-3 text-center"><p class="text-2xl font-bold text-blue-600">{{ cdSummary.responded }}</p><p class="text-xs text-gray-500">Responded</p></div>
          <div class="bg-green-50 rounded p-3 text-center"><p class="text-2xl font-bold text-green-600">{{ cdSummary.closed }}</p><p class="text-xs text-gray-500">Closed</p></div>
        </div>
      </div>

    </div>
  `,
})
export class ReportsComponent implements OnInit {
  private api = inject(ApiService);
  workload: any[] = [];
  cdSummary: any = null;

  ngOnInit() {
    this.api.getAssessorWorkloadReport().subscribe(({ report }) => (this.workload = report as any[]));
    this.api.getComplianceDirectiveReport().subscribe(({ summary }) => (this.cdSummary = summary));
  }
}
