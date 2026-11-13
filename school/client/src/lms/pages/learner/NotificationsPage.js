import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../../services/api';
import { EmptyState } from '../../components/ui';
import './NotificationsPage.css';

const TYPE_ICONS = {
  payment: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  enrollment: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  announcement: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => studentService.getNotifications(50),
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const markReadMutation = useMutation({
    mutationFn: studentService.markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: studentService.markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <div className="notifications-page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>Notifications {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}</h1>
          <p>Your recent activity and updates.</p>
        </div>
        {unreadCount > 0 && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
          >
            Mark all read
          </button>
        )}
      </div>

      {isLoading
        ? <div className="page-loading" style={{ minHeight: 200 }}><div className="spinner" /></div>
        : notifications.length === 0
          ? <EmptyState title="No notifications" description="You're all caught up." />
          : (
            <div className="notifications-list">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`notification-item ${!n.isRead ? 'notification-item--unread' : ''}`}
                  onClick={() => !n.isRead && markReadMutation.mutate(n.id)}
                >
                  <div className={`notification-item__icon notification-item__icon--${n.type}`}>
                    {TYPE_ICONS[n.type] || TYPE_ICONS.announcement}
                  </div>
                  <div className="notification-item__body">
                    <span className="notification-item__title">{n.title}</span>
                    <span className="notification-item__msg">{n.message}</span>
                    <span className="notification-item__time">
                      {new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {!n.isRead && <div className="notification-item__dot" />}
                </div>
              ))}
            </div>
          )
      }
    </div>
  );
}
