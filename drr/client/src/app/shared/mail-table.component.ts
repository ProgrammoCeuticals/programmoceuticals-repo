import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { pretty, statusClass } from "../models";
import type { Mail } from "../models";

@Component({
  selector: "app-mail-table",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 class="mb-4 text-lg font-bold text-navy">Mails</h3>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[860px] text-left text-sm">
          <thead class="border-b text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="py-3">Code</th>
              <th>Company / Applicant</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Target Division</th>
              <th>Current Holder</th>
              <th>Last Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of mails" class="border-b border-slate-100">
              <td class="py-3 font-semibold text-navy">{{ item.code }}</td>
              <td>{{ item.companyApplicant }}</td>
              <td class="max-w-xs truncate">{{ item.subject }}</td>
              <td><span class="badge" [ngClass]="statusClass(item.status)">{{ pretty(item.status) }}</span></td>
              <td>{{ item.targetDivision?.name || "-" }}</td>
              <td>{{ item.currentHolder?.name || "-" }}</td>
              <td>{{ item.updatedAt | date }}</td>
              <td><button (click)="open.emit(item.id)" class="border border-slate-300 text-navy hover:bg-slate-50">Open</button></td>
            </tr>
            <tr *ngIf="!mails.length">
              <td colspan="8" class="py-6 text-center text-slate-400">No mails found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class MailTableComponent {
  @Input() mails: Mail[] = [];
  @Output() open = new EventEmitter<string>();

  readonly pretty = pretty;
  readonly statusClass = statusClass;
}
