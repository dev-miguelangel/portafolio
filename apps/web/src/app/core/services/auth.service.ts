import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthTokens, LoginPayload } from '../models/auth.model';

const TOKEN_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token = signal<string | null>(
    localStorage.getItem(TOKEN_KEY),
  );

  readonly isAuthenticated = computed(() => !!this._token());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(payload: LoginPayload) {
    return this.http
      .post<AuthTokens>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(
        tap(({ accessToken }) => {
          localStorage.setItem(TOKEN_KEY, accessToken);
          this._token.set(accessToken);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._token();
  }
}
