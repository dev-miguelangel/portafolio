import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../../core/services/newsletter.service';
import { IconComponent } from '../icon/icon.component';

type FormState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-newsletter-form',
  imports: [FormsModule, IconComponent],
  template: `
    <div class="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      @if (state() === 'success') {
        <div class="flex items-center gap-2 text-brand-green text-sm font-medium">
          <app-icon name="check_circle" [size]="20" />
          Suscrito correctamente. Recibirás las actualizaciones pronto.
        </div>
      } @else {
        <form
          class="flex w-full gap-2"
          (ngSubmit)="onSubmit()"
          #f="ngForm"
        >
          <input
            type="email"
            name="email"
            [(ngModel)]="email"
            required
            email
            placeholder="tu@correo.com"
            class="input-field flex-1"
            [disabled]="state() === 'loading'"
            autocomplete="email"
          />
          <button
            type="submit"
            class="btn-primary shrink-0"
            [disabled]="state() === 'loading' || !f.valid"
          >
            @if (state() === 'loading') {
              <app-icon name="hourglass_empty" [size]="16" />
            } @else {
              <app-icon name="send" [size]="16" />
            }
            Suscribirse
          </button>
        </form>
        @if (state() === 'error') {
          <p class="text-red-400 text-xs flex items-center gap-1">
            <app-icon name="error_outline" [size]="14" />
            Ocurrió un error. Intenta nuevamente.
          </p>
        }
      }
    </div>
  `,
})
export class NewsletterFormComponent {
  email = '';
  readonly state = signal<FormState>('idle');

  constructor(private newsletterService: NewsletterService) {}

  onSubmit(): void {
    if (!this.email) return;

    this.state.set('loading');
    this.newsletterService.subscribe(this.email).subscribe({
      next: () => this.state.set('success'),
      error: () => this.state.set('error'),
    });
  }
}
