import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

const BASE = 'http://localhost:4000/api/v1';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent],
  template: `
    <app-page-header title="My Profile" subtitle="Edit your details and change your password" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">

      <!-- Profile details -->
      <div class="card">
        <h3 class="font-semibold text-gray-800 mb-4">Personal Details</h3>
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
          <div class="mb-4">
            <label class="form-label">Full Name *</label>
            <input type="text" formControlName="fullName" class="form-input" />
            <p *ngIf="profileForm.get('fullName')?.touched && profileForm.get('fullName')?.invalid" class="form-error">
              Full name is required
            </p>
          </div>
          <div class="mb-4">
            <label class="form-label">Email</label>
            <input type="email" [value]="auth.user()?.email ?? ''" class="form-input bg-gray-50" disabled />
            <p class="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div class="mb-4">
            <label class="form-label">Phone</label>
            <input type="tel" formControlName="phone" class="form-input" placeholder="+234..." />
          </div>
          <div class="mb-5">
            <label class="form-label">Role</label>
            <input type="text" [value]="(auth.user()?.role ?? '') | titlecase" class="form-input bg-gray-50" disabled />
          </div>
          <p *ngIf="profileError" class="text-sm text-red-600 mb-3">{{ profileError }}</p>
          <p *ngIf="profileSuccess" class="text-sm text-green-600 mb-3">Profile updated ✓</p>
          <button type="submit" class="btn-primary" [disabled]="profileSaving">
            {{ profileSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </form>
      </div>

      <!-- Change password -->
      <div class="card">
        <h3 class="font-semibold text-gray-800 mb-4">Change Password</h3>
        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
          <div class="mb-4">
            <label class="form-label">Current Password *</label>
            <input type="password" formControlName="currentPassword" class="form-input" />
          </div>
          <div class="mb-4">
            <label class="form-label">New Password *</label>
            <input type="password" formControlName="newPassword" class="form-input" />
            <p *ngIf="passwordForm.get('newPassword')?.touched && passwordForm.get('newPassword')?.invalid" class="form-error">
              Minimum 8 characters
            </p>
          </div>
          <div class="mb-5">
            <label class="form-label">Confirm New Password *</label>
            <input type="password" formControlName="confirmPassword" class="form-input" />
            <p *ngIf="passwordForm.errors?.['mismatch'] && passwordForm.get('confirmPassword')?.touched" class="form-error">
              Passwords do not match
            </p>
          </div>
          <p *ngIf="passwordError" class="text-sm text-red-600 mb-3">{{ passwordError }}</p>
          <p *ngIf="passwordSuccess" class="text-sm text-green-600 mb-3">Password changed ✓</p>
          <button type="submit" class="btn-primary" [disabled]="passwordSaving">
            {{ passwordSaving ? 'Changing...' : 'Change Password' }}
          </button>
        </form>
      </div>

    </div>
  `,
})
export class ProfileComponent implements OnInit {
  auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  profileSaving = false;
  profileError = '';
  profileSuccess = false;
  passwordSaving = false;
  passwordError = '';
  passwordSuccess = false;

  profileForm = this.fb.group({
    fullName: ['', Validators.required],
    phone: [''],
  });

  passwordForm = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: (g) =>
        g.get('newPassword')?.value !== g.get('confirmPassword')?.value ? { mismatch: true } : null,
    },
  );

  ngOnInit() {
    const user = this.auth.user();
    if (user) this.profileForm.patchValue({ fullName: user.fullName, phone: user.phone ?? '' });
  }

  saveProfile() {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    this.profileSaving = true;
    this.profileError = '';
    this.profileSuccess = false;
    this.http.patch(`${BASE}/users/me`, this.profileForm.value).subscribe({
      next: () => {
        this.auth.loadCurrentUser().subscribe();
        this.profileSuccess = true;
        this.profileSaving = false;
        setTimeout(() => (this.profileSuccess = false), 3000);
      },
      error: (e) => { this.profileError = e.error?.message ?? 'Failed to update'; this.profileSaving = false; },
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    this.passwordSaving = true;
    this.passwordError = '';
    this.passwordSuccess = false;
    const { currentPassword, newPassword } = this.passwordForm.value;
    this.http.patch(`${BASE}/users/me/password`, { currentPassword, newPassword }).subscribe({
      next: () => {
        this.passwordSuccess = true;
        this.passwordSaving = false;
        this.passwordForm.reset();
        setTimeout(() => (this.passwordSuccess = false), 3000);
      },
      error: (e) => { this.passwordError = e.error?.message ?? 'Failed to change password'; this.passwordSaving = false; },
    });
  }
}
