import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import type { User } from '../../../core/models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, ConfirmDialogComponent],
  template: `
    <app-page-header title="User Management" />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Create user -->
      <div class="card">
        <h3 class="font-semibold text-gray-800 mb-4">Add User</h3>
        <form [formGroup]="createForm" (ngSubmit)="createUser()">
          <div class="mb-3"><label class="form-label">Full Name *</label><input type="text" formControlName="fullName" class="form-input" /></div>
          <div class="mb-3"><label class="form-label">Email *</label><input type="email" formControlName="email" class="form-input" /></div>
          <div class="mb-3"><label class="form-label">Password *</label><input type="password" formControlName="password" class="form-input" /></div>
          <div class="mb-4">
            <label class="form-label">Role *</label>
            <select formControlName="role" class="form-input">
              <option value="">Select role...</option>
              <option value="assessor">Assessor</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <p *ngIf="createError" class="text-sm text-red-600 mb-2">{{ createError }}</p>
          <button type="submit" class="btn-primary w-full" [disabled]="creating">
            {{ creating ? 'Adding...' : 'Add User' }}
          </button>
        </form>
      </div>

      <!-- Users list -->
      <div class="lg:col-span-2 card p-0 overflow-hidden">
        <!-- Filter -->
        <div class="px-4 py-3 border-b border-gray-100 flex gap-2">
          <button *ngFor="let r of roleFilters" (click)="activeRole = r; filterUsers()"
            class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
            [class.bg-primary-700]="activeRole === r" [class.text-white]="activeRole === r"
            [class.bg-gray-100]="activeRole !== r" [class.text-gray-600]="activeRole !== r">
            {{ r === 'all' ? 'All' : r.replace('_', ' ') | titlecase }}
          </button>
        </div>
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b">
              <th class="px-4 py-3 text-left font-medium text-gray-600">Name</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600">Email</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600">Role</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of filtered" class="border-b hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-800">{{ u.fullName }}</td>
              <td class="px-4 py-3 text-gray-600 text-xs">{{ u.email }}</td>
              <td class="px-4 py-3 capitalize text-gray-600 text-xs">{{ u.role.replace('_', ' ') }}</td>
              <td class="px-4 py-3">
                <span class="badge" [class.bg-green-100]="u.isActive" [class.text-green-700]="u.isActive"
                  [class.bg-red-100]="!u.isActive" [class.text-red-700]="!u.isActive">
                  {{ u.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button *ngIf="u.isActive" (click)="confirmDeactivate(u)" class="text-xs text-orange-500 hover:underline">Deactivate</button>
                  <button *ngIf="!u.isActive" (click)="reactivate(u)" class="text-xs text-green-600 hover:underline">Reactivate</button>
                  <button (click)="confirmDelete(u)" class="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filtered.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-gray-400">No users found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <app-confirm-dialog
      [open]="showConfirm"
      [title]="confirmTitle"
      [message]="confirmMessage"
      [confirmLabel]="confirmLabel"
      (confirm)="onConfirm()"
      (cancel)="showConfirm = false" />
  `,
})
export class UserManagementComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  users: User[] = [];
  filtered: User[] = [];
  activeRole = 'all';
  roleFilters = ['all', 'assessor', 'admin', 'super_admin'];
  creating = false;
  createError = '';
  showConfirm = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmLabel = 'Confirm';
  selectedUser: User | null = null;
  pendingAction: 'deactivate' | 'delete' | null = null;

  createForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['', Validators.required],
  });

  ngOnInit() { this.load(); }

  load() {
    this.api.getUsers().subscribe(({ users }) => {
      this.users = users;
      this.filterUsers();
    });
  }

  filterUsers() {
    this.filtered = this.activeRole === 'all'
      ? this.users
      : this.users.filter((u) => u.role === this.activeRole);
  }

  createUser() {
    if (this.createForm.invalid) { this.createForm.markAllAsTouched(); return; }
    this.creating = true; this.createError = '';
    this.api.createUser(this.createForm.value).subscribe({
      next: ({ user }) => { this.users.unshift(user); this.filterUsers(); this.createForm.reset(); this.creating = false; },
      error: (e) => { this.createError = e.error?.message ?? 'Failed'; this.creating = false; },
    });
  }

  confirmDeactivate(u: User) {
    this.selectedUser = u;
    this.pendingAction = 'deactivate';
    this.confirmTitle = 'Deactivate User';
    this.confirmMessage = `Deactivate ${u.fullName}? They will no longer be able to log in.`;
    this.confirmLabel = 'Deactivate';
    this.showConfirm = true;
  }

  confirmDelete(u: User) {
    this.selectedUser = u;
    this.pendingAction = 'delete';
    this.confirmTitle = 'Delete User';
    this.confirmMessage = `Permanently delete ${u.fullName}? This cannot be undone.`;
    this.confirmLabel = 'Delete';
    this.showConfirm = true;
  }

  onConfirm() {
    if (this.pendingAction === 'deactivate') this.deactivate();
    else if (this.pendingAction === 'delete') this.deleteUser();
  }

  deactivate() {
    this.api.deactivateUser(this.selectedUser!.id).subscribe(() => {
      const u = this.users.find((x) => x.id === this.selectedUser!.id);
      if (u) u.isActive = false;
      this.filterUsers();
      this.showConfirm = false;
    });
  }

  reactivate(u: User) {
    this.api.reactivateUser(u.id).subscribe(() => { u.isActive = true; this.filterUsers(); });
  }

  deleteUser() {
    this.api.deleteUser(this.selectedUser!.id).subscribe(() => {
      this.users = this.users.filter((u) => u.id !== this.selectedUser!.id);
      this.filterUsers();
      this.showConfirm = false;
    });
  }
}
