import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./modules/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./shared/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'patients',
        loadComponent: () => import('./modules/patients/patients.component').then(m => m.PatientsComponent)
      },
      {
        path: 'patients/new',
        loadComponent: () => import('./modules/patients/patient-form.component').then(m => m.PatientFormComponent)
      },
      {
        path: 'patients/:id/edit',
        loadComponent: () => import('./modules/patients/patient-form.component').then(m => m.PatientFormComponent)
      },
      {
        path: 'patients/:id/encounters/new',
        loadComponent: () => import('./modules/encounters/encounter-form.component').then(m => m.EncounterFormComponent)
      },
      {
        path: 'patients/:id',
        loadComponent: () => import('./modules/patients/patient-detail.component').then(m => m.PatientDetailComponent)
      },
      {
        path: 'encounters/:id',
        loadComponent: () => import('./modules/encounters/encounter-detail.component').then(m => m.EncounterDetailComponent)
      },
      {
        path: 'follow-ups',
        loadComponent: () => import('./modules/followups/followups.component').then(m => m.FollowUpsComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./modules/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./modules/users/users.component').then(m => m.UsersComponent)
      },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
