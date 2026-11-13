import { Component, OnInit, Output, EventEmitter, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiService } from "../api.service";
import { MailTableComponent } from "../shared/mail-table.component";
import { ALL_STATUSES, pretty } from "../models";
import type { DashboardSummary } from "../models";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, MailTableComponent],
  template: `
    <div *ngIf="summary()" class="space-y-6">
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">Total mails</p>
          <p class="mt-2 text-3xl font-bold text-navy">{{ summary()!.total }}</p>
        </div>
        <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">Overdue / Inactive</p>
          <p class="mt-2 text-3xl font-bold text-red-600">{{ summary()!.overdueInactive }}</p>
        </div>
        <div *ngFor="let status of statuses" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">{{ pretty(status) }}</p>
          <p class="mt-2 text-3xl font-bold text-navy">{{ summary()!.counts[status] || 0 }}</p>
        </div>
      </div>
      <app-mail-table [mails]="summary()!.recentMails" (open)="openMail.emit($event)" />
    </div>
    <p *ngIf="error()" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error() }}</p>
    <p *ngIf="!summary() && !error()" class="text-slate-400">Loading dashboard…</p>
  `
})
export class DashboardComponent implements OnInit {
  @Output() openMail = new EventEmitter<string>();

  summary = signal<DashboardSummary | null>(null);
  error = signal("");
  readonly statuses = ALL_STATUSES;
  readonly pretty = pretty;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getSummary().subscribe({
      next: (s) => this.summary.set(s),
      error: (err) => this.error.set(err.error?.message ?? "Failed to load dashboard")
    });
  }
}
