import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">User Management</h1>
          <p class="page-subtitle">{{ users.length }} staff account{{ users.length !== 1 ? 's' : '' }}</p>
        </div>
        <button class="btn btn-primary" (click)="showForm=!showForm">{{ showForm ? 'Cancel' : '+ Add User' }}</button>
      </div>

      <div *ngIf="showForm" class="form-panel">
        <p class="card-title" style="margin-bottom:1rem">New Staff Account</p>
        <form (ngSubmit)="createUser()">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
            <div><label class="field-label">First Name *</label><input class="inp" [(ngModel)]="form.firstName" name="firstName" required /></div>
            <div><label class="field-label">Last Name *</label><input class="inp" [(ngModel)]="form.lastName" name="lastName" required /></div>
            <div><label class="field-label">Email *</label><input class="inp" type="email" [(ngModel)]="form.email" name="email" required /></div>
            <div><label class="field-label">Password *</label><input class="inp" type="password" [(ngModel)]="form.password" name="password" required placeholder="Min 8 characters" /></div>
            <div><label class="field-label">Role *</label>
              <select class="inp" [(ngModel)]="form.role" name="role">
                <option value="pharmacist">Pharmacist</option>
                <option value="assistant">Assistant</option>
                <option value="reviewer">Reviewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div *ngIf="formError" class="alert alert-error">{{ formError }}</div>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="saving">{{ saving ? 'Creating…' : 'Create Account' }}</button>
        </form>
      </div>

      <div class="card" style="margin-bottom:0">
        <table class="drt-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users">
              <td style="font-weight:600">{{ u.firstName }} {{ u.lastName }}</td>
              <td style="color:var(--text-muted)">{{ u.email }}</td>
              <td><span class="badge" [class.badge-navy]="u.role==='admin'" [class.badge-blue]="u.role==='pharmacist'" [class.badge-gray]="u.role==='assistant'||u.role==='reviewer'" style="text-transform:capitalize">{{ u.role }}</span></td>
              <td><span class="badge" [class.badge-green]="u.isActive" [class.badge-red]="!u.isActive">{{ u.isActive ? 'Active' : 'Inactive' }}</span></td>
              <td style="color:var(--text-muted)">{{ u.lastLoginAt ? (u.lastLoginAt | date:'dd MMM yyyy, HH:mm') : 'Never' }}</td>
              <td>
                <div style="display:flex;gap:0.4rem">
                  <button *ngIf="u.isActive && u.id !== currentUserId" (click)="deactivate(u)" class="btn btn-danger btn-sm">Deactivate</button>
                  <button *ngIf="!u.isActive" (click)="reactivate(u)" class="btn btn-secondary btn-sm">Reactivate</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="!users.length"><td colspan="6"><div class="loading">Loading…</div></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  showForm = false;
  saving = false;
  formError = '';
  form: any = { role: 'pharmacist' };
  currentUserId = '';

  constructor(private usersService: UsersService, private auth: AuthService) {
    this.currentUserId = this.auth.getUser()?.id ?? '';
  }

  ngOnInit() { this.load(); }

  load() {
    this.usersService.getAll().subscribe({ next: r => this.users = r.data || [], error: () => {} });
  }

  createUser() {
    this.saving = true;
    this.formError = '';
    this.usersService.create(this.form).subscribe({
      next: r => { this.users.unshift(r.data); this.form = { role: 'pharmacist' }; this.showForm = false; this.saving = false; },
      error: err => { this.formError = err.error?.message || 'Failed to create user'; this.saving = false; }
    });
  }

  deactivate(u: any) {
    this.usersService.deactivate(u.id).subscribe({ next: r => { const i = this.users.findIndex(x => x.id === u.id); if (i > -1) this.users[i] = r.data; }, error: () => {} });
  }

  reactivate(u: any) {
    this.usersService.update(u.id, { isActive: true }).subscribe({ next: r => { const i = this.users.findIndex(x => x.id === u.id); if (i > -1) this.users[i] = r.data; }, error: () => {} });
  }
}
