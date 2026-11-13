import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { pretty } from "../models";
import type { User } from "../models";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-5 lg:flex lg:flex-col">
      <div class="flex items-center gap-3 mb-1">
        <img src="/nafdac-logo.webp" alt="NAFDAC" class="h-10 w-10 object-contain" />
        <div>
          <h1 class="text-xl font-bold text-navy">Mail Tracking</h1>
          <p class="mt-0 text-xs text-slate-500">{{ pretty(user.role) }}</p>
        </div>
      </div>
      <nav class="mt-8 flex-1 space-y-1">
        <button *ngFor="let item of navItems" (click)="navigate.emit(item.page)"
          [class.bg-emerald-50]="activePage === item.page"
          class="block w-full text-left text-slate-700 hover:bg-slate-50 rounded-md px-3 py-2 text-sm font-medium">
          {{ item.label }}
        </button>
      </nav>
      <button (click)="signOut.emit()" class="border border-slate-300 text-slate-700 hover:bg-slate-50 w-full">
        Sign out
      </button>
    </aside>
  `
})
export class SidebarComponent {
  @Input() user!: User;
  @Input() activePage = "dashboard";
  @Output() navigate = new EventEmitter<string>();
  @Output() signOut = new EventEmitter<void>();

  readonly pretty = pretty;

  get navItems() {
    const items = [
      { page: "dashboard", label: "Dashboard" },
      { page: "mails", label: "Mails" }
    ];
    if (this.user.role === "MAIL_ROOM" || this.user.role === "ADMIN") {
      items.push({ page: "create-mail", label: "Create Mail" });
    }
    items.push({ page: "divisions", label: "Divisions" });
    if (this.user.role === "ADMIN") {
      items.push({ page: "users", label: "Users" });
    }
    return items;
  }
}
