import { Injectable, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import type { User } from "./models";

const API = "https://drr-server.vercel.app/api";
const TOKEN_KEY = "drr_token";
const USER_KEY = "drr_user";

@Injectable({ providedIn: "root" })
export class AuthService {
  private _user = signal<User | null>(this.readUser());
  private _token = signal<string>(localStorage.getItem(TOKEN_KEY) ?? "");

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token() && !!this._user());

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: User }>(`${API}/auth/login`, { email, password }).pipe(
      tap((res) => {
        this._token.set(res.token);
        this._user.set(res.user);
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      })
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set("");
    this._user.set(null);
  }

  private readUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
