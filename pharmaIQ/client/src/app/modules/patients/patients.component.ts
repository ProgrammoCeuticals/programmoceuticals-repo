import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../core/services/patient.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Patients</h1>
          <p class="page-subtitle">{{ total }} record{{ total !== 1 ? 's' : '' }}</p>
        </div>
        <a routerLink="/patients/new" class="btn btn-primary">+ Register Patient</a>
      </div>

      <div class="card" style="margin-bottom:0">
        <div class="card-header">
          <span class="card-title">Patient Registry</span>
          <div class="search-wrap" style="width:260px;margin-bottom:0">
            <svg class="search-icon" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input class="inp" placeholder="Search name, ID or phone…" [(ngModel)]="search" (input)="onSearch()" />
          </div>
        </div>

        <div style="overflow-x:auto">
          <table class="drt-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Allergies</th>
                <th>Status</th>
                <th>Registered</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of patients" class="clickable" [routerLink]="['/patients', p.id]">
                <td><span class="badge badge-navy">{{ p.patient_number || p.patientNumber }}</span></td>
                <td style="font-weight:600;color:var(--text-dark)">{{ p.first_name || p.firstName }} {{ p.last_name || p.lastName }}</td>
                <td style="text-transform:capitalize;color:var(--text-muted)">{{ p.gender || '—' }}</td>
                <td>{{ p.phone || '—' }}</td>
                <td>
                  <span *ngIf="allergyStatus(p)==='allergies_present'" class="badge badge-red">⚠ Allergies</span>
                  <span *ngIf="allergyStatus(p)==='no_known_allergies'" class="badge badge-green">None Known</span>
                  <span *ngIf="allergyStatus(p)==='not_assessed'" class="badge badge-gray">Not Assessed</span>
                  <span *ngIf="allergyStatus(p)==='unknown'" class="badge badge-amber">Unknown</span>
                </td>
                <td><span [class]="p.status==='active' ? 'badge badge-green' : 'badge badge-gray'">{{ p.status }}</span></td>
                <td style="color:var(--text-muted)">{{ (p.registered_at || p.registeredAt) | date:'dd MMM yyyy' }}</td>
                <td><a [routerLink]="['/patients', p.id]" class="btn btn-secondary btn-sm" (click)="$event.stopPropagation()">View</a></td>
              </tr>
              <tr *ngIf="patients.length===0 && !loading">
                <td colspan="8"><div class="empty"><div class="empty-title">{{ search ? 'No patients match your search' : 'No patients registered yet' }}</div></div></td>
              </tr>
              <tr *ngIf="loading">
                <td colspan="8"><div class="loading">Loading…</div></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" *ngIf="total > 0">
          <span>Showing {{ rangeStart }}–{{ rangeEnd }} of {{ total }}</span>
          <div class="pagination-btns">
            <button class="btn btn-secondary btn-sm" [disabled]="page===1" [attr.disabled]="page===1 ? true : null" (click)="goTo(1)">«</button>
            <button class="btn btn-secondary btn-sm" [disabled]="page===1" [attr.disabled]="page===1 ? true : null" (click)="goTo(page-1)">‹ Prev</button>
            <ng-container *ngFor="let pg of pageNumbers">
              <button *ngIf="pg !== -1" class="btn btn-sm" [class.btn-primary]="pg===page" [class.btn-secondary]="pg!==page" (click)="goTo(pg)">{{ pg }}</button>
              <span *ngIf="pg===-1" style="color:var(--text-faint);padding:0 0.25rem">…</span>
            </ng-container>
            <button class="btn btn-secondary btn-sm" [disabled]="page===pages" [attr.disabled]="page===pages ? true : null" (click)="goTo(page+1)">Next ›</button>
            <button class="btn btn-secondary btn-sm" [disabled]="page===pages" [attr.disabled]="page===pages ? true : null" (click)="goTo(pages)">»</button>
          </div>
          <span style="color:var(--text-faint)">Page {{ page }} of {{ pages }}</span>
        </div>
      </div>
    </div>
  `
})
export class PatientsComponent implements OnInit {
  patients: any[] = [];
  search = '';
  loading = false;
  page = 1;
  pages = 1;
  total = 0;
  limit = 20;
  private searchTimer: any;

  constructor(private patientService: PatientService) {}
  ngOnInit() { this.load(); }

  allergyStatus(p: any): string {
    return p.allergy_status || p.allergyStatus || 'not_assessed';
  }

  get rangeStart() { return Math.min((this.page - 1) * this.limit + 1, this.total); }
  get rangeEnd()   { return Math.min(this.page * this.limit, this.total); }

  get pageNumbers(): number[] {
    const pages = this.pages;
    const cur = this.page;
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const nums: number[] = [1];
    if (cur > 3) nums.push(-1);
    for (let i = Math.max(2, cur - 1); i <= Math.min(pages - 1, cur + 1); i++) nums.push(i);
    if (cur < pages - 2) nums.push(-1);
    nums.push(pages);
    return nums;
  }

  load() {
    this.loading = true;
    this.patientService.getAll(this.search, this.page).subscribe({
      next: res => {
        const d = res.data;
        this.patients = d.patients || d || [];
        this.total    = d.total  ?? this.patients.length;
        this.pages    = d.pages  ?? 1;
        this.loading  = false;
      },
      error: () => this.loading = false
    });
  }

  onSearch() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.page = 1; this.load(); }, 300);
  }

  goTo(p: number) {
    if (p < 1 || p > this.pages) return;
    this.page = p;
    this.load();
  }
}
