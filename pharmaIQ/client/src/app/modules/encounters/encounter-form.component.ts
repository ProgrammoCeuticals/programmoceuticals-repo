import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PatientService } from '../../core/services/patient.service';
import { EncounterService } from '../../core/services/encounter.service';

@Component({
  selector: 'app-encounter-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-8 max-w-3xl">
      <div class="flex items-center gap-2 mb-6 text-sm">
        <a [routerLink]="['/patients', patientId]" class="text-slate-400 hover:text-slate-600">← Patient</a>
        <span class="text-slate-300">/</span>
        <span class="text-slate-700 font-medium">New Encounter</span>
      </div>

      <!-- Allergy alert -->
      <div *ngIf="allergyAlert" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
        ⚠ <strong>Allergy status: {{ allergyAlert }}</strong> — review allergy records before proceeding.
      </div>

      <!-- Step indicator -->
      <div class="flex gap-2 mb-6">
        <div *ngFor="let s of steps; let i = index"
          class="flex-1 h-1.5 rounded-full transition-colors"
          [class.bg-primary]="i <= step"
          [class.bg-slate-200]="i > step">
        </div>
      </div>
      <p class="text-xs text-slate-400 mb-4">Step {{ step + 1 }} of {{ steps.length }}: <span class="font-medium text-slate-600">{{ steps[step] }}</span></p>

      <!-- Step 0: Encounter details -->
      <div *ngIf="step === 0" class="card">
        <h2 class="text-base font-semibold text-slate-800 mb-4">Encounter Details</h2>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="label">Encounter Type</label>
            <select class="input" [(ngModel)]="form.encounterType" name="encounterType">
              <option value="initial_consultation">Initial consultation</option>
              <option value="routine_checkup">Routine check-up</option>
              <option value="medication_review">Medication review</option>
              <option value="screening">Screening</option>
              <option value="follow_up">Follow-up</option>
              <option value="counselling">Counselling</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div><label class="label">Status</label>
            <select class="input" [(ngModel)]="form.status" name="status">
              <option value="in_progress">In progress</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <div class="col-span-2"><label class="label">Reason for Visit</label><input class="input" [(ngModel)]="form.reason" name="reason" /></div>
          <div class="col-span-2"><label class="label">Presenting Complaint (patient's own words)</label><textarea class="input" rows="2" [(ngModel)]="form.presentingComplaint" name="presentingComplaint"></textarea></div>
          <div class="col-span-2"><label class="label">Symptoms / Relevant History</label><textarea class="input" rows="3" [(ngModel)]="form.symptoms" name="symptoms"></textarea></div>
        </div>
      </div>

      <!-- Step 1: Observations -->
      <div *ngIf="step === 1" class="card">
        <h2 class="text-base font-semibold text-slate-800 mb-4">Observations</h2>
        <p class="text-xs text-slate-400 mb-4">Record after the encounter is created. Add observations below.</p>
        <div *ngFor="let obs of observations; let i = index" class="flex gap-2 items-center mb-2">
          <span class="text-sm text-slate-700 flex-1">{{ obs.observationType }}: {{ obs.valueNumeric ?? obs.valueText }} {{ obs.unit }}</span>
          <button type="button" (click)="observations.splice(i,1)" class="text-xs text-danger">Remove</button>
        </div>
        <div class="grid grid-cols-4 gap-2 mt-3">
          <div><label class="label">Type</label><input class="input" [(ngModel)]="obsForm.observationType" name="obsType" placeholder="e.g. blood_pressure" /></div>
          <div><label class="label">Value</label><input class="input" [(ngModel)]="obsForm.valueNumeric" name="obsValue" type="number" /></div>
          <div><label class="label">Unit</label><input class="input" [(ngModel)]="obsForm.unit" name="obsUnit" placeholder="e.g. mmHg" /></div>
          <div><label class="label">Context</label><input class="input" [(ngModel)]="obsForm.context" name="obsContext" /></div>
        </div>
        <button type="button" class="btn-outline btn-sm mt-2" (click)="addObsToList()">+ Add Observation</button>
      </div>

      <!-- Step 2: Assessment & Clinical Notes -->
      <div *ngIf="step === 2" class="card">
        <h2 class="text-base font-semibold text-slate-800 mb-4">Assessment & Clinical Notes</h2>
        <div class="space-y-4">
          <div><label class="label">Clinical Notes</label><textarea class="input" rows="4" [(ngModel)]="form.clinicalNotes" name="clinicalNotes"></textarea></div>
          <div><label class="label">Assessment Summary</label><textarea class="input" rows="3" [(ngModel)]="form.assessmentSummary" name="assessmentSummary"></textarea></div>
          <div><label class="label">Plan Summary</label><textarea class="input" rows="3" [(ngModel)]="form.planSummary" name="planSummary"></textarea></div>
          <div><label class="label">Referral / Escalation Details</label><textarea class="input" rows="2" [(ngModel)]="form.referralDetails" name="referralDetails"></textarea></div>
        </div>
      </div>

      <!-- Step 3: Complete -->
      <div *ngIf="step === 3" class="card">
        <h2 class="text-base font-semibold text-slate-800 mb-4">Review & Save</h2>
        <dl class="space-y-2 text-sm">
          <div class="flex gap-2"><dt class="text-slate-500 w-40">Type</dt><dd class="capitalize">{{ form.encounterType }}</dd></div>
          <div class="flex gap-2"><dt class="text-slate-500 w-40">Status</dt><dd class="capitalize">{{ form.status }}</dd></div>
          <div class="flex gap-2"><dt class="text-slate-500 w-40">Reason</dt><dd>{{ form.reason || '—' }}</dd></div>
          <div class="flex gap-2"><dt class="text-slate-500 w-40">Observations</dt><dd>{{ observations.length }} recorded</dd></div>
        </dl>
        <div class="mt-4 flex gap-3">
          <button class="btn-primary" (click)="save('in_progress')" [disabled]="saving">Save as Draft</button>
          <button class="btn-primary" (click)="save('completed')" [disabled]="saving">Complete Encounter</button>
        </div>
      </div>

      <div *ngIf="errorMsg" class="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{{ errorMsg }}</div>

      <div class="flex justify-between mt-6">
        <button *ngIf="step > 0" class="btn-outline btn-sm" (click)="step = step - 1">← Back</button>
        <div></div>
        <button *ngIf="step < steps.length - 1" class="btn-primary btn-sm" (click)="step = step + 1">Next →</button>
      </div>
    </div>
  `
})
export class EncounterFormComponent implements OnInit {
  patientId = '';
  step = 0;
  steps = ['Encounter Details', 'Observations', 'Assessment', 'Review & Save'];
  form: any = { encounterType: 'routine_checkup', status: 'in_progress' };
  observations: any[] = [];
  obsForm: any = {};
  saving = false;
  errorMsg = '';
  allergyAlert = '';
  encounterId = '';

  constructor(
    private patientService: PatientService,
    private encounterService: EncounterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('patientId')!;
    this.patientService.getOne(this.patientId).subscribe(res => {
      const status = res.data?.allergyStatus;
      if (status && status !== 'no_known_allergies') this.allergyAlert = status;
    });
  }

  addObsToList() {
    if (!this.obsForm.observationType) return;
    this.observations.push({ ...this.obsForm });
    this.obsForm = {};
  }

  save(finalStatus: string) {
    this.saving = true;
    this.errorMsg = '';
    this.patientService.createEncounter(this.patientId, { ...this.form, status: finalStatus }).subscribe({
      next: res => {
        this.encounterId = res.data.id;
        const obsRequests = this.observations.map(o =>
          this.encounterService.addObservation(this.encounterId, o).toPromise()
        );
        Promise.all(obsRequests).then(() => {
          this.router.navigate(['/encounters', this.encounterId]);
        });
      },
      error: err => { this.errorMsg = err.error?.message || 'Error saving encounter'; this.saving = false; }
    });
  }
}
