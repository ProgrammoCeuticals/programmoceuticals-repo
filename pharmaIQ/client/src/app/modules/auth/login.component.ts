import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="auth-root">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="auth-logo-icon">
            <svg width="16" height="16" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <div>
            <div class="wordmark" style="color: var(--navy)">Pharma<span style="color: var(--text-muted)">Care</span></div>
          </div>
        </div>

        <p class="auth-title">Sign In</p>
        <p class="auth-subtitle">Patient & Pharmacy Management System</p>

        <form class="auth-form" (ngSubmit)="onLogin()">
          <div>
            <label class="field-label">Email</label>
            <input class="inp" type="email" [(ngModel)]="email" name="email" required placeholder="admin@pharmacare.local" />
          </div>
          <div>
            <label class="field-label">Password</label>
            <input class="inp" type="password" [(ngModel)]="password" name="password" required placeholder="••••••••" />
          </div>
          <div *ngIf="errorMsg" class="alert alert-error">{{ errorMsg }}</div>
          <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center" [disabled]="loading">
            {{ loading ? 'Signing in…' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.errorMsg = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMsg = err.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}
