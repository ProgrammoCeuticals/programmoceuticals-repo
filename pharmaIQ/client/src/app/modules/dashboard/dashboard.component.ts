import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Pharmacy patient management overview</p>
        </div>
        <a routerLink="/patients/new" class="btn btn-primary">+ Register Patient</a>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div>
            <p class="stat-value">{{ stats?.totalPatients ?? '—' }}</p>
            <p class="stat-label">Total Patients</p>
          </div>
        </div>

        <div class="stat-card accent-blue">
          <div class="stat-icon" style="color:var(--blue)">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <div>
            <p class="stat-value">{{ stats?.newThisMonth ?? '—' }}</p>
            <p class="stat-label">New This Month</p>
          </div>
        </div>

        <div class="stat-card accent-green">
          <div class="stat-icon" style="color:#27ae60">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div>
            <p class="stat-value">{{ stats?.encountersToday ?? '—' }}</p>
            <p class="stat-label">Encounters Today</p>
          </div>
        </div>

        <div class="stat-card accent-amber">
          <div class="stat-icon" style="color:#f39c12">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
            </svg>
          </div>
          <div>
            <p class="stat-value">{{ stats?.activeMedications ?? '—' }}</p>
            <p class="stat-label">Active Medications</p>
          </div>
        </div>

        <div class="stat-card accent-red">
          <div class="stat-icon" style="color:#e74c3c">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <p class="stat-value">{{ stats?.overdueFollowUps ?? '—' }}</p>
            <p class="stat-label">Overdue Follow-ups</p>
          </div>
        </div>

        <div class="stat-card accent-red">
          <div class="stat-icon" style="color:#e74c3c">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <p class="stat-value">{{ stats?.allergyFlagged ?? '—' }}</p>
            <p class="stat-label">Allergy Flagged</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">Quick Actions</span></div>
        <div class="card-body">
          <div class="action-grid">
            <a routerLink="/patients/new" class="action-card">
              <div class="action-icon">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
              </div>
              <div>
                <div class="action-label">Register Patient</div>
                <div class="action-sub">Add a new patient record</div>
              </div>
            </a>
            <a routerLink="/patients" class="action-card">
              <div class="action-icon">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <div>
                <div class="action-label">Find a Patient</div>
                <div class="action-sub">Search by name, ID or phone</div>
              </div>
            </a>
            <a routerLink="/follow-ups" class="action-card">
              <div class="action-icon" style="color:#e74c3c">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <div class="action-label">Follow-up Queue</div>
                <div class="action-sub">View due and overdue follow-ups</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  constructor(private dashboardService: DashboardService) {}
  ngOnInit() {
    this.dashboardService.getStats().subscribe({ next: res => this.stats = res.data, error: () => {} });
  }
}
