import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import type { Notification } from '../../core/models';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div></div>
      <div class="flex items-center gap-4">
        <!-- Notifications -->
        <div class="relative">
          <button (click)="toggleNotifications()" class="relative p-2 text-gray-500 hover:text-gray-700">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span *ngIf="unreadCount > 0"
              class="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {{ unreadCount }}
            </span>
          </button>
          <div *ngIf="showNotifications"
            class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
            <div class="flex items-center justify-between px-4 py-3 border-b">
              <span class="text-sm font-semibold">Notifications</span>
              <button (click)="markAllRead()" class="text-xs text-primary-600 hover:underline">Mark all read</button>
            </div>
            <div *ngIf="notifications.length === 0" class="px-4 py-6 text-center text-sm text-gray-400">
              No notifications
            </div>
            <div *ngFor="let n of notifications"
              class="px-4 py-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer"
              [class.bg-blue-50]="!n.readAt"
              (click)="markRead(n)">
              <p class="text-sm font-medium text-gray-800">{{ n.title }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ n.message }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ n.createdAt | date:'short' }}</p>
            </div>
          </div>
        </div>
        <!-- User -->
        <div class="text-sm text-gray-700 font-medium">{{ auth.user()?.fullName }}</div>
      </div>
    </header>
  `,
})
export class TopbarComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);

  notifications: Notification[] = [];
  showNotifications = false;

  get unreadCount() {
    return this.notifications.filter((n) => !n.readAt).length;
  }

  ngOnInit() {
    this.api.getNotifications().subscribe(({ notifications }) => {
      this.notifications = notifications;
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  markRead(n: Notification) {
    if (!n.readAt) {
      this.api.markNotificationRead(n.id).subscribe();
      n.readAt = new Date().toISOString();
    }
    // Navigate to the relevant application if there is one
    if (n.applicationId) {
      this.showNotifications = false;
      const isAdmin = this.auth.isAdmin();
      const route = isAdmin ? ['/admin/applications', n.applicationId] : ['/applications', n.applicationId];
      this.router.navigate(route);
    }
  }

  markAllRead() {
    this.api.markAllNotificationsRead().subscribe();
    this.notifications.forEach((n) => (n.readAt = new Date().toISOString()));
  }
}
