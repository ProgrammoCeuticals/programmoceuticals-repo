import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-confirm-modal",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" (click)="cancel()"></div>
      <div class="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 class="text-base font-bold text-navy">{{ title }}</h3>
        <p class="mt-2 text-sm text-slate-600">{{ message }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button (click)="cancel()" class="border border-slate-300 text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button (click)="confirm()" class="border border-red-200 bg-red-50 text-red-700 hover:bg-red-100">
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  @Input() visible = false;
  @Input() title = "Are you sure?";
  @Input() message = "";
  @Input() confirmLabel = "Delete";
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm() { this.confirmed.emit(); }
  cancel() { this.cancelled.emit(); }
}
