import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div class="w-full max-w-2xl">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-primary-900">BE Assessment System</h1>
          <p class="text-gray-500 mt-2">Applicant Registration</p>
        </div>
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-800 mb-6">Create your account</h2>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Full Name *</label>
                <input type="text" formControlName="fullName" class="form-input" />
              </div>
              <div>
                <label class="form-label">Email *</label>
                <input type="email" formControlName="email" class="form-input" />
              </div>
              <div>
                <label class="form-label">Phone</label>
                <input type="tel" formControlName="phone" class="form-input" />
              </div>
              <div>
                <label class="form-label">Password *</label>
                <input type="password" formControlName="password" class="form-input" />
              </div>
              <div class="md:col-span-2 border-t pt-4 mt-2">
                <p class="text-sm font-semibold text-gray-700 mb-3">Company Information</p>
              </div>
              <div>
                <label class="form-label">Company Name *</label>
                <input type="text" formControlName="companyName" class="form-input" />
              </div>
              <div>
                <label class="form-label">RC Number</label>
                <input type="text" formControlName="rcNumber" class="form-input" />
              </div>
              <div>
                <label class="form-label">Contact Person Name</label>
                <input type="text" formControlName="contactPersonName" class="form-input" />
              </div>
              <div>
                <label class="form-label">Contact Person Title</label>
                <input type="text" formControlName="contactPersonTitle" class="form-input" />
              </div>
              <div>
                <label class="form-label">Company Email</label>
                <input type="email" formControlName="companyEmail" class="form-input" />
              </div>
              <div>
                <label class="form-label">Company Phone</label>
                <input type="tel" formControlName="companyPhone" class="form-input" />
              </div>
              <div class="md:col-span-2">
                <label class="form-label">Company Address</label>
                <textarea formControlName="companyAddress" class="form-input" rows="2"></textarea>
              </div>
              <div class="md:col-span-2">
                <label class="form-label">Market Authorisation Holder</label>
                <input type="text" formControlName="marketAuthorisationHolder" class="form-input" />
              </div>
            </div>
            <p *ngIf="error" class="mt-4 text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">{{ error }}</p>
            <button type="submit" class="btn-primary w-full mt-6" [disabled]="loading">
              {{ loading ? 'Creating account...' : 'Create account' }}
            </button>
          </form>
          <p class="mt-4 text-center text-sm text-gray-500">
            Already have an account?
            <a routerLink="/login" class="text-primary-600 font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    companyName: ['', Validators.required],
    rcNumber: [''],
    contactPersonName: [''],
    contactPersonTitle: [''],
    companyEmail: [''],
    companyPhone: [''],
    companyAddress: [''],
    marketAuthorisationHolder: [''],
  });

  loading = false;
  error = '';

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.auth.registerApplicant(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e) => { this.error = e.error?.message ?? 'Registration failed'; this.loading = false; },
    });
  }
}
