import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import type { User } from '../models';

const API = 'http://localhost:4000/api/v1';
const TOKEN_KEY = 'be_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _user = signal<User | null>(null);

  user = this._user.asReadonly();
  isLoggedIn = computed(() => !!this._user());
  role = computed(() => this._user()?.role ?? null);

  isApplicant = computed(() => this._user()?.role === 'applicant');
  isAssessor = computed(() => this._user()?.role === 'assessor');
  isAdmin = computed(() => this._user()?.role === 'admin' || this._user()?.role === 'super_admin');
  isSuperAdmin = computed(() => this._user()?.role === 'super_admin');

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: User }>(`${API}/auth/login`, { email, password }).pipe(
      tap(({ token, user }) => {
        localStorage.setItem(TOKEN_KEY, token);
        this._user.set(user);
      }),
    );
  }

  registerApplicant(data: Record<string, unknown>) {
    return this.http.post<{ token: string; user: User }>(`${API}/auth/register-applicant`, data).pipe(
      tap(({ token, user }) => {
        localStorage.setItem(TOKEN_KEY, token);
        this._user.set(user);
      }),
    );
  }

  loadCurrentUser() {
    return this.http.get<{ user: User }>(`${API}/auth/me`).pipe(
      tap(({ user }) => this._user.set(user)),
    );
  }

  logout() {
    this.http.post(`${API}/auth/logout`, {}).subscribe();
    localStorage.removeItem(TOKEN_KEY);
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}
