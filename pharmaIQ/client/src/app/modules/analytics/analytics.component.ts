import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Population Health & Analytics</h1>
          <p class="page-subtitle">Clinical intelligence across your patient panel</p>
        </div>
      </div>

      <!-- Population Health KPIs -->
      <div class="stat-grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">
        <div class="stat-card">
          <div class="stat-icon"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
          <div><p class="stat-value">{{ pop?.totalActive ?? '—' }}</p><p class="stat-label">Active Patients</p></div>
        </div>
        <div class="stat-card accent-red">
          <div class="stat-icon" style="color:#e74c3c"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>
          <div><p class="stat-value">{{ pop?.polypharmacy ?? '—' }}</p><p class="stat-label">Polypharmacy (5+ meds)</p></div>
        </div>
        <div class="stat-card accent-amber">
          <div class="stat-icon" style="color:#f39c12"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
          <div><p class="stat-value">{{ pop?.lostToFollowUp ?? '—' }}</p><p class="stat-label">Lost to Follow-up</p></div>
        </div>
        <div class="stat-card accent-red">
          <div class="stat-icon" style="color:#e74c3c"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>
          <div><p class="stat-value">{{ pop?.unassessedAllergy ?? '—' }}</p><p class="stat-label">Allergy Not Assessed</p></div>
        </div>
        <div class="stat-card accent-amber">
          <div class="stat-icon" style="color:#f39c12"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div>
          <div><p class="stat-value">{{ pop?.overdueReview ?? '—' }}</p><p class="stat-label">Overdue Med Review</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg></div>
          <div><p class="stat-value">{{ pop?.noEncounterEver ?? '—' }}</p><p class="stat-label">Never Seen</p></div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.25rem">

        <!-- Encounter Volume Chart -->
        <div class="card" style="margin-bottom:0">
          <div class="card-header"><span class="card-title">Encounter Volume (12 months)</span></div>
          <div class="card-body">
            <div *ngIf="encounterVolume.length; else noData">
              <div style="display:flex;align-items:flex-end;gap:4px;height:120px;padding-bottom:4px">
                <div *ngFor="let m of encounterVolume"
                  style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;height:100%;justify-content:flex-end">
                  <span style="font-size:0.6rem;color:var(--text-faint)">{{ m.total }}</span>
                  <div [style.height.%]="barHeight(m.total, maxEncounterVol)"
                    style="width:100%;background:var(--navy);min-height:2px"></div>
                  <span style="font-size:0.58rem;color:var(--text-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;text-align:center">{{ m.month }}</span>
                </div>
              </div>
            </div>
            <ng-template #noData><div class="empty"><div class="empty-title">No data yet</div></div></ng-template>
          </div>
        </div>

        <!-- Registration Trend Chart -->
        <div class="card" style="margin-bottom:0">
          <div class="card-header"><span class="card-title">New Registrations (12 months)</span></div>
          <div class="card-body">
            <div *ngIf="registrationTrend.length; else noData2">
              <div style="display:flex;align-items:flex-end;gap:4px;height:120px;padding-bottom:4px">
                <div *ngFor="let m of registrationTrend"
                  style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;height:100%;justify-content:flex-end">
                  <span style="font-size:0.6rem;color:var(--text-faint)">{{ m.count }}</span>
                  <div [style.height.%]="barHeight(m.count, maxRegCount)"
                    style="width:100%;background:var(--blue);min-height:2px"></div>
                  <span style="font-size:0.58rem;color:var(--text-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;text-align:center">{{ m.month }}</span>
                </div>
              </div>
            </div>
            <ng-template #noData2><div class="empty"><div class="empty-title">No data yet</div></div></ng-template>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.25rem">

        <!-- Condition Prevalence -->
        <div class="card" style="margin-bottom:0">
          <div class="card-header"><span class="card-title">Top Conditions</span></div>
          <div class="card-body" style="padding:0">
            <table class="drt-table">
              <thead><tr><th>Condition</th><th style="text-align:right">Patients</th><th style="text-align:right">Active</th></tr></thead>
              <tbody>
                <tr *ngFor="let c of conditionPrevalence">
                  <td style="font-weight:600">{{ c.condition_name }}</td>
                  <td style="text-align:right">{{ c.patient_count }}</td>
                  <td style="text-align:right"><span class="badge badge-green">{{ c.active_count }}</span></td>
                </tr>
                <tr *ngIf="!conditionPrevalence.length"><td colspan="3"><div class="empty"><div class="empty-title">No data yet</div></div></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Follow-up Compliance -->
        <div class="card" style="margin-bottom:0">
          <div class="card-header"><span class="card-title">Follow-up Compliance (6 months)</span></div>
          <div class="card-body" style="padding:0">
            <table class="drt-table">
              <thead><tr><th>Month</th><th style="text-align:right">Total</th><th style="text-align:right">Completed</th><th style="text-align:right">Rate</th></tr></thead>
              <tbody>
                <tr *ngFor="let f of followUpCompliance">
                  <td>{{ f.month }}</td>
                  <td style="text-align:right">{{ f.total }}</td>
                  <td style="text-align:right">{{ f.completed }}</td>
                  <td style="text-align:right">
                    <span class="badge" [class.badge-green]="f.compliance_rate >= 80" [class.badge-amber]="f.compliance_rate >= 50 && f.compliance_rate < 80" [class.badge-red]="f.compliance_rate < 50">{{ f.compliance_rate }}%</span>
                  </td>
                </tr>
                <tr *ngIf="!followUpCompliance.length"><td colspan="4"><div class="empty"><div class="empty-title">No data yet</div></div></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- High Risk Patients -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">High-Risk Patient Panel</span>
          <span style="font-size:0.72rem;color:var(--text-muted)">Polypharmacy · Overdue follow-ups · Lost to follow-up</span>
        </div>
        <div style="overflow-x:auto">
          <table class="drt-table">
            <thead><tr><th>Patient</th><th>ID</th><th style="text-align:right">Active Meds</th><th style="text-align:right">Conditions</th><th style="text-align:right">Overdue F/U</th><th>Last Encounter</th><th>Allergy</th><th></th></tr></thead>
            <tbody>
              <tr *ngFor="let p of highRisk" class="clickable" [routerLink]="['/patients', p.id]">
                <td style="font-weight:600">{{ p.first_name }} {{ p.last_name }}</td>
                <td><span class="badge badge-navy">{{ p.patient_number }}</span></td>
                <td style="text-align:right">
                  <span class="badge" [class.badge-red]="p.active_med_count >= 5" [class.badge-amber]="p.active_med_count >= 3 && p.active_med_count < 5" [class.badge-gray]="p.active_med_count < 3">{{ p.active_med_count }}</span>
                </td>
                <td style="text-align:right">{{ p.active_condition_count }}</td>
                <td style="text-align:right">
                  <span *ngIf="p.overdue_followups > 0" class="badge badge-red">{{ p.overdue_followups }}</span>
                  <span *ngIf="p.overdue_followups == 0" class="badge badge-gray">0</span>
                </td>
                <td style="color:var(--text-muted)">{{ p.last_encounter_at ? (p.last_encounter_at | date:'dd MMM yyyy') : 'Never' }}</td>
                <td>
                  <span *ngIf="p.allergy_status==='allergies_present'" class="badge badge-red">⚠ Yes</span>
                  <span *ngIf="p.allergy_status!=='allergies_present'" class="badge badge-gray">—</span>
                </td>
                <td><a [routerLink]="['/patients', p.id]" class="btn btn-secondary btn-sm" (click)="$event.stopPropagation()">View</a></td>
              </tr>
              <tr *ngIf="!highRisk.length"><td colspan="8"><div class="empty"><div class="empty-title">No high-risk patients identified</div></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Polypharmacy List -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Polypharmacy Patients (5+ active medications)</span>
        </div>
        <div style="overflow-x:auto">
          <table class="drt-table">
            <thead><tr><th>Patient</th><th>ID</th><th style="text-align:right">Med Count</th><th>Active Medications</th><th></th></tr></thead>
            <tbody>
              <tr *ngFor="let p of polypharmacy">
                <td style="font-weight:600">{{ p.first_name }} {{ p.last_name }}</td>
                <td><span class="badge badge-navy">{{ p.patient_number }}</span></td>
                <td style="text-align:right"><span class="badge badge-red">{{ p.med_count }}</span></td>
                <td style="font-size:0.75rem;color:var(--text-muted);max-width:300px">{{ p.medications?.join(', ') }}</td>
                <td><a [routerLink]="['/patients', p.id]" class="btn btn-secondary btn-sm">View</a></td>
              </tr>
              <tr *ngIf="!polypharmacy.length"><td colspan="5"><div class="empty"><div class="empty-title">No polypharmacy patients</div></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  pop: any = null;
  highRisk: any[] = [];
  conditionPrevalence: any[] = [];
  encounterVolume: any[] = [];
  registrationTrend: any[] = [];
  polypharmacy: any[] = [];
  followUpCompliance: any[] = [];

  get maxEncounterVol() { return Math.max(...this.encounterVolume.map(m => Number(m.total)), 1); }
  get maxRegCount()     { return Math.max(...this.registrationTrend.map(m => Number(m.count)), 1); }

  barHeight(val: number, max: number): number {
    return Math.max(Math.round((Number(val) / max) * 100), 2);
  }

  constructor(private analytics: AnalyticsService) {}

  ngOnInit() {
    this.analytics.getPopulationHealth().subscribe({ next: r => this.pop = r.data, error: () => {} });
    this.analytics.getHighRisk().subscribe({ next: r => this.highRisk = r.data || [], error: () => {} });
    this.analytics.getConditionPrevalence().subscribe({ next: r => this.conditionPrevalence = r.data || [], error: () => {} });
    this.analytics.getEncounterVolume().subscribe({ next: r => this.encounterVolume = r.data || [], error: () => {} });
    this.analytics.getRegistrationTrend().subscribe({ next: r => this.registrationTrend = r.data || [], error: () => {} });
    this.analytics.getPolypharmacy().subscribe({ next: r => this.polypharmacy = r.data || [], error: () => {} });
    this.analytics.getFollowUpCompliance().subscribe({ next: r => this.followUpCompliance = r.data || [], error: () => {} });
  }
}
