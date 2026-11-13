import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../api.service";
import { ConfirmModalComponent } from "../shared/confirm-modal.component";
import { ALL_ROLES, pretty } from "../models";
import type { Division, Role, User } from "../models";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="grid gap-6 xl:grid-cols-[380px_1fr]">
      <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="mb-4 text-lg font-bold text-navy">Create User</h3>
        <form (ngSubmit)="create()" class="space-y-4">
          <label>Name<input name="name" [(ngModel)]="form.name" required /></label>
          <label>Email<input name="email" type="email" [(ngModel)]="form.email" required /></label>
          <label>Password<input name="password" type="password" [(ngModel)]="form.password" required /></label>
          <label>Role
            <select name="role" [(ngModel)]="form.role">
              <option *ngFor="let r of roles" [value]="r">{{ pretty(r) }}</option>
            </select>
          </label>
          <label>Division
            <select name="divisionId" [(ngModel)]="form.divisionId">
              <option value="">No division</option>
              <option *ngFor="let d of divisions()" [value]="d.id">{{ d.name }}</option>
            </select>
          </label>
          <p *ngIf="error()" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error() }}</p>
          <button type="submit" class="bg-forest text-white hover:bg-emerald-700">Create user</button>
        </form>
      </section>

      <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="mb-4 text-lg font-bold text-navy">Users</h3>
        <table class="w-full text-sm">
          <thead class="border-b text-xs uppercase tracking-wide text-slate-500">
            <tr><th class="py-3 text-left">Name</th><th class="text-left">Email</th><th class="text-left">Role</th><th class="text-left">Division</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users()" class="border-b border-slate-100">
              <td class="py-3 font-semibold">{{ u.name }}</td>
              <td>{{ u.email }}</td>
              <td>{{ pretty(u.role) }}</td>
              <td>{{ u.division?.name || "-" }}</td>
              <td class="flex gap-2 py-3">
                <button (click)="startEdit(u)" class="border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs px-2 py-1">Edit</button>
                <button (click)="remove(u.id)" class="border border-red-200 text-red-600 hover:bg-red-50 text-xs px-2 py-1">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- Edit Modal -->
    <div *ngIf="editUser()" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" (click)="editUser.set(null)"></div>
      <div class="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 class="mb-4 text-lg font-bold text-navy">Edit User</h3>
        <form (ngSubmit)="saveEdit()" class="space-y-4">
          <label>Name<input name="eName" [(ngModel)]="editForm.name" required /></label>
          <label>Email<input name="eEmail" type="email" [(ngModel)]="editForm.email" required /></label>
          <label>New Password <span class="normal-case font-normal text-slate-400">(leave blank to keep)</span>
            <input name="ePassword" type="password" [(ngModel)]="editForm.password" />
          </label>
          <label>Role
            <select name="eRole" [(ngModel)]="editForm.role">
              <option *ngFor="let r of roles" [value]="r">{{ pretty(r) }}</option>
            </select>
          </label>
          <label>Division
            <select name="eDivision" [(ngModel)]="editForm.divisionId">
              <option value="">No division</option>
              <option *ngFor="let d of divisions()" [value]="d.id">{{ d.name }}</option>
            </select>
          </label>
          <p *ngIf="editError()" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ editError() }}</p>
          <div class="flex justify-end gap-3">
            <button type="button" (click)="editUser.set(null)" class="border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" class="bg-navy text-white hover:bg-slate-800">Save changes</button>
          </div>
        </form>
      </div>
    </div>

    <app-confirm-modal
      [visible]="confirmVisible()"
      message="This will permanently delete the user."
      (confirmed)="onConfirmDelete()"
      (cancelled)="confirmVisible.set(false)"
    />
  `
})
export class UsersComponent implements OnInit {
  users = signal<User[]>([]);
  divisions = signal<Division[]>([]);
  error = signal("");
  editError = signal("");
  confirmVisible = signal(false);
  editUser = signal<User | null>(null);
  pendingDeleteId = "";
  readonly roles = ALL_ROLES;
  readonly pretty = pretty;

  form = { name: "", email: "", password: "Password123!", role: "MAIL_ROOM" as Role, divisionId: "" };
  editForm = { name: "", email: "", password: "", role: "MAIL_ROOM" as Role, divisionId: "" };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getUsers().subscribe({ next: (u) => this.users.set(u) });
    this.api.getDivisions().subscribe({ next: (d) => this.divisions.set(d) });
  }

  create() {
    this.error.set("");
    this.api.createUser(this.form).subscribe({
      next: () => {
        this.form = { name: "", email: "", password: "Password123!", role: "MAIL_ROOM", divisionId: "" };
        this.api.getUsers().subscribe({ next: (u) => this.users.set(u) });
      },
      error: (err) => this.error.set(err.error?.message ?? "Failed to create user")
    });
  }

  startEdit(u: User) {
    this.editForm = { name: u.name, email: u.email, password: "", role: u.role, divisionId: u.divisionId ?? "" };
    this.editUser.set(u);
    this.editError.set("");
  }

  saveEdit() {
    const u = this.editUser();
    if (!u) return;
    this.editError.set("");
    const payload: Record<string, string> = { name: this.editForm.name, email: this.editForm.email, role: this.editForm.role, divisionId: this.editForm.divisionId };
    if (this.editForm.password) payload["password"] = this.editForm.password;
    this.api.updateUser(u.id, payload).subscribe({
      next: () => {
        this.editUser.set(null);
        this.api.getUsers().subscribe({ next: (list) => this.users.set(list) });
      },
      error: (err) => this.editError.set(err.error?.message ?? "Failed to update user")
    });
  }

  remove(id: string) {
    this.pendingDeleteId = id;
    this.confirmVisible.set(true);
  }

  onConfirmDelete() {
    this.confirmVisible.set(false);
    this.api.deleteUser(this.pendingDeleteId).subscribe({
      next: () => this.users.update((list) => list.filter((u) => u.id !== this.pendingDeleteId))
    });
  }
}
