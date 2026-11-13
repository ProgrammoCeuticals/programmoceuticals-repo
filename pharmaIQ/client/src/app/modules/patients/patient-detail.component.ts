import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../core/services/patient.service';

const OVERVIEW_TMPL = `
  <div class="page" *ngIf="patient">
    <div class="page-header">
      <div>
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem">
          <a routerLink="/patients" style="font-size:0.78rem;color:var(--text-muted);text-decoration:none">← Patients</a>
          <span style="color:var(--text-faint)">/</span>
          <span style="font-size:0.78rem;color:var(--text-mid)">{{ patient.firstName }} {{ patient.lastName }}</span>
        </div>
        <h1 class="page-title">{{ patient.firstName }} {{ patient.middleName }} {{ patient.lastName }}</h1>
        <div style="display:flex;gap:0.4rem;margin-top:0.4rem;flex-wrap:wrap">
          <span class="badge badge-navy">{{ patient.patientNumber }}</span>
          <span *ngIf="patient.allergyStatus==='allergies_present'" class="badge badge-red">⚠ Allergies</span>
          <span *ngIf="patient.allergyStatus==='not_assessed'" class="badge badge-amber">Allergy Not Assessed</span>
          <span *ngIf="patient.allergyStatus==='no_known_allergies'" class="badge badge-green">No Known Allergies</span>
          <span *ngIf="patient.allergyStatus==='unknown'" class="badge badge-gray">Allergy Unknown</span>
          <span class="badge badge-gray" style="text-transform:capitalize">{{ patient.status }}</span>
        </div>
      </div>
      <a [routerLink]="['/patients', patient.id, 'edit']" class="btn btn-secondary">Edit Patient</a>
    </div>

    <div class="seg-tabs">
      <button *ngFor="let t of tabs" class="seg-tab" [class.active]="activeTab===t.key" (click)="activeTab=t.key">{{ t.label }}</button>
    </div>

    <!-- OVERVIEW -->
    <div *ngIf="activeTab==='overview'">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.25rem">
        <div class="card" style="margin-bottom:0">
          <div class="card-header"><span class="card-title">Demographics</span></div>
          <div class="card-body">
            <table style="width:100%;font-size:0.8rem;border-collapse:collapse">
              <tr><td class="field-label" style="padding:0.3rem 0;width:45%">DOB</td><td style="color:var(--text-mid)">{{ patient.dateOfBirth | date:'dd MMM yyyy' }}</td></tr>
              <tr><td class="field-label" style="padding:0.3rem 0">Gender</td><td style="color:var(--text-mid);text-transform:capitalize">{{ patient.gender || '—' }}</td></tr>
              <tr><td class="field-label" style="padding:0.3rem 0">Source</td><td style="color:var(--text-mid);text-transform:capitalize">{{ patient.registrationSource || '—' }}</td></tr>
              <tr><td class="field-label" style="padding:0.3rem 0">Registered</td><td style="color:var(--text-mid)">{{ patient.registeredAt | date:'dd MMM yyyy' }}</td></tr>
            </table>
          </div>
        </div>
        <div class="card" style="margin-bottom:0">
          <div class="card-header"><span class="card-title">Contacts</span></div>
          <div class="card-body">
            <div *ngFor="let c of patient.contacts" style="margin-bottom:0.5rem">
              <div class="field-label">{{ c.contactType }}</div>
              <div style="color:var(--text-mid);font-size:0.82rem">{{ c.value }}</div>
            </div>
            <div *ngIf="!patient.contacts?.length" style="color:var(--text-faint);font-size:0.82rem">No contacts recorded</div>
          </div>
        </div>
        <div class="card" style="margin-bottom:0">
          <div class="card-header"><span class="card-title">Emergency Contact</span></div>
          <div class="card-body" *ngIf="patient.emergencyContacts?.length">
            <div style="margin-bottom:0.5rem"><div class="field-label">Name</div><div style="color:var(--text-mid);font-size:0.82rem;font-weight:600">{{ patient.emergencyContacts[0].name }}</div></div>
            <div style="margin-bottom:0.5rem"><div class="field-label">Relationship</div><div style="color:var(--text-mid);font-size:0.82rem">{{ patient.emergencyContacts[0].relationship || '—' }}</div></div>
            <div><div class="field-label">Phone</div><div style="color:var(--text-mid);font-size:0.82rem">{{ patient.emergencyContacts[0].phone }}</div></div>
          </div>
          <div class="card-body" *ngIf="!patient.emergencyContacts?.length" style="color:var(--text-faint);font-size:0.82rem">Not recorded</div>
        </div>
      </div>
      <div *ngIf="patient.notes" class="card">
        <div class="card-header"><span class="card-title">Notes</span></div>
        <div class="card-body" style="font-size:0.82rem;color:var(--text-mid)">{{ patient.notes }}</div>
      </div>
    </div>

    <!-- CONDITIONS -->
    <div *ngIf="activeTab==='conditions'">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <span style="font-size:0.8rem;color:var(--text-muted)">Medical conditions</span>
        <button class="btn btn-primary btn-sm" (click)="showCondForm=!showCondForm">{{ showCondForm ? 'Cancel' : '+ Add Condition' }}</button>
      </div>
      <div *ngIf="showCondForm" class="form-panel">
        <form (ngSubmit)="addCondition()">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
            <div style="grid-column:1/-1"><label class="field-label">Condition Name *</label><input class="inp" [(ngModel)]="condForm.conditionName" name="conditionName" required /></div>
            <div><label class="field-label">Status</label>
              <select class="inp" [(ngModel)]="condForm.status" name="condStatus">
                <option value="current">Current</option><option value="resolved">Resolved</option>
                <option value="in_remission">In remission</option><option value="historical">Historical</option><option value="uncertain">Uncertain</option>
              </select>
            </div>
            <div><label class="field-label">Verification</label>
              <select class="inp" [(ngModel)]="condForm.verificationStatus" name="condVerification">
                <option value="unverified">Unverified</option><option value="reviewed">Reviewed</option><option value="confirmed">Confirmed</option>
              </select>
            </div>
            <div><label class="field-label">Source</label>
              <select class="inp" [(ngModel)]="condForm.source" name="condSource">
                <option value="patient_reported">Patient reported</option><option value="clinician_document">Clinician document</option><option value="other">Other</option>
              </select>
            </div>
            <div><label class="field-label">Onset Date</label><input type="date" class="inp" [(ngModel)]="condForm.onsetDate" name="onsetDate" /></div>
            <div style="grid-column:1/-1"><label class="field-label">Notes</label><textarea class="inp" rows="2" [(ngModel)]="condForm.notes" name="condNotes"></textarea></div>
          </div>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="condLoading">{{ condLoading ? 'Saving…' : 'Save' }}</button>
        </form>
      </div>
      <div class="card" style="margin-bottom:0">
        <table class="drt-table">
          <thead><tr><th>Condition</th><th>Status</th><th>Verification</th><th>Source</th><th>Onset</th></tr></thead>
          <tbody>
            <tr *ngFor="let c of conditions">
              <td style="font-weight:600">{{ c.conditionName }}</td>
              <td><span class="badge" [class.badge-green]="c.status==='current'" [class.badge-blue]="c.status==='resolved'" [class.badge-amber]="c.status==='uncertain'" [class.badge-gray]="c.status==='historical'">{{ c.status }}</span></td>
              <td style="text-transform:capitalize;color:var(--text-muted)">{{ c.verificationStatus }}</td>
              <td style="text-transform:capitalize;color:var(--text-muted)">{{ c.source }}</td>
              <td>{{ c.onsetDate | date:'dd MMM yyyy' }}</td>
            </tr>
            <tr *ngIf="!conditions.length"><td colspan="5"><div class="empty"><div class="empty-title">No conditions recorded</div></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ALLERGIES -->
    <div *ngIf="activeTab==='allergies'">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem">
        <div style="display:flex;align-items:center;gap:0.75rem">
          <span style="font-size:0.8rem;color:var(--text-muted)">Allergy status:</span>
          <select class="inp" style="width:220px" [(ngModel)]="allergyStatusValue" (change)="saveAllergyStatus()">
            <option value="not_assessed">Not assessed</option>
            <option value="unknown">Unknown</option>
            <option value="no_known_allergies">No known allergies</option>
            <option value="allergies_present">Allergies present</option>
          </select>
        </div>
        <button class="btn btn-primary btn-sm" (click)="showAllergyForm=!showAllergyForm">{{ showAllergyForm ? 'Cancel' : '+ Add Allergy' }}</button>
      </div>
      <div *ngIf="showAllergyForm" class="form-panel">
        <form (ngSubmit)="addAllergy()">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
            <div style="grid-column:1/-1"><label class="field-label">Substance *</label><input class="inp" [(ngModel)]="allergyForm.substance" name="substance" required /></div>
            <div><label class="field-label">Classification</label>
              <select class="inp" [(ngModel)]="allergyForm.classification" name="classification">
                <option value="unknown">Unknown</option><option value="suspected_allergy">Suspected allergy</option>
                <option value="confirmed_allergy">Confirmed allergy</option><option value="intolerance">Intolerance</option><option value="adverse_reaction">Adverse reaction</option>
              </select>
            </div>
            <div><label class="field-label">Severity</label><input class="inp" [(ngModel)]="allergyForm.severity" name="severity" /></div>
            <div style="grid-column:1/-1"><label class="field-label">Reaction</label><textarea class="inp" rows="2" [(ngModel)]="allergyForm.reaction" name="reaction"></textarea></div>
            <div><label class="field-label">Source</label>
              <select class="inp" [(ngModel)]="allergyForm.source" name="allergySource">
                <option value="patient_reported">Patient reported</option><option value="clinician_document">Clinician document</option><option value="other">Other</option>
              </select>
            </div>
            <div><label class="field-label">First Reaction Date</label><input type="date" class="inp" [(ngModel)]="allergyForm.firstReactionDate" name="firstReactionDate" /></div>
          </div>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="allergyLoading">{{ allergyLoading ? 'Saving…' : 'Save' }}</button>
        </form>
      </div>
      <div class="card" style="margin-bottom:0">
        <table class="drt-table">
          <thead><tr><th>Substance</th><th>Classification</th><th>Reaction</th><th>Severity</th><th>Status</th></tr></thead>
          <tbody>
            <tr *ngFor="let a of allergies">
              <td style="font-weight:600">{{ a.substance }}</td>
              <td style="text-transform:capitalize;color:var(--text-muted)">{{ a.classification }}</td>
              <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ a.reaction || '—' }}</td>
              <td>{{ a.severity || '—' }}</td>
              <td><span class="badge" [class.badge-red]="a.status==='active'" [class.badge-green]="a.status==='resolved'" [class.badge-gray]="a.status==='ruled_out'">{{ a.status }}</span></td>
            </tr>
            <tr *ngIf="!allergies.length"><td colspan="5"><div class="empty"><div class="empty-title">No allergy records — status: {{ patient.allergyStatus }}</div></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MEDICATIONS -->
    <div *ngIf="activeTab==='medications'">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <span style="font-size:0.8rem;color:var(--text-muted)">Current and historical medications</span>
        <button class="btn btn-primary btn-sm" (click)="showMedForm=!showMedForm">{{ showMedForm ? 'Cancel' : '+ Add Medication' }}</button>
      </div>
      <div *ngIf="showMedForm" class="form-panel">
        <form (ngSubmit)="addMedication()">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
            <div style="grid-column:span 2"><label class="field-label">Medicine Name *</label><input class="inp" [(ngModel)]="medForm.medicineNameSnapshot" name="medicineName" required /></div>
            <div><label class="field-label">Generic Name</label><input class="inp" [(ngModel)]="medForm.genericNameSnapshot" name="genericName" /></div>
            <div><label class="field-label">Strength</label><input class="inp" [(ngModel)]="medForm.strengthSnapshot" name="strength" placeholder="e.g. 5mg" /></div>
            <div><label class="field-label">Dose Amount</label><input class="inp" [(ngModel)]="medForm.doseAmount" name="doseAmount" /></div>
            <div><label class="field-label">Dose Unit</label><input class="inp" [(ngModel)]="medForm.doseUnit" name="doseUnit" placeholder="e.g. mg" /></div>
            <div><label class="field-label">Route</label><input class="inp" [(ngModel)]="medForm.route" name="route" placeholder="e.g. oral" /></div>
            <div><label class="field-label">Frequency</label><input class="inp" [(ngModel)]="medForm.frequency" name="frequency" /></div>
            <div><label class="field-label">Start Date</label><input type="date" class="inp" [(ngModel)]="medForm.startDate" name="startDate" /></div>
            <div><label class="field-label">Source</label>
              <select class="inp" [(ngModel)]="medForm.source" name="medSource">
                <option value="patient_reported">Patient reported</option><option value="clinician_document">Clinician document</option><option value="other">Other</option>
              </select>
            </div>
            <div style="grid-column:1/-1"><label class="field-label">Indication</label><input class="inp" [(ngModel)]="medForm.indication" name="indication" /></div>
            <div style="grid-column:1/-1"><label class="field-label">Prescriber</label><input class="inp" [(ngModel)]="medForm.prescriberName" name="prescriberName" /></div>
          </div>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="medLoading">{{ medLoading ? 'Saving…' : 'Save Medication' }}</button>
        </form>
      </div>
      <div class="card" style="margin-bottom:0">
        <table class="drt-table">
          <thead><tr><th>Medicine</th><th>Dose</th><th>Frequency</th><th>Indication</th><th>Status</th><th>Start</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let m of medications">
              <td><div style="font-weight:600">{{ m.medicineNameSnapshot }}</div><div *ngIf="m.genericNameSnapshot" style="font-size:0.72rem;color:var(--text-faint)">{{ m.genericNameSnapshot }}</div></td>
              <td>{{ m.doseAmount }} {{ m.doseUnit }}</td>
              <td>{{ m.frequency || '—' }}</td>
              <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ m.indication || '—' }}</td>
              <td><span class="badge" [class.badge-green]="m.status==='active'" [class.badge-red]="m.status==='discontinued'" [class.badge-amber]="m.status==='held'" [class.badge-gray]="m.status==='completed'">{{ m.status }}</span></td>
              <td>{{ m.startDate | date:'dd MMM yyyy' }}</td>
              <td><button *ngIf="m.status==='active'" (click)="discontinueMed(m)" class="btn btn-secondary btn-sm">Discontinue</button></td>
            </tr>
            <tr *ngIf="!medications.length"><td colspan="7"><div class="empty"><div class="empty-title">No medications recorded</div></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ENCOUNTERS -->
    <div *ngIf="activeTab==='encounters'">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <span style="font-size:0.8rem;color:var(--text-muted)">All encounters</span>
        <a [routerLink]="['/patients', patient.id, 'encounters', 'new']" class="btn btn-primary btn-sm">+ New Encounter</a>
      </div>
      <div *ngFor="let e of encounters" class="card">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:0.5rem">
            <span style="font-weight:700;font-size:0.82rem;text-transform:capitalize">{{ e.encounterType }}</span>
            <span class="badge" [class.badge-green]="e.status==='completed'" [class.badge-amber]="e.status==='in_progress'" [class.badge-blue]="e.status==='scheduled'">{{ e.status }}</span>
            <span *ngIf="e.amendedAt" class="badge badge-orange">Amended</span>
            <span style="font-size:0.72rem;color:var(--text-faint)">{{ e.encounterNumber }}</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem">
            <span style="font-size:0.72rem;color:var(--text-muted)">{{ e.startedAt | date:'dd MMM yyyy, HH:mm' }}</span>
            <a [routerLink]="['/encounters', e.id]" class="btn btn-secondary btn-sm">View</a>
          </div>
        </div>
        <div *ngIf="e.reason" class="card-body" style="font-size:0.82rem;color:var(--text-mid)">{{ e.reason }}</div>
      </div>
      <div *ngIf="!encounters.length" class="card"><div class="empty"><div class="empty-title">No encounters recorded</div></div></div>
    </div>

    <!-- FOLLOW-UPS -->
    <div *ngIf="activeTab==='followups'">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <span style="font-size:0.8rem;color:var(--text-muted)">Follow-ups</span>
        <button class="btn btn-primary btn-sm" (click)="showFollowUpForm=!showFollowUpForm">{{ showFollowUpForm ? 'Cancel' : '+ Schedule Follow-up' }}</button>
      </div>
      <div *ngIf="showFollowUpForm" class="form-panel">
        <form (ngSubmit)="addFollowUp()">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
            <div style="grid-column:1/-1"><label class="field-label">Reason *</label><input class="inp" [(ngModel)]="followUpForm.reason" name="fuReason" required /></div>
            <div><label class="field-label">Due Date/Time *</label><input type="datetime-local" class="inp" [(ngModel)]="followUpForm.dueAt" name="dueAt" required /></div>
          </div>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="followUpLoading">{{ followUpLoading ? 'Saving…' : 'Schedule' }}</button>
        </form>
      </div>
      <div *ngFor="let f of followUps" class="card">
        <div class="card-header">
          <span style="font-weight:600;font-size:0.82rem">{{ f.reason }}</span>
          <div style="display:flex;align-items:center;gap:0.5rem">
            <span style="font-size:0.72rem;color:var(--text-muted)">Due: {{ f.dueAt | date:'dd MMM yyyy' }}</span>
            <span class="badge" [class.badge-green]="f.status==='completed'" [class.badge-red]="f.status==='missed'" [class.badge-amber]="f.status==='scheduled'" [class.badge-gray]="f.status==='cancelled'">{{ f.status }}</span>
          </div>
        </div>
        <div *ngIf="f.outcomeNotes" class="card-body" style="font-size:0.82rem;color:var(--text-mid)">{{ f.outcomeNotes }}</div>
      </div>
      <div *ngIf="!followUps.length" class="card"><div class="empty"><div class="empty-title">No follow-ups recorded</div></div></div>
    </div>

    <!-- TIMELINE -->
    <div *ngIf="activeTab==='timeline'">
      <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem">Chronological care history</p>
      <div *ngFor="let event of timeline" style="display:flex;gap:1rem;align-items:flex-start;margin-bottom:0.75rem">
        <div style="width:10px;height:10px;border-radius:50%;margin-top:0.6rem;flex-shrink:0;background:var(--navy)"
          [style.background]="event.type==='encounter' ? 'var(--blue)' : event.type==='medication_change' ? '#f39c12' : event.type==='observation' ? '#27ae60' : event.type==='test_result' ? '#e74c3c' : 'var(--navy)'">
        </div>
        <div class="card" style="flex:1;margin-bottom:0">
          <div class="card-header">
            <span class="badge badge-gray" style="text-transform:uppercase">{{ event.type }}</span>
            <span style="font-size:0.72rem;color:var(--text-muted)">{{ event.date | date:'dd MMM yyyy, HH:mm' }}</span>
          </div>
          <div class="card-body" style="font-size:0.82rem;color:var(--text-mid)">
            <ng-container [ngSwitch]="event.type">
              <span *ngSwitchCase="'encounter'">{{ event.data.encounterType }} — {{ event.data.status }}</span>
              <span *ngSwitchCase="'medication_change'">{{ event.data.changeType }} medication</span>
              <span *ngSwitchCase="'observation'">{{ event.data.observationType }}: {{ event.data.valueNumeric ?? event.data.valueText }} {{ event.data.unit }}</span>
              <span *ngSwitchCase="'follow_up'">{{ event.data.reason }} — {{ event.data.status }}</span>
              <span *ngSwitchCase="'test_result'">{{ event.data.testName }}: {{ event.data.resultValue }}</span>
              <span *ngSwitchCase="'document'">{{ event.data.displayName }}</span>
              <span *ngSwitchDefault>{{ event.type }}</span>
            </ng-container>
          </div>
        </div>
      </div>
      <div *ngIf="!timeline.length" class="card"><div class="empty"><div class="empty-title">No timeline events</div></div></div>
    </div>

    <!-- VITALS & LABS -->
    <div *ngIf="activeTab==='vitals'">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <span style="font-size:0.8rem;color:var(--text-muted)">Vitals, haematology, biochemistry and other measurements</span>
        <button class="btn btn-primary btn-sm" (click)="showVitalsForm=!showVitalsForm">{{ showVitalsForm ? 'Cancel' : '+ Record Observation' }}</button>
      </div>

      <div *ngIf="showVitalsForm" class="form-panel">
        <form (ngSubmit)="addObservation()">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
            <div>
              <label class="field-label">Type *</label>
              <select class="inp" [(ngModel)]="vitalsForm.observationType" name="obsType" required>
                <optgroup label="Vitals">
                  <option value="blood_pressure_systolic">Blood Pressure — Systolic</option>
                  <option value="blood_pressure_diastolic">Blood Pressure — Diastolic</option>
                  <option value="pulse_rate">Pulse Rate</option>
                  <option value="temperature">Temperature</option>
                  <option value="oxygen_saturation">Oxygen Saturation (SpO2)</option>
                  <option value="weight">Weight</option>
                  <option value="height">Height</option>
                  <option value="bmi">BMI</option>
                  <option value="respiratory_rate">Respiratory Rate</option>
                </optgroup>
                <optgroup label="Blood Glucose">
                  <option value="blood_glucose_fasting">Blood Glucose — Fasting</option>
                  <option value="blood_glucose_random">Blood Glucose — Random</option>
                  <option value="blood_glucose_postprandial">Blood Glucose — Post-prandial</option>
                  <option value="hba1c">HbA1c</option>
                </optgroup>
                <optgroup label="Haematology">
                  <option value="haemoglobin">Haemoglobin (Hb)</option>
                  <option value="rbc">RBC Count</option>
                  <option value="wbc">WBC Count</option>
                  <option value="platelets">Platelets</option>
                  <option value="haematocrit">Haematocrit (PCV)</option>
                  <option value="mcv">MCV</option>
                  <option value="mch">MCH</option>
                  <option value="mchc">MCHC</option>
                  <option value="neutrophils">Neutrophils</option>
                  <option value="lymphocytes">Lymphocytes</option>
                  <option value="eosinophils">Eosinophils</option>
                  <option value="esr">ESR</option>
                  <option value="inr">INR / PT</option>
                </optgroup>
                <optgroup label="Renal Function">
                  <option value="creatinine">Creatinine</option>
                  <option value="urea">Urea / BUN</option>
                  <option value="egfr">eGFR</option>
                  <option value="sodium">Sodium (Na)</option>
                  <option value="potassium">Potassium (K)</option>
                  <option value="chloride">Chloride (Cl)</option>
                  <option value="bicarbonate">Bicarbonate</option>
                  <option value="uric_acid">Uric Acid</option>
                </optgroup>
                <optgroup label="Liver Function">
                  <option value="alt">ALT (SGPT)</option>
                  <option value="ast">AST (SGOT)</option>
                  <option value="alp">ALP</option>
                  <option value="bilirubin_total">Bilirubin — Total</option>
                  <option value="bilirubin_direct">Bilirubin — Direct</option>
                  <option value="albumin">Albumin</option>
                  <option value="total_protein">Total Protein</option>
                </optgroup>
                <optgroup label="Lipid Profile">
                  <option value="total_cholesterol">Total Cholesterol</option>
                  <option value="ldl_cholesterol">LDL Cholesterol</option>
                  <option value="hdl_cholesterol">HDL Cholesterol</option>
                  <option value="triglycerides">Triglycerides</option>
                  <option value="vldl_cholesterol">VLDL Cholesterol</option>
                </optgroup>
                <optgroup label="Thyroid">
                  <option value="tsh">TSH</option>
                  <option value="t3">T3 (Triiodothyronine)</option>
                  <option value="t4">T4 (Thyroxine)</option>
                </optgroup>
                <optgroup label="Infectious Disease">
                  <option value="cd4_count">CD4 Count</option>
                  <option value="hiv_viral_load">HIV Viral Load</option>
                  <option value="malaria_rdt">Malaria RDT</option>
                  <option value="widal_test">Widal Test</option>
                  <option value="hepatitis_b_sag">Hepatitis B sAg</option>
                  <option value="hepatitis_c_ab">Hepatitis C Ab</option>
                </optgroup>
                <optgroup label="Urinalysis">
                  <option value="urine_protein">Urine Protein</option>
                  <option value="urine_glucose">Urine Glucose</option>
                  <option value="urine_blood">Urine Blood</option>
                  <option value="urine_leucocytes">Urine Leucocytes</option>
                  <option value="urine_nitrites">Urine Nitrites</option>
                  <option value="urine_ph">Urine pH</option>
                </optgroup>
                <option value="other">Other</option>
              </select>
            </div>
            <div><label class="field-label">Value *</label><input class="inp" type="number" step="any" [(ngModel)]="vitalsForm.valueNumeric" name="valueNumeric" /></div>
            <div><label class="field-label">Unit</label><input class="inp" [(ngModel)]="vitalsForm.unit" name="unit" placeholder="e.g. mmHg, g/dL" /></div>
            <div><label class="field-label">Text Result</label><input class="inp" [(ngModel)]="vitalsForm.valueText" name="valueText" placeholder="For non-numeric results" /></div>
            <div><label class="field-label">Measured At</label><input class="inp" type="datetime-local" [(ngModel)]="vitalsForm.measuredAt" name="measuredAt" /></div>
            <div><label class="field-label">Source</label>
              <select class="inp" [(ngModel)]="vitalsForm.source" name="source">
                <option value="clinician_document">Clinician / In-house</option>
                <option value="patient_reported">Patient reported</option>
                <option value="imported">External lab</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style="grid-column:1/-1"><label class="field-label">Notes</label><input class="inp" [(ngModel)]="vitalsForm.notes" name="notes" /></div>
          </div>
          <button type="submit" class="btn btn-primary btn-sm" [disabled]="vitalsLoading">{{ vitalsLoading ? 'Saving…' : 'Save' }}</button>
        </form>
      </div>

      <!-- Grouped by type -->
      <div *ngFor="let key of obsKeys()" class="card" style="margin-bottom:1rem">
        <div class="card-header">
          <span class="card-title" style="text-transform:capitalize">{{ obsLabel(key) }}</span>
          <span *ngIf="refRange(key)" style="font-size:0.72rem;color:var(--text-muted)">Ref: {{ refRange(key)!.low }} – {{ refRange(key)!.high }} {{ refRange(key)!.unit }}</span>
        </div>
        <div style="overflow-x:auto">
          <table class="drt-table">
            <thead><tr><th>Value</th><th>Unit</th><th>Text Result</th><th>Flag</th><th>Measured</th><th>Source</th><th>Notes</th></tr></thead>
            <tbody>
              <tr *ngFor="let o of groupedObservations[key]">
                <td style="font-weight:700;font-size:1rem">{{ o.valueNumeric ?? '—' }}</td>
                <td style="color:var(--text-muted)">{{ o.unit || '—' }}</td>
                <td>{{ o.valueText || '—' }}</td>
                <td>
                  <span *ngIf="o.valueNumeric" class="badge" [class]="flagClass(key, +o.valueNumeric)">
                    {{ flagClass(key, +o.valueNumeric) === 'badge-red' ? 'Abnormal' : flagClass(key, +o.valueNumeric) === 'badge-green' ? 'Normal' : '—' }}
                  </span>
                  <span *ngIf="!o.valueNumeric" class="badge badge-gray">—</span>
                </td>
                <td style="color:var(--text-muted)">{{ o.measuredAt | date:'dd MMM yyyy, HH:mm' }}</td>
                <td style="text-transform:capitalize;color:var(--text-muted)">{{ o.source }}</td>
                <td style="color:var(--text-muted)">{{ o.notes || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="observations.length === 0" class="card"><div class="empty"><div class="empty-title">No observations recorded yet</div></div></div>
    </div>

  </div>
`;

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: OVERVIEW_TMPL
})
export class PatientDetailComponent implements OnInit {
  patient: any = null;
  conditions: any[] = [];
  allergies: any[] = [];
  medications: any[] = [];
  encounters: any[] = [];
  followUps: any[] = [];
  timeline: any[] = [];
  observations: any[] = [];
  activeTab = 'overview';
  tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'conditions', label: 'Conditions' },
    { key: 'allergies', label: 'Allergies' },
    { key: 'medications', label: 'Medications' },
    { key: 'encounters', label: 'Encounters' },
    { key: 'followups', label: 'Follow-ups' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'vitals', label: 'Vitals & Labs' },
  ];
  allergyStatusValue = 'not_assessed';
  showCondForm = false; condForm: any = { status: 'current', source: 'patient_reported', verificationStatus: 'unverified' }; condLoading = false;
  showAllergyForm = false; allergyForm: any = { classification: 'unknown', source: 'patient_reported' }; allergyLoading = false;
  showMedForm = false; medForm: any = { source: 'patient_reported' }; medLoading = false;
  showFollowUpForm = false; followUpForm: any = {}; followUpLoading = false;
  showVitalsForm = false; vitalsForm: any = { source: 'clinician_document' }; vitalsLoading = false;

  constructor(private patientService: PatientService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.patientService.getOne(id).subscribe(res => { this.patient = res.data; this.allergyStatusValue = res.data.allergyStatus; });
    this.patientService.getConditions(id).subscribe(res => this.conditions = res.data || []);
    this.patientService.getAllergies(id).subscribe(res => this.allergies = res.data || []);
    this.patientService.getMedications(id).subscribe(res => this.medications = res.data || []);
    this.patientService.getEncounters(id).subscribe(res => this.encounters = res.data || []);
    this.patientService.getFollowUps(id).subscribe(res => this.followUps = res.data || []);
    this.patientService.getTimeline(id).subscribe(res => this.timeline = res.data || []);
    this.patientService.getObservations(id).subscribe(res => this.observations = res.data || []);
  }

  saveAllergyStatus() {
    this.patientService.setAllergyStatus(this.patient.id, this.allergyStatusValue).subscribe(() => {
      this.patient.allergyStatus = this.allergyStatusValue;
    });
  }

  addCondition() {
    this.condLoading = true;
    this.patientService.addCondition(this.patient.id, this.condForm).subscribe({
      next: res => { this.conditions.unshift(res.data); this.condForm = { status: 'current', source: 'patient_reported', verificationStatus: 'unverified' }; this.showCondForm = false; this.condLoading = false; },
      error: () => this.condLoading = false
    });
  }

  addAllergy() {
    this.allergyLoading = true;
    this.patientService.addAllergy(this.patient.id, this.allergyForm).subscribe({
      next: res => { this.allergies.unshift(res.data); this.allergyForm = { classification: 'unknown', source: 'patient_reported' }; this.showAllergyForm = false; this.allergyLoading = false; this.patient.allergyStatus = 'allergies_present'; this.allergyStatusValue = 'allergies_present'; },
      error: () => this.allergyLoading = false
    });
  }

  addMedication() {
    this.medLoading = true;
    this.patientService.addMedication(this.patient.id, this.medForm).subscribe({
      next: res => { this.medications.unshift(res.data); this.medForm = { source: 'patient_reported' }; this.showMedForm = false; this.medLoading = false; },
      error: () => this.medLoading = false
    });
  }

  discontinueMed(med: any) {
    this.patientService.changeMedication(this.patient.id, med.id, { changeType: 'discontinued', reason: 'Discontinued via patient record', updates: { status: 'discontinued' } }).subscribe(res => {
      const idx = this.medications.findIndex(m => m.id === med.id);
      if (idx > -1) this.medications[idx] = res.data;
    });
  }

  addFollowUp() {
    this.followUpLoading = true;
    this.patientService.createFollowUp(this.patient.id, this.followUpForm).subscribe({
      next: res => { this.followUps.unshift(res.data); this.followUpForm = {}; this.showFollowUpForm = false; this.followUpLoading = false; },
      error: () => this.followUpLoading = false
    });
  }

  addObservation() {
    this.vitalsLoading = true;
    this.patientService.addObservation(this.patient.id, {
      ...this.vitalsForm,
      valueNumeric: this.vitalsForm.valueNumeric ? Number(this.vitalsForm.valueNumeric) : null,
    }).subscribe({
      next: res => { this.observations.unshift(res.data); this.vitalsForm = { source: 'clinician_document' }; this.showVitalsForm = false; this.vitalsLoading = false; },
      error: () => this.vitalsLoading = false
    });
  }

  get groupedObservations(): Record<string, any[]> {
    const g: Record<string, any[]> = {};
    for (const o of this.observations) {
      if (!g[o.observationType]) g[o.observationType] = [];
      g[o.observationType].push(o);
    }
    return g;
  }

  obsLabel(key: string): string { return key.replace(/_/g, ' '); }

  obsKeys(): string[] { return Object.keys(this.groupedObservations); }

  refRange(type: string): { low: number; high: number; unit: string } | null {
    const ranges: Record<string, { low: number; high: number; unit: string }> = {
      blood_pressure_systolic:  { low: 90,  high: 140, unit: 'mmHg' },
      blood_pressure_diastolic: { low: 60,  high: 90,  unit: 'mmHg' },
      blood_glucose_fasting:    { low: 3.9, high: 6.1, unit: 'mmol/L' },
      blood_glucose_random:     { low: 3.9, high: 7.8, unit: 'mmol/L' },
      hba1c:                    { low: 0,   high: 6.5, unit: '%' },
      weight:                   { low: 40,  high: 130, unit: 'kg' },
      bmi:                      { low: 18.5,high: 24.9,unit: 'kg/m²' },
      temperature:              { low: 36.1,high: 37.2,unit: '°C' },
      pulse_rate:               { low: 60,  high: 100, unit: 'bpm' },
      oxygen_saturation:        { low: 95,  high: 100, unit: '%' },
      haemoglobin:              { low: 12,  high: 17,  unit: 'g/dL' },
      rbc:                      { low: 4.0, high: 5.5, unit: '×10¹²/L' },
      wbc:                      { low: 4.0, high: 11.0,unit: '×10⁹/L' },
      platelets:                { low: 150, high: 400, unit: '×10⁹/L' },
      creatinine:               { low: 60,  high: 110, unit: 'µmol/L' },
      egfr:                     { low: 60,  high: 120, unit: 'mL/min/1.73m²' },
      sodium:                   { low: 135, high: 145, unit: 'mmol/L' },
      potassium:                { low: 3.5, high: 5.0, unit: 'mmol/L' },
      total_cholesterol:        { low: 0,   high: 5.2, unit: 'mmol/L' },
      ldl_cholesterol:          { low: 0,   high: 3.0, unit: 'mmol/L' },
      hdl_cholesterol:          { low: 1.0, high: 99,  unit: 'mmol/L' },
      triglycerides:            { low: 0,   high: 1.7, unit: 'mmol/L' },
      tsh:                      { low: 0.4, high: 4.0, unit: 'mIU/L' },
      alt:                      { low: 0,   high: 56,  unit: 'U/L' },
      ast:                      { low: 0,   high: 40,  unit: 'U/L' },
      cd4_count:                { low: 500, high: 1500,unit: 'cells/µL' },
    };
    return ranges[type] ?? null;
  }

  flagClass(type: string, value: number): string {
    const r = this.refRange(type);
    if (!r) return 'badge-gray';
    if (value < r.low || value > r.high) return 'badge-red';
    return 'badge-green';
  }
}
