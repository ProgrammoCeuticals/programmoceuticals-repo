import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import type { UserRole } from '../models';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/login']);
};

export const roleGuard = (...roles: UserRole[]): CanActivateFn =>
  () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
    if (roles.includes(auth.role()!)) return true;
    return router.createUrlTree(['/unauthorized']);
  };

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return true;
  const role = auth.role();
  if (role === 'admin' || role === 'super_admin') return router.createUrlTree(['/admin/dashboard']);
  if (role === 'assessor') return router.createUrlTree(['/assessor/dashboard']);
  return router.createUrlTree(['/dashboard']);
};
