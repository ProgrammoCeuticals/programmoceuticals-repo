import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ReplaceUnderscorePipe } from '../../../shared/pipes/replace-underscore.pipe';
import type { AuditLog } from '../../../core/models';

@Component({
  selector: 'app-audit-trail',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ReplaceUnderscorePipe],
  template: `
    <app-page-header title="Audit Trail" subtitle="All system actions" />
    <div class="card p-0 overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b">
            <th class="px-4 py-3 text-left font-medium text-gray-600">Time</th>
            <th class="px-4 py-3 text-left font-medium text-gray-600">Action</th>
            <th class="px-4 py-3 text-left font-medium text-gray-600">Entity</th>
            <th class="px-4 py-3 text-left font-medium text-gray-600">Actor</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let log of logs" class="border-b hover:bg-gray-50">
            <td class="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{{ log.createdAt | date:'short' }}</td>
            <td class="px-4 py-3 font-medium text-gray-700">{{ log.action | replaceUnderscore }}</td>
            <td class="px-4 py-3 text-gray-500 text-xs">{{ log.entityType ?? '—' }}</td>
            <td class="px-4 py-3 text-gray-500 text-xs font-mono">{{ log.actorUserId ?? '—' }}</td>
          </tr>
          <tr *ngIf="logs.length === 0">
            <td colspan="4" class="px-4 py-8 text-center text-gray-400">No audit logs.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class AuditTrailComponent implements OnInit {
  private api = inject(ApiService);
  logs: AuditLog[] = [];

  ngOnInit() {
    this.api.getAuditLogs().subscribe(({ auditLogs }) => (this.logs = auditLogs));
  }
}
