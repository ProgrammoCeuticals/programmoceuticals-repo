import { Component, Input, OnInit, OnChanges, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../api.service";
import { pretty, statusClass, today } from "../models";
import type { Division, Mail, TimelineItem, User } from "../models";

@Component({
  selector: "app-mail-detail",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="mail()" class="grid gap-6 xl:grid-cols-[1fr_420px]">
      <div class="space-y-6">
        <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-bold text-navy">Basic Information</h3>
            <button *ngIf="isAdmin" (click)="startEditMail()" class="border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm">Edit</button>
          </div>
          <div class="grid gap-4 md:grid-cols-2">
            <div><p class="info-label">Code</p><p class="info-value">{{ mail()!.code }}</p></div>
            <div><p class="info-label">Status</p><span class="badge" [ngClass]="statusClass(mail()!.status)">{{ pretty(mail()!.status) }}</span></div>
            <div><p class="info-label">Company / Applicant</p><p class="info-value">{{ mail()!.companyApplicant }}</p></div>
            <div><p class="info-label">Target Division</p><p class="info-value">{{ mail()!.targetDivision?.name || "Not set" }}</p></div>
            <div><p class="info-label">Subject</p><p class="info-value">{{ mail()!.subject }}</p></div>
            <div><p class="info-label">Current Holder</p><p class="info-value">{{ mail()!.currentHolder?.name || "Not assigned" }}</p></div>
          </div>
        </section>

        <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 class="mb-5 text-lg font-bold text-navy">Timeline</h3>
          <div class="relative">
            <!-- vertical line -->
            <div *ngIf="timeline().length" class="absolute left-[15px] top-2 bottom-2 w-px bg-slate-200"></div>
            <div class="space-y-4">
              <div *ngFor="let item of timeline(); let i = index; let last = last" class="relative flex items-center gap-4">
                <!-- step dot -->
                <div class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm"
                     [ngClass]="last ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-300 text-slate-500'">
                  {{ i + 1 }}
                </div>
                <!-- card -->
                <div class="flex-1 rounded-lg border pb-4 pt-3 px-4 mb-1"
                     [ngClass]="last ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'">
                  <p class="font-semibold text-sm" [ngClass]="last ? 'text-emerald-800' : 'text-navy'">{{ item.action }}</p>
                  <p class="mt-0.5 text-xs text-slate-400">{{ item.createdAt | date:'d MMM y, h:mm a' }}</p>
                  <p *ngIf="item.note" class="mt-2 rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600 italic">{{ item.note }}</p>
                </div>
              </div>
              <p *ngIf="!timeline().length" class="text-sm text-slate-400">No timeline entries yet.</p>
            </div>
          </div>
        </section>
      </div>

      <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="mb-4 text-lg font-bold text-navy">Workflow Action</h3>
        <p *ngIf="error()" class="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error() }}</p>

        <form *ngIf="mail()!.status === 'REGISTERED' && canAct('SECRETARY')" (ngSubmit)="submit('directorial-routing')" class="space-y-4">
          <label>Minuted To<input name="minutedTo" [(ngModel)]="af['minutedTo']" /></label>
          <label>Directive / Comment<textarea name="directiveComment" rows="4" [(ngModel)]="af['directiveComment']"></textarea></label>
          <label>Target Division
            <select name="targetDivisionId" [(ngModel)]="af['targetDivisionId']">
              <option value="">Select division</option>
              <option *ngFor="let d of divisions()" [value]="d.id">{{ d.name }}</option>
            </select>
          </label>
          <label>Directive Date<input name="directiveDate" type="date" [(ngModel)]="af['directiveDate']" /></label>
          <button type="submit" class="bg-forest text-white hover:bg-emerald-700">Record directive</button>
        </form>

        <form *ngIf="mail()!.status === 'DIRECTOR_ROUTED' && canAct('MAIL_ROOM')" (ngSubmit)="submit('dispatch')" class="space-y-4">
          <p class="text-sm text-slate-600">Dispatching to: <strong>{{ mail()!.targetDivision?.name || 'Not set' }}</strong></p>
          <label>Dispatch Date<input name="dispatchDate" type="date" [(ngModel)]="af['dispatchDate']" /></label>
          <label>Dispatch Remark<textarea name="remark" rows="4" [(ngModel)]="af['remark']"></textarea></label>
          <button type="submit" class="w-full bg-forest text-white hover:bg-emerald-700">Send to target division</button>
        </form>

        <form *ngIf="mail()!.status === 'DISPATCHED_TO_DIVISION' && canAct('DD')" (ngSubmit)="submit('division-receipt')" class="space-y-4">
          <p class="text-sm font-semibold text-slate-600 border-b pb-2">Division Receipt</p>
          <label>Date Received<input name="dateReceived" type="date" [(ngModel)]="af['dateReceived']" /></label>
          <label>Desk Officer Rank / Position<input name="deskOfficerName" [(ngModel)]="af['deskOfficerName']" placeholder="e.g. Principal Scientific Officer" /></label>
          <label>Date Assigned<input name="dateAssigned" type="date" [(ngModel)]="af['dateAssigned']" /></label>
          <label>Remark<textarea name="remark" rows="3" [(ngModel)]="af['remark']"></textarea></label>
          <button type="submit" class="w-full bg-forest text-white hover:bg-emerald-700">Record division receipt</button>
        </form>

        <form *ngIf="mail()!.status === 'ASSIGNED_TO_DESK_OFFICER' && canAct('DD')" (ngSubmit)="submit('desk-action')" class="space-y-4">
          <p class="text-sm font-semibold text-slate-600 border-b pb-2">Desk Officer Action</p>
          <div *ngIf="mail()!.divisionProcessing?.deskOfficerName" class="rounded-md bg-slate-50 border border-slate-200 px-3 py-2">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned Desk Officer Position</p>
            <p class="mt-0.5 text-sm font-medium text-slate-800">{{ mail()!.divisionProcessing!.deskOfficerName }}</p>
          </div>
          <label>Work Note<textarea name="workNote" rows="4" [(ngModel)]="af['workNote']"></textarea></label>
          <label>Date Completed<input name="dateCompleted" type="date" [(ngModel)]="af['dateCompleted']" /></label>
          <button type="submit" class="w-full bg-forest text-white hover:bg-emerald-700">Record desk officer action</button>
        </form>

        <form *ngIf="mail()!.status === 'DESK_REVIEW_COMPLETED' && canAct('DD')" (ngSubmit)="submit('hod-hou-review')" class="space-y-4">
          <p class="text-sm font-semibold text-slate-600 border-b pb-2">HOD/HOU Review</p>
          <label>Remark<textarea name="remark" rows="4" [(ngModel)]="af['remark']"></textarea></label>
          <label>Date Reviewed<input name="dateReviewed" type="date" [(ngModel)]="af['dateReviewed']" /></label>
          <button type="submit" class="w-full bg-forest text-white hover:bg-emerald-700">Record HOD/HOU review</button>
        </form>

        <form *ngIf="mail()!.status === 'HOD_HOU_REVIEWED' && canAct('DD')" (ngSubmit)="submit('close')" class="space-y-4">
          <p class="text-sm font-semibold text-slate-600 border-b pb-2">Close Mail</p>
          <label>Closure Remark<textarea name="closureRemark" rows="4" [(ngModel)]="af['closureRemark']"></textarea></label>
          <label>Date Closed<input name="dateClosed" type="date" [(ngModel)]="af['dateClosed']" /></label>
          <button type="submit" class="w-full bg-forest text-white hover:bg-emerald-700">Close mail</button>
        </form>

        <p *ngIf="mail()!.status === 'CLOSED'" class="text-sm text-slate-500">This mail has been closed.</p>
      </section>
    </div>

    <p *ngIf="!mail()" class="text-slate-400">Loading mail…</p>

    <!-- Edit Mail Modal -->
    <div *ngIf="editMailVisible()" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" (click)="editMailVisible.set(false)"></div>
      <div class="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 class="mb-4 text-lg font-bold text-navy">Edit Mail Info</h3>
        <form (ngSubmit)="saveMailEdit()" class="space-y-4">
          <label>Code<input name="mCode" [(ngModel)]="mailEditForm.code" required /></label>
          <label>Company / Applicant<input name="mCompany" [(ngModel)]="mailEditForm.companyApplicant" required /></label>
          <label>Subject<textarea name="mSubject" rows="3" [(ngModel)]="mailEditForm.subject" required></textarea></label>
          <p *ngIf="editMailError()" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ editMailError() }}</p>
          <div class="flex justify-end gap-3">
            <button type="button" (click)="editMailVisible.set(false)" class="border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" class="bg-navy text-white hover:bg-slate-800">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class MailDetailComponent implements OnInit, OnChanges {
  @Input() mailId!: string;
  @Input() currentUser!: User;

  mail = signal<Mail | null>(null);
  timeline = signal<TimelineItem[]>([]);
  divisions = signal<Division[]>([]);
  users = signal<User[]>([]);
  error = signal("");
  editMailVisible = signal(false);
  editMailError = signal("");
  af: Record<string, string> = {};
  mailEditForm = { code: "", companyApplicant: "", subject: "" };

  readonly pretty = pretty;
  readonly statusClass = statusClass;

  get isAdmin() { return this.currentUser.role === "ADMIN"; }

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
    this.api.getDivisions().subscribe({ next: (d) => this.divisions.set(d) });
    this.api.getUsers().subscribe({ next: (u) => this.users.set(u) });
  }

  ngOnChanges() {
    if (this.mailId) this.load();
  }

  load() {
    this.api.getMail(this.mailId).subscribe({
      next: (mail) => { this.mail.set(mail); this.prepareForm(mail); }
    });
    this.api.getTimeline(this.mailId).subscribe({ next: (t) => this.timeline.set(t) });
  }

  prepareForm(mail: Mail) {
    const s = mail.status;
    if (s === "REGISTERED") this.af = { minutedTo: "", directiveComment: "", targetDivisionId: "", directiveDate: today() };
    else if (s === "DIRECTOR_ROUTED") this.af = { dispatchDate: today(), remark: "" };
    else if (s === "DISPATCHED_TO_DIVISION") this.af = { dateReceived: today(), deskOfficerName: "", dateAssigned: today(), remark: "" };
    else if (s === "ASSIGNED_TO_DESK_OFFICER") this.af = { workNote: "", dateCompleted: today() };
    else if (s === "DESK_REVIEW_COMPLETED") this.af = { remark: "", dateReviewed: today() };
    else if (s === "HOD_HOU_REVIEWED") this.af = { closureRemark: "", dateClosed: today() };
    else this.af = {};
  }

  startEditMail() {
    const m = this.mail();
    if (!m) return;
    this.mailEditForm = { code: m.code, companyApplicant: m.companyApplicant, subject: m.subject };
    this.editMailError.set("");
    this.editMailVisible.set(true);
  }

  saveMailEdit() {
    this.editMailError.set("");
    this.api.updateMail(this.mailId, this.mailEditForm).subscribe({
      next: (mail) => { this.mail.set(mail); this.editMailVisible.set(false); },
      error: (err) => this.editMailError.set(err.error?.message ?? "Failed to update mail")
    });
  }

  canAct(role: string) {
    return this.currentUser.role === role || this.currentUser.role === "ADMIN";
  }

  usersFor(role: string) {
    const divisionId = this.mail()?.targetDivisionId;
    return this.users().filter(
      (u) => u.role === role && (!divisionId || u.divisionId === divisionId || u.role === "ADMIN")
    );
  }

  submit(path: string) {
    this.error.set("");
    this.api.submitWorkflow(this.mailId, path, this.af).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(err.error?.message ?? "Action failed")
    });
  }
}
