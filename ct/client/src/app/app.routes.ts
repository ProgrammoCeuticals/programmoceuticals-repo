import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/guards/auth.guard';
import { ShellComponent } from './layout/shell/shell.component';
import { HomeRedirectComponent } from './core/home-redirect.component';

export const routes: Routes = [
  // Public
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },

  // Authenticated shell
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeRedirectComponent, pathMatch: 'full' },

      // Applicant dashboard
      {
        path: 'dashboard',
        canActivate: [roleGuard('applicant')],
        loadComponent: () => import('./features/applicant/dashboard-page/applicant-dashboard.component').then((m) => m.ApplicantDashboardComponent),
      },

      // Admin dashboard
      {
        path: 'admin/dashboard',
        canActivate: [roleGuard('admin', 'super_admin')],
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
      },

      // Assessor dashboard
      {
        path: 'assessor/dashboard',
        canActivate: [roleGuard('assessor')],
        loadComponent: () => import('./features/assessor/dashboard/assessor-dashboard.component').then((m) => m.AssessorDashboardComponent),
      },

      // Applicant
      {
        path: 'applications/:applicationId/status',
        canActivate: [roleGuard('applicant')],
        loadComponent: () => import('./features/applicant/status/submission-status.component').then((m) => m.SubmissionStatusComponent),
      },
      {
        path: 'my-directives',
        canActivate: [roleGuard('applicant')],
        loadComponent: () => import('./features/applicant/compliance-view/my-directives.component').then((m) => m.MyDirectivesComponent),
      },
      {
        path: 'my-applications',
        canActivate: [roleGuard('applicant')],
        loadComponent: () => import('./features/applicant/my-applications/my-applications.component').then((m) => m.MyApplicationsComponent),
      },
      {
        path: 'new-application',
        canActivate: [roleGuard('applicant')],
        loadComponent: () => import('./features/applicant/new-application/new-application.component').then((m) => m.NewApplicationComponent),
      },

      // Shared application detail — all roles
      {
        path: 'applications/:applicationId',
        loadComponent: () => import('./features/admin/screening/application-detail.component').then((m) => m.ApplicationDetailComponent),
      },
      {
        path: 'admin/applications/:applicationId',
        canActivate: [roleGuard('admin', 'super_admin')],
        loadComponent: () => import('./features/admin/screening/application-detail.component').then((m) => m.ApplicationDetailComponent),
      },

      // Admin
      {
        path: 'admin/submitted',
        canActivate: [roleGuard('admin', 'super_admin')],
        loadComponent: () => import('./features/admin/submitted-queue/submitted-queue.component').then((m) => m.SubmittedQueueComponent),
      },
      {
        path: 'admin/registry',
        canActivate: [roleGuard('admin', 'super_admin')],
        loadComponent: () => import('./features/admin/registry/registry.component').then((m) => m.RegistryComponent),
      },

      // Assessor
      {
        path: 'assessor/review/:assignmentId',
        canActivate: [roleGuard('assessor')],
        loadComponent: () => import('./features/assessor/review/assessor-review.component').then((m) => m.AssessorReviewComponent),
      },

      // Super Admin
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'super-admin/users',
        canActivate: [roleGuard('admin', 'super_admin')],
        loadComponent: () => import('./features/super-admin/users/user-management.component').then((m) => m.UserManagementComponent),
      },
      {
        path: 'super-admin/lookups',
        canActivate: [roleGuard('super_admin')],
        loadComponent: () => import('./features/super-admin/lookups/lookup-management.component').then((m) => m.LookupManagementComponent),
      },
      {
        path: 'super-admin/audit',
        canActivate: [roleGuard('super_admin')],
        loadComponent: () => import('./features/super-admin/audit-trail/audit-trail.component').then((m) => m.AuditTrailComponent),
      },
      {
        path: 'super-admin/reports',
        canActivate: [roleGuard('admin', 'super_admin')],
        loadComponent: () => import('./features/super-admin/reports/reports.component').then((m) => m.ReportsComponent),
      },

      // Unauthorized
      {
        path: 'unauthorized',
        loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
    ],
  },

  { path: '**', component: HomeRedirectComponent },
];
