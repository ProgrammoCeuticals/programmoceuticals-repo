import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FollowUpService } from '../../core/services/followup.service';

@Component({
  selector: 'app-followups',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Follow-up Queue</h1>
          <p class="page-subtitle">{{ queue.length }} follow-up{{ queue.length !== 1 ? 's' : '' }} in queue</p>
        </div>
      </div>

      <div class="seg-tabs">
        <button *ngFor="let f of filters" class="seg-tab" [class.active]="activeFilter===f.key" (click)="activeFilter=f.key">
          {{ f.label }}
          <span *ngIf="count(f.key) > 0" style="margin-left:0.3rem;background:rgba(255,255,255,0.25);padding:0 5px;border-radius:2px;font-size:0.68rem">{{ count(f.key) }}</span>
        </button>
      </div>

      <div class="card" style="margin-bottom:0">
        <table class="drt-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Reason</th>
              <th>Due</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let f of filtered">
              <td>
                <a [routerLink]="['/patients', f.patient_id || f.patientId]" style="font-weight:600;color:var(--navy);text-decoration:none">
                  {{ f.patient_first_name || f.patientFirstName || '—' }} {{ f.patient_last_name || f.patientLastName || '' }}
                </a>
                <div *ngIf="f.patient_number || f.patientNumber" style="font-size:0.7rem;color:var(--text-faint)">{{ f.patient_number || f.patientNumber }}</div>
              </td>
              <td style="max-width:220px">{{ f.reason }}</td>
              <td>
                <span style="font-size:0.8rem;color:var(--text-mid)">{{ f.dueAt | date:'dd MMM yyyy' }}</span>
                <div style="font-size:0.7rem;color:var(--text-faint)">{{ f.dueAt | date:'HH:mm' }}</div>
              </td>
              <td>
                <span *ngIf="f.isOverdue" class="badge badge-red">Overdue</span>
                <span *ngIf="f.isDueToday && !f.isOverdue" class="badge badge-amber">Due Today</span>
                <span *ngIf="!f.isOverdue && !f.isDueToday" class="badge badge-blue">Upcoming</span>
              </td>
              <td style="color:var(--text-muted)">{{ f.assignedUser?.firstName || '—' }}</td>
              <td>
                <div style="display:flex;gap:0.35rem">
                  <button class="btn btn-secondary btn-sm" (click)="updateStatus(f, 'completed')" style="color:#155724;border-color:#c3e6cb">✓ Complete</button>
                  <button class="btn btn-secondary btn-sm" (click)="updateStatus(f, 'missed')" style="color:#721c24;border-color:#f5c6cb">✗ Missed</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filtered.length===0 && !loading">
              <td colspan="6">
                <div class="empty">
                  <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="color:var(--border-dark);margin-bottom:0.5rem">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <div class="empty-title">No follow-ups in this category</div>
                </div>
              </td>
            </tr>
            <tr *ngIf="loading">
              <td colspan="6"><div class="loading">Loading…</div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class FollowUpsComponent implements OnInit {
  queue: any[] = [];
  activeFilter = 'all';
  loading = false;
  filters = [
    { key: 'all',      label: 'All' },
    { key: 'overdue',  label: 'Overdue' },
    { key: 'today',    label: 'Due Today' },
    { key: 'upcoming', label: 'Upcoming' },
  ];

  constructor(private followUpService: FollowUpService) {}

  ngOnInit() {
    this.loading = true;
    this.followUpService.getQueue().subscribe({
      next: res => { this.queue = res.data || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  get filtered() {
    if (this.activeFilter === 'overdue')  return this.queue.filter(f => f.isOverdue);
    if (this.activeFilter === 'today')    return this.queue.filter(f => f.isDueToday && !f.isOverdue);
    if (this.activeFilter === 'upcoming') return this.queue.filter(f => !f.isOverdue && !f.isDueToday);
    return this.queue;
  }

  count(key: string): number {
    if (key === 'all')      return this.queue.length;
    if (key === 'overdue')  return this.queue.filter(f => f.isOverdue).length;
    if (key === 'today')    return this.queue.filter(f => f.isDueToday && !f.isOverdue).length;
    if (key === 'upcoming') return this.queue.filter(f => !f.isOverdue && !f.isDueToday).length;
    return 0;
  }

  updateStatus(followUp: any, status: string) {
    this.followUpService.update(followUp.id, { status }).subscribe({
      next: () => {
        const idx = this.queue.findIndex(f => f.id === followUp.id);
        if (idx > -1) this.queue.splice(idx, 1);
      },
      error: () => {}
    });
  }
}
