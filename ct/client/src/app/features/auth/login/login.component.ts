import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-primary-900">BE Assessment System</h1>
          <p class="text-gray-500 mt-2">NAFDAC Bioequivalence Submission Portal</p>
        </div>
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">Sign in to your account</h2>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="mb-4">
              <label class="form-label">Email address</label>
              <input type="email" formControlName="email" class="form-input" placeholder="you@example.com" />
              <p *ngIf="form.get('email')?.touched && form.get('email')?.invalid" class="form-error">
                Valid email is required
              </p>
            </div>
            <div class="mb-6">
              <label class="form-label">Password</label>
              <input type="password" formControlName="password" class="form-input" placeholder="••••••••" />
              <p *ngIf="form.get('password')?.touched && form.get('password')?.invalid" class="form-error">
                Password is required
              </p>
            </div>
            <p *ngIf="error" class="mb-4 text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">{{ error }}</p>
            <button type="submit" class="btn-primary w-full" [disabled]="loading">
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </form>
          <p class="mt-4 text-center text-sm text-gray-500">
            New applicant?
            <a routerLink="/register" class="text-primary-600 font-medium hover:underline">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = false;
  error = '';

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: (res) => {
        const role = res.user.role;
        if (role === 'admin' || role === 'super_admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'assessor') {
          this.router.navigate(['/assessor/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (e) => { this.error = e.error?.message ?? 'Login failed'; this.loading = false; },
    });
  }
}
