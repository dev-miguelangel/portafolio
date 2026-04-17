import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map } from 'rxjs';
import { NewsletterService } from '../../../core/services/newsletter.service';
import { NewsletterFormComponent } from '../../../shared/components/newsletter-form/newsletter-form.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-newsletter',
  imports: [RouterLink, DatePipe, NewsletterFormComponent, IconComponent],
  template: `
    <div class="max-w-4xl mx-auto px-6 py-16">
      <div class="text-center mb-16">
        <h1 class="text-3xl font-bold text-white mb-3">Newsletter</h1>
        <p class="text-white/40 text-sm max-w-md mx-auto mb-8">
          Actualizaciones sobre proyectos, ideas y reflexiones sobre desarrollo de software.
        </p>
        <app-newsletter-form />
      </div>

      <h2 class="text-lg font-semibold text-white/70 mb-6">Ediciones anteriores</h2>

      @if (newsletters()?.length) {
        <div class="flex flex-col gap-3">
          @for (item of newsletters()!; track item.id) {
            <a
              [routerLink]="['/newsletter', item.id]"
              class="card flex items-start justify-between gap-4 group"
            >
              <div class="flex-1 min-w-0">
                <p class="font-medium text-white/90 group-hover:text-white transition-colors truncate">
                  {{ item.title }}
                </p>
                <p class="text-sm text-white/50 mt-1 line-clamp-1">{{ item.summary }}</p>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="text-xs text-white/40">
                  {{ item.publishedAt | date: 'dd MMM yyyy' }}
                </span>
                <app-icon name="arrow_forward" [size]="14" class="text-white/20 group-hover:text-brand-green transition-colors" />
              </div>
            </a>
          }
        </div>
      } @else {
        <div class="text-center py-16 text-white/20">
          <app-icon name="mail_outline" [size]="40" />
          <p class="mt-3 text-sm">Próximamente...</p>
        </div>
      }
    </div>
  `,
})
export class NewsletterComponent {
  private newsletterService = inject(NewsletterService);

  readonly newsletters = toSignal(
    this.newsletterService.getAll(1, 20).pipe(
      map((res) => res.data),
      catchError(() => EMPTY),
    ),
  );
}
