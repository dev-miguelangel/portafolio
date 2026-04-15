import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, IconComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center px-6">
      <div class="w-full max-w-sm">
        <div class="flex justify-center mb-8">
          <span class="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center">
            <span class="w-4 h-4 rounded-full bg-brand-dark"></span>
          </span>
        </div>

        <h1 class="text-xl font-bold text-center text-white mb-1">Acceso admin</h1>
        <p class="text-xs text-center text-white/30 mb-8">Solo para uso personal</p>

        <form (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          <div>
            <label class="label">Correo</label>
            <input
              type="email"
              name="email"
              [(ngModel)]="email"
              required
              class="input-field"
              placeholder="tu@correo.com"
              autocomplete="email"
            />
          </div>

          <div>
            <label class="label">Contraseña</label>
            <input
              type="password"
              name="password"
              [(ngModel)]="password"
              required
              class="input-field"
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>

          @if (error()) {
            <p class="text-red-400 text-xs flex items-center gap-1.5">
              <app-icon name="error_outline" [size]="14" />
              {{ error() }}
            </p>
          }

          <button
            type="submit"
            class="btn-primary justify-center mt-2"
            [disabled]="loading()"
          >
            @if (loading()) {
              <app-icon name="hourglass_empty" [size]="16" />
              Ingresando...
            } @else {
              <app-icon name="login" [size]="16" />
              Ingresar
            }
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.loading.set(true);
    this.error.set(null);

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: () => {
        this.error.set('Credenciales incorrectas. Intenta nuevamente.');
        this.loading.set(false);
      },
    });
  }
}
