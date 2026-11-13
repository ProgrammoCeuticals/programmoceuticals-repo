import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PatientService } from '../../core/services/patient.service';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-8 max-w-3xl">
      <div class="flex items-center gap-2 mb-6 text-sm">
        <a routerLink="/patients" class="text-slate-400 hover:text-slate-600">Patients</a>
        <span class="text-slate-300">/</span>
        <span class="text-slate-700 font-medium">{{ isEdit ? 'Edit Patient' : 'Register Patient' }}</span>
      </div>

      <!-- Duplicate warning -->
      <div *ngIf="duplicates.length > 0" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p class="text-sm font-semibold text-yellow-800 mb-2">⚠ Possible duplicate records detected</p>
        <p class="text-xs text-yellow-700 mb-2">Review before saving. Records are NOT automatically merged.</p>
        <div *ngFor="let d of duplicates" class="text-xs text-yellow-700">
          {{ d.firstName }} {{ d.lastName }} — {{ d.patientNumber }}
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-semibold text-slate-800 mb-6">{{ isEdit ? 'Edit Patient' : 'Register New Patient' }}</h2>
        <form (ngSubmit)="onSubmit()" #f="ngForm">

          <p class="section-label">Personal Information</p>
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label class="label">First Name *</label>
              <input class="input" [(ngModel)]="form.firstName" name="firstName" required />
            </div>
            <div>
              <label class="label">Middle Name</label>
              <input class="input" [(ngModel)]="form.middleName" name="middleName" />
            </div>
            <div>
              <label class="label">Last Name *</label>
              <input class="input" [(ngModel)]="form.lastName" name="lastName" required />
            </div>
            <div>
              <label class="label">Date of Birth</label>
              <input type="date" class="input" [(ngModel)]="form.dateOfBirth" name="dateOfBirth" />
            </div>
            <div>
              <label class="label">Gender</label>
              <select class="input" [(ngModel)]="form.gender" name="gender">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="unknown">Unknown / Not stated</option>
              </select>
            </div>
            <div>
              <label class="label">Registration Source</label>
              <select class="input" [(ngModel)]="form.registrationSource" name="registrationSource">
                <option value="">Select</option>
                <option value="walk_in">Walk-in</option>
                <option value="referral">Referral</option>
                <option value="outreach">Outreach</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="col-span-3">
              <label class="label">Address</label>
              <input class="input" [(ngModel)]="form.address" name="address" />
            </div>
          </div>

          <p class="section-label">Contact Details</p>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="label">Phone</label>
              <input class="input" [(ngModel)]="form.phone" name="phone" />
            </div>
            <div>
              <label class="label">Email</label>
              <input type="email" class="input" [(ngModel)]="form.email" name="email" />
            </div>
          </div>

          <p class="section-label">Emergency Contact</p>
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label class="label">Name</label>
              <input class="input" [(ngModel)]="form.emergencyName" name="emergencyName" />
            </div>
            <div>
              <label class="label">Relationship</label>
              <input class="input" [(ngModel)]="form.emergencyRelationship" name="emergencyRelationship" />
            </div>
            <div>
              <label class="label">Phone</label>
              <input class="input" [(ngModel)]="form.emergencyPhone" name="emergencyPhone" />
            </div>
          </div>

          <p class="section-label">Notes</p>
          <div class="mb-6">
            <textarea class="input" rows="2" [(ngModel)]="form.notes" name="notes"
              placeholder="Optional staff notes (restricted access)"></textarea>
          </div>

          <div *ngIf="errorMsg" class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{{ errorMsg }}</div>
          <div class="flex gap-3">
            <button type="submit" class="btn-primary" [disabled]="loading">
              {{ loading ? 'Saving...' : (isEdit ? 'Update Patient' : 'Register Patient') }}
            </button>
            <a routerLink="/patients" class="btn-outline">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`.section-label { @apply text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block; }`]
})
export class PatientFormComponent implements OnInit {
  form: any = {};
  isEdit = false;
  loading = false;
  errorMsg = '';
  duplicates: any[] = [];

  constructor(private patientService: PatientService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && this.route.snapshot.url.some(s => s.path === 'edit')) {
      this.isEdit = true;
      this.patientService.getOne(id).subscribe(res => {
        const p = res.data;
        const phone = p.contacts?.find((c: any) => c.contactType === 'phone')?.value;
        const email = p.contacts?.find((c: any) => c.contactType === 'email')?.value;
        const ec = p.emergencyContacts?.[0];
        this.form = {
          ...p, phone, email,
          emergencyName: ec?.name, emergencyRelationship: ec?.relationship, emergencyPhone: ec?.phone,
        };
      });
    }
  }

  onSubmit() {
    this.loading = true;
    this.errorMsg = '';
    this.duplicates = [];
    const id = this.route.snapshot.paramMap.get('id');
    const req = this.isEdit
      ? this.patientService.update(id!, this.form)
      : this.patientService.create(this.form);

    req.subscribe({
      next: res => {
        if (res.data?.duplicateWarnings?.length) {
          this.duplicates = res.data.duplicateWarnings;
        }
        this.router.navigate(['/patients', res.data.patient?.id ?? res.data.id]);
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Error saving patient';
        this.loading = false;
      }
    });
  }
}
