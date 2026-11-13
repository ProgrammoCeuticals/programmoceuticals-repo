import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EncounterService } from '../../core/services/encounter.service';

@Component({
  selector: 'app-encounter-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="p-8 max-w-5xl" *ngIf="encounter">
      <div class="flex items-start justify-between mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h1 class="text-xl font-bold text-slate-800 capitalize">{{ encounter.encounterType }}</h1>
            <span class="badge" [class.badge-green]="encounter.status==='completed'" [class.badge-yellow]="encounter.status==='in_progress'" [class.badge-blue]="encounter.status==='scheduled'">{{ encounter.status }}</span>
            <span *ngIf="encounter.amendedAt" class="badge badge-yellow">Amended</span>
          </div>
          <p class="text-sm text-slate-400">{{ encounter.encounterNumber }} · {{ encounter.startedAt | date:'medium' }}</p>
        </div>
        <div class="flex gap-2">
          <button *ngIf="encounter.status==='in_progress'" class="btn-primary btn-sm" (click)="complete()">Mark Complete</button>
          <button *ngIf="encounter.status==='completed'" class="btn-outline btn-sm" (click)="showAmendForm = !showAmendForm">Amend</button>
        </div>
      </div>

      <!-- Amend form -->
      <div *ngIf="showAmendForm" class="card mb-6 bg-amber-50 border border-amber-200">
        <p class="text-sm font-semibold text-amber-800 mb-3">Amend Encounter — original content is preserved</p>
        <form (ngSubmit)="submitAmend()">
          <div class="space-y-3">
            <div><label class="label">Reason for Amendment *</label><input class="input" [(ngModel)]="amendForm.amendmentReason" name="amendReason" required /></div>
            <div><label class="label">Updated Clinical Notes</label><textarea class="input" rows="3" [(ngModel)]="amendForm.clinicalNotes" name="amendNotes"></textarea></div>
            <div><label class="label">Updated Assessment Summary</label><textarea class="input" rows="2" [(ngModel)]="amendForm.assessmentSummary" name="amendAssessment"></textarea></div>
          </div>
          <button type="submit" class="btn-primary btn-sm mt-3" [disabled]="amendLoading">{{ amendLoading ? 'Saving...' : 'Save Amendment' }}</button>
        </form>
      </div>

      <!-- Clinical content -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="card" *ngIf="encounter.reason || encounter.presentingComplaint">
          <p class="text-xs text-slate-400 uppercase tracking-wider mb-2">Reason / Complaint</p>
          <p class="text-sm text-slate-700">{{ encounter.reason }}</p>
          <p *ngIf="encounter.presentingComplaint" class="text-sm text-slate-600 mt-1 italic">"{{ encounter.presentingComplaint }}"</p>
        </div>
        <div class="card" *ngIf="encounter.symptoms">
          <p class="text-xs text-slate-400 uppercase tracking-wider mb-2">Symptoms</p>
          <p class="text-sm text-slate-700">{{ encounter.symptoms }}</p>
        </div>
        <div class="card col-span-2" *ngIf="encounter.clinicalNotes">
          <p class="text-xs text-slate-400 uppercase tracking-wider mb-2">Clinical Notes</p>
          <p class="text-sm text-slate-700 whitespace-pre-wrap">{{ encounter.clinicalNotes }}</p>
        </div>
        <div class="card" *ngIf="encounter.assessmentSummary">
          <p class="text-xs text-slate-400 uppercase tracking-wider mb-2">Assessment</p>
          <p class="text-sm text-slate-700">{{ encounter.assessmentSummary }}</p>
        </div>
        <div class="card" *ngIf="encounter.planSummary">
          <p class="text-xs text-slate-400 uppercase tracking-wider mb-2">Plan</p>
          <p class="text-sm text-slate-700">{{ encounter.planSummary }}</p>
        </div>
        <div class="card col-span-2" *ngIf="encounter.referralDetails">
          <p class="text-xs text-slate-400 uppercase tracking-wider mb-2">Referral / Escalation</p>
          <p class="text-sm text-slate-700">{{ encounter.referralDetails }}</p>
        </div>
      </div>

      <!-- Observations -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-3">
          <p class="text-sm font-semibold text-slate-700">Observations</p>
          <button class="btn-outline btn-sm" (click)="showObsForm = !showObsForm">+ Add</button>
        </div>
        <div *ngIf="showObsForm" class="card mb-3 bg-slate-50">
          <form (ngSubmit)="addObservation()">
            <div class="grid grid-cols-4 gap-2 mb-2">
              <div><label class="label">Type *</label><input class="input" [(ngModel)]="obsForm.observationType" name="obsType" required placeholder="e.g. blood_pressure" /></div>
              <div><label class="label">Value</label><input type="number" class="input" [(ngModel)]="obsForm.valueNumeric" name="obsVal" /></div>
              <div><label class="label">Unit</label><input class="input" [(ngModel)]="obsForm.unit" name="obsUnit" /></div>
              <div><label class="label">Context</label><input class="input" [(ngModel)]="obsForm.context" name="obsCtx" /></div>
            </div>
            <button type="submit" class="btn-primary btn-sm" [disabled]="obsLoading">{{ obsLoading ? 'Saving...' : 'Save' }}</button>
          </form>
        </div>
        <div class="card p-0 overflow-hidden">
          <table><thead><tr><th>Type</th><th>Value</th><th>Unit</th><th>Context</th><th>Measured</th></tr></thead>
            <tbody>
              <tr *ngFor="let o of encounter.observations">
                <td class="font-medium">{{ o.observationType }}</td>
                <td>{{ o.valueNumeric ?? o.valueText }}</td>
                <td>{{ o.unit || '—' }}</td>
                <td>{{ o.context || '—' }}</td>
                <td>{{ o.measuredAt | date:'medium' }}</td>
              </tr>
              <tr *ngIf="!encounter.observations?.length"><td colspan="5" class="text-center text-slate-400 py-6">No observations</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Assessments -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-3">
          <p class="text-sm font-semibold text-slate-700">Assessments</p>
          <button class="btn-outline btn-sm" (click)="showAssessForm = !showAssessForm">+ Add</button>
        </div>
        <div *ngIf="showAssessForm" class="card mb-3 bg-slate-50">
          <form (ngSubmit)="addAssessment()">
            <div class="grid grid-cols-2 gap-2 mb-2">
              <div><label class="label">Type *</label><input class="input" [(ngModel)]="assessForm.assessmentType" name="assessType" required /></div>
              <div><label class="label">Status</label><input class="input" [(ngModel)]="assessForm.status" name="assessStatus" value="active" /></div>
              <div class="col-span-2"><label class="label">Description *</label><textarea class="input" rows="2" [(ngModel)]="assessForm.description" name="assessDesc" required></textarea></div>
              <div class="col-span-2"><label class="label">Evidence Notes</label><textarea class="input" rows="2" [(ngModel)]="assessForm.evidenceNotes" name="assessEvidence"></textarea></div>
            </div>
            <button type="submit" class="btn-primary btn-sm" [disabled]="assessLoading">{{ assessLoading ? 'Saving...' : 'Save' }}</button>
          </form>
        </div>
        <div class="space-y-2">
          <div *ngFor="let a of encounter.assessments" class="card py-3">
            <div class="flex items-center gap-2 mb-1">
              <p class="font-medium text-sm text-slate-800">{{ a.assessmentType }}</p>
              <span class="badge badge-blue">{{ a.status }}</span>
            </div>
            <p class="text-sm text-slate-600">{{ a.description }}</p>
            <p *ngIf="a.evidenceNotes" class="text-xs text-slate-400 mt-1">{{ a.evidenceNotes }}</p>
          </div>
          <p *ngIf="!encounter.assessments?.length" class="text-sm text-slate-400">No assessments recorded</p>
        </div>
      </div>

      <!-- Care Plans -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-3">
          <p class="text-sm font-semibold text-slate-700">Care Plans</p>
          <button class="btn-outline btn-sm" (click)="showPlanForm = !showPlanForm">+ Add</button>
        </div>
        <div *ngIf="showPlanForm" class="card mb-3 bg-slate-50">
          <form (ngSubmit)="addCarePlan()">
            <div class="grid grid-cols-2 gap-2 mb-2">
              <div class="col-span-2"><label class="label">Goal / Problem *</label><input class="input" [(ngModel)]="planForm.goalOrProblem" name="planGoal" required /></div>
              <div class="col-span-2"><label class="label">Action *</label><textarea class="input" rows="2" [(ngModel)]="planForm.action" name="planAction" required></textarea></div>
              <div><label class="label">Due Date</label><input type="date" class="input" [(ngModel)]="planForm.dueAt" name="planDue" /></div>
              <div><label class="label">Rationale</label><input class="input" [(ngModel)]="planForm.rationale" name="planRationale" /></div>
            </div>
            <button type="submit" class="btn-primary btn-sm" [disabled]="planLoading">{{ planLoading ? 'Saving...' : 'Save' }}</button>
          </form>
        </div>
        <div class="space-y-2">
          <div *ngFor="let p of encounter.carePlans" class="card py-3">
            <p class="font-medium text-sm text-slate-800">{{ p.goalOrProblem }}</p>
            <p class="text-sm text-slate-600 mt-1">{{ p.action }}</p>
            <p *ngIf="p.dueAt" class="text-xs text-slate-400 mt-1">Due: {{ p.dueAt | date:'mediumDate' }}</p>
          </div>
          <p *ngIf="!encounter.carePlans?.length" class="text-sm text-slate-400">No care plans recorded</p>
        </div>
      </div>

      <!-- Interventions -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-3">
          <p class="text-sm font-semibold text-slate-700">Interventions</p>
          <button class="btn-outline btn-sm" (click)="showIntForm = !showIntForm">+ Add</button>
        </div>
        <div *ngIf="showIntForm" class="card mb-3 bg-slate-50">
          <form (ngSubmit)="addIntervention()">
            <div class="grid grid-cols-2 gap-2 mb-2">
              <div><label class="label">Type *</label><input class="input" [(ngModel)]="intForm.interventionType" name="intType" required /></div>
              <div><label class="label">Outcome</label><input class="input" [(ngModel)]="intForm.outcome" name="intOutcome" /></div>
              <div class="col-span-2"><label class="label">Description *</label><textarea class="input" rows="2" [(ngModel)]="intForm.description" name="intDesc" required></textarea></div>
            </div>
            <button type="submit" class="btn-primary btn-sm" [disabled]="intLoading">{{ intLoading ? 'Saving...' : 'Save' }}</button>
          </form>
        </div>
        <div class="space-y-2">
          <div *ngFor="let i of encounter.interventions" class="card py-3">
            <p class="font-medium text-sm text-slate-800">{{ i.interventionType }}</p>
            <p class="text-sm text-slate-600 mt-1">{{ i.description }}</p>
          </div>
          <p *ngIf="!encounter.interventions?.length" class="text-sm text-slate-400">No interventions recorded</p>
        </div>
      </div>

      <div *ngIf="encounter.amendedAt" class="card bg-amber-50 border border-amber-200">
        <p class="text-xs text-amber-700">Amended {{ encounter.amendedAt | date:'medium' }} — {{ encounter.amendmentReason }}</p>
      </div>
    </div>
  `
})
export class EncounterDetailComponent implements OnInit {
  encounter: any = null;
  showAmendForm = false; amendForm: any = {}; amendLoading = false;
  showObsForm = false; obsForm: any = {}; obsLoading = false;
  showAssessForm = false; assessForm: any = { status: 'active' }; assessLoading = false;
  showPlanForm = false; planForm: any = {}; planLoading = false;
  showIntForm = false; intForm: any = {}; intLoading = false;

  constructor(private encounterService: EncounterService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.load(id);
  }

  load(id: string) {
    this.encounterService.getOne(id).subscribe(res => this.encounter = res.data);
  }

  complete() {
    this.encounterService.update(this.encounter.id, { status: 'completed' }).subscribe(res => {
      this.encounter = { ...this.encounter, ...res.data };
    });
  }

  submitAmend() {
    this.amendLoading = true;
    this.encounterService.amend(this.encounter.id, this.amendForm).subscribe({
      next: res => { this.encounter = { ...this.encounter, ...res.data }; this.showAmendForm = false; this.amendLoading = false; },
      error: () => this.amendLoading = false
    });
  }

  addObservation() {
    this.obsLoading = true;
    this.encounterService.addObservation(this.encounter.id, this.obsForm).subscribe({
      next: res => {
        this.encounter.observations = [res.data, ...(this.encounter.observations || [])];
        this.obsForm = {}; this.showObsForm = false; this.obsLoading = false;
      },
      error: () => this.obsLoading = false
    });
  }

  addAssessment() {
    this.assessLoading = true;
    this.encounterService.addAssessment(this.encounter.id, this.assessForm).subscribe({
      next: res => {
        this.encounter.assessments = [res.data, ...(this.encounter.assessments || [])];
        this.assessForm = { status: 'active' }; this.showAssessForm = false; this.assessLoading = false;
      },
      error: () => this.assessLoading = false
    });
  }

  addCarePlan() {
    this.planLoading = true;
    this.encounterService.addCarePlan(this.encounter.id, this.planForm).subscribe({
      next: res => {
        this.encounter.carePlans = [res.data, ...(this.encounter.carePlans || [])];
        this.planForm = {}; this.showPlanForm = false; this.planLoading = false;
      },
      error: () => this.planLoading = false
    });
  }

  addIntervention() {
    this.intLoading = true;
    this.encounterService.addIntervention(this.encounter.id, this.intForm).subscribe({
      next: res => {
        this.encounter.interventions = [res.data, ...(this.encounter.interventions || [])];
        this.intForm = {}; this.showIntForm = false; this.intLoading = false;
      },
      error: () => this.intLoading = false
    });
  }
}
