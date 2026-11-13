import { Component, OnInit, Output, EventEmitter, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../api.service";
import { MailTableComponent } from "../shared/mail-table.component";
import { ALL_STATUSES, pretty } from "../models";
import type { Mail } from "../models";

@Component({
  selector: "app-mail-list",
  standalone: true,
  imports: [CommonModule, FormsModule, MailTableComponent],
  template: `
    <div class="space-y-4">
      <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="grid gap-3 md:grid-cols-[1fr_220px]">
          <input placeholder="Search code, applicant, subject" [(ngModel)]="search" (ngModelChange)="load()" />
          <select [(ngModel)]="status" (ngModelChange)="load()">
            <option value="">All statuses</option>
            <option *ngFor="let s of statuses" [value]="s">{{ pretty(s) }}</option>
          </select>
        </div>
      </section>
      <app-mail-table [mails]="mails()" (open)="openMail.emit($event)" />
    </div>
  `
})
export class MailListComponent implements OnInit {
  @Output() openMail = new EventEmitter<string>();

  mails = signal<Mail[]>([]);
  search = "";
  status = "";
  readonly statuses = ALL_STATUSES;
  readonly pretty = pretty;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    const params: Record<string, string> = {};
    if (this.search) params["search"] = this.search;
    if (this.status) params["status"] = this.status;
    this.api.getMails(params).subscribe({ next: (mails) => this.mails.set(mails) });
  }
}
