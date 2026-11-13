import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  roles: string[];
}

const NAV: NavItem[] = [
  { label: 'Dashboard', route: '/dashboard',          icon: 'home', roles: ['applicant'] },
  { label: 'Dashboard', route: '/assessor/dashboard',  icon: 'home', roles: ['assessor'] },
  { label: 'Dashboard', route: '/admin/dashboard',     icon: 'home', roles: ['admin', 'super_admin'] },
  { label: 'My Applications',       route: '/my-applications',    icon: 'folder',      roles: ['applicant'] },
  { label: 'Compliance Directives', route: '/my-directives',      icon: 'bell',        roles: ['applicant'] },
  { label: 'New Submission',        route: '/new-application',    icon: 'plus-circle', roles: ['applicant'] },
  { label: 'Submitted Queue',       route: '/admin/submitted',    icon: 'inbox',       roles: ['admin', 'super_admin'] },
  { label: 'Registry',              route: '/admin/registry',     icon: 'table',       roles: ['admin', 'super_admin'] },
  { label: 'User Management',       route: '/super-admin/users',  icon: 'users',       roles: ['admin', 'super_admin'] },
  { label: 'My Assignments',        route: '/assessor/dashboard', icon: 'clipboard',   roles: ['assessor'] },
  { label: 'Lookup Lists',          route: '/super-admin/lookups',icon: 'list',        roles: ['super_admin'] },
  { label: 'Audit Trail',           route: '/super-admin/audit',  icon: 'shield',      roles: ['super_admin'] },
  { label: 'Reports',               route: '/super-admin/reports',icon: 'chart-bar',   roles: ['admin', 'super_admin'] },
  { label: 'My Profile',            route: '/profile',            icon: 'user',        roles: ['applicant', 'assessor', 'admin', 'super_admin'] },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 bg-primary-900 text-white flex flex-col h-full">
      <div class="px-6 py-5 border-b border-primary-800">
        <h2 class="text-lg font-bold leading-tight">BE Assessment</h2>
        <p class="text-xs text-primary-300 mt-0.5">NAFDAC System</p>
      </div>
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <a *ngFor="let item of visibleNav"
           [routerLink]="item.route"
           routerLinkActive="bg-primary-700 text-white"
           class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-primary-200 hover:bg-primary-800 hover:text-white transition-colors">
          <span class="text-primary-300">{{ item.label }}</span>
        </a>
      </nav>
      <div class="px-4 py-4 border-t border-primary-800">
        <div class="text-xs text-primary-400 mb-1 truncate">{{ auth.user()?.fullName }}</div>
        <div class="text-xs text-primary-500 capitalize mb-3">{{ auth.user()?.role?.replace('_', ' ') }}</div>
        <button (click)="auth.logout()" class="w-full text-left text-xs text-primary-400 hover:text-white transition-colors">
          Sign out
        </button>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  auth = inject(AuthService);

  get visibleNav() {
    const role = this.auth.role();
    return NAV.filter((item) => role && item.roles.includes(role));
  }
}
