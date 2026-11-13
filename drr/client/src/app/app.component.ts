import { Component, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "./auth.service";
import { LoginComponent } from "./auth/login.component";
import { SidebarComponent } from "./layout/sidebar.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MailListComponent } from "./mails/mail-list.component";
import { MailCreateComponent } from "./mails/mail-create.component";
import { MailDetailComponent } from "./mails/mail-detail.component";
import { UsersComponent } from "./admin/users.component";
import { DivisionsComponent } from "./admin/divisions.component";
import { pretty } from "./models";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    SidebarComponent,
    DashboardComponent,
    MailListComponent,
    MailCreateComponent,
    MailDetailComponent,
    UsersComponent,
    DivisionsComponent
  ],
  template: `
    <app-login *ngIf="!auth.isLoggedIn()" />

    <div *ngIf="auth.isLoggedIn()" class="min-h-screen">
      <app-sidebar
        [user]="auth.user()!"
        [activePage]="page()"
        (navigate)="setPage($event)"
        (signOut)="auth.logout()"
      />

      <main class="lg:pl-64">
        <header class="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-forest">Office workflow</p>
            <h2 class="text-xl font-bold text-navy">{{ pretty(page()) }}</h2>
          </div>
          <div class="text-right text-sm">
            <p class="font-semibold text-slate-800">{{ auth.user()!.name }}</p>
            <p class="text-slate-500">{{ auth.user()!.division?.name || pretty(auth.user()!.role) }}</p>
          </div>
        </header>

        <section class="p-5">
          <app-dashboard *ngIf="page() === 'dashboard'" (openMail)="openMail($event)" />
          <app-mail-list *ngIf="page() === 'mails'" (openMail)="openMail($event)" />
          <app-mail-create *ngIf="page() === 'create-mail'" (created)="openMail($event)" />
          <app-mail-detail *ngIf="page() === 'detail'" [mailId]="selectedMailId()" [currentUser]="auth.user()!" />
          <app-users *ngIf="page() === 'users'" />
          <app-divisions *ngIf="page() === 'divisions'" [isAdmin]="auth.user()!.role === 'ADMIN'" />
        </section>
      </main>
    </div>
  `
})
export class AppComponent {
  readonly pretty = pretty;
  page = signal("dashboard");
  selectedMailId = signal("");

  constructor(readonly auth: AuthService) {}

  setPage(p: string) {
    this.page.set(p);
  }

  openMail(id: string) {
    this.selectedMailId.set(id);
    this.page.set("detail");
  }
}
