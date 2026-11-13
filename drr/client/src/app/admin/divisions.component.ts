import { Component, Input, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../api.service";
import { ConfirmModalComponent } from "../shared/confirm-modal.component";
import type { Division } from "../models";

@Component({
  selector: "app-divisions",
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <div [class]="isAdmin ? 'grid gap-6 xl:grid-cols-[380px_1fr]' : ''">
      <section *ngIf="isAdmin" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="mb-4 text-lg font-bold text-navy">Create Division</h3>
        <form (ngSubmit)="create()" class="space-y-4">
          <label>Name<input name="name" [(ngModel)]="form.name" required /></label>
          <label>Code<input name="code" [(ngModel)]="form.code" required /></label>
          <p *ngIf="error()" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error() }}</p>
          <button type="submit" class="bg-forest text-white hover:bg-emerald-700">Create division</button>
        </form>
      </section>

      <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="mb-4 text-lg font-bold text-navy">Divisions</h3>
        <div class="grid gap-3 md:grid-cols-2">
          <div *ngFor="let d of divisions()" class="flex items-center justify-between rounded-md border border-slate-200 p-4">
            <div>
              <p class="font-semibold text-navy">{{ d.name }}</p>
              <p class="text-sm text-slate-500">{{ d.code }}</p>
            </div>
            <div *ngIf="isAdmin" class="flex gap-2">
              <button (click)="startEdit(d)" class="border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs px-2 py-1">Edit</button>
              <button (click)="remove(d.id)" class="border border-red-200 text-red-600 hover:bg-red-50 text-xs px-2 py-1">Delete</button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Edit Modal -->
    <div *ngIf="editDivision()" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" (click)="editDivision.set(null)"></div>
      <div class="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 class="mb-4 text-lg font-bold text-navy">Edit Division</h3>
        <form (ngSubmit)="saveEdit()" class="space-y-4">
          <label>Name<input name="eName" [(ngModel)]="editForm.name" required /></label>
          <label>Code<input name="eCode" [(ngModel)]="editForm.code" required /></label>
          <p *ngIf="editError()" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ editError() }}</p>
          <div class="flex justify-end gap-3">
            <button type="button" (click)="editDivision.set(null)" class="border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" class="bg-navy text-white hover:bg-slate-800">Save changes</button>
          </div>
        </form>
      </div>
    </div>

    <app-confirm-modal
      [visible]="confirmVisible()"
      message="This will permanently delete the division."
      (confirmed)="onConfirmDelete()"
      (cancelled)="confirmVisible.set(false)"
    />
  `
})
export class DivisionsComponent implements OnInit {
  divisions = signal<Division[]>([]);
  error = signal("");
  editError = signal("");
  confirmVisible = signal(false);
  editDivision = signal<Division | null>(null);
  pendingDeleteId = "";
  form = { name: "", code: "" };
  editForm = { name: "", code: "" };
  @Input() isAdmin = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDivisions().subscribe({ next: (d) => this.divisions.set(d) });
  }

  create() {
    this.error.set("");
    this.api.createDivision(this.form).subscribe({
      next: (d) => {
        this.form = { name: "", code: "" };
        this.divisions.update((list) => [...list, d]);
      },
      error: (err) => this.error.set(err.error?.message ?? "Failed to create division")
    });
  }

  startEdit(d: Division) {
    this.editForm = { name: d.name, code: d.code };
    this.editDivision.set(d);
    this.editError.set("");
  }

  saveEdit() {
    const d = this.editDivision();
    if (!d) return;
    this.editError.set("");
    this.api.updateDivision(d.id, this.editForm).subscribe({
      next: (updated) => {
        this.editDivision.set(null);
        this.divisions.update((list) => list.map((item) => item.id === updated.id ? updated : item));
      },
      error: (err) => this.editError.set(err.error?.message ?? "Failed to update division")
    });
  }

  remove(id: string) {
    this.pendingDeleteId = id;
    this.confirmVisible.set(true);
  }

  onConfirmDelete() {
    this.confirmVisible.set(false);
    this.api.deleteDivision(this.pendingDeleteId).subscribe({
      next: () => this.divisions.update((list) => list.filter((d) => d.id !== this.pendingDeleteId))
    });
  }
}
