import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="grid min-h-screen place-items-center bg-slate-50 p-6">
      <form (ngSubmit)="submit()" class="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p class="text-sm font-semibold text-forest">Regulatory Office</p>
        <h1 class="mt-1 text-3xl font-bold text-navy">Office Mail Tracking</h1>
        <div class="mt-8 space-y-4">
          <label>Email<input name="email" type="email" [(ngModel)]="email" required /></label>
          <label>Password<input name="password" type="password" [(ngModel)]="password" required /></label>
          <p *ngIf="error()" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error() }}</p>
          <button type="submit" [disabled]="loading()" class="w-full bg-navy text-white hover:bg-slate-800 disabled:opacity-50">
            {{ loading() ? "Signing in…" : "Sign in" }}
          </button>
        </div>
      </form>
    </main>
  `
})
export class LoginComponent {
  email = "mailroom@example.com";
  password = "Password123!";
  error = signal("");
  loading = signal(false);

  constructor(private auth: AuthService) {}

  submit() {
    this.error.set("");
    this.loading.set(true);
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        this.error.set(err.error?.message ?? "Login failed");
        this.loading.set(false);
      }
    });
  }
}
