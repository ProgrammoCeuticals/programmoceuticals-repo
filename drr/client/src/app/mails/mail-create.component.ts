import { Component, Output, EventEmitter, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../api.service";

@Component({
  selector: "app-mail-create",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 class="mb-4 text-lg font-bold text-navy">Mail Room Intake</h3>
      <form (ngSubmit)="submit()" class="space-y-4">
        <label>Code / Reference Number<input name="code" [(ngModel)]="form.code" required /></label>
        <label>Company / Applicant<input name="companyApplicant" [(ngModel)]="form.companyApplicant" required /></label>
        <label>Subject<textarea name="subject" rows="3" [(ngModel)]="form.subject" required></textarea></label>
        <p *ngIf="error()" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error() }}</p>
        <button type="submit" [disabled]="loading()" class="bg-forest text-white hover:bg-emerald-700 disabled:opacity-50">
          {{ loading() ? "Registering…" : "Register mail" }}
        </button>
      </form>
    </section>
  `
})
export class MailCreateComponent {
  @Output() created = new EventEmitter<string>();

  form = { code: "", companyApplicant: "", subject: "" };
  error = signal("");
  loading = signal(false);

  constructor(private api: ApiService) {}

  submit() {
    this.error.set("");
    this.loading.set(true);
    this.api.createMail(this.form).subscribe({
      next: (mail) => {
        this.form = { code: "", companyApplicant: "", subject: "" };
        this.loading.set(false);
        this.created.emit(mail.id);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? "Failed to register mail");
        this.loading.set(false);
      }
    });
  }
}
