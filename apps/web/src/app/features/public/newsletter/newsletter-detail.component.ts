import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NewsletterService } from '../../../core/services/newsletter.service';
import { Newsletter } from '../../../core/models/newsletter.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-newsletter-detail',
  imports: [RouterLink, IconComponent, DatePipe],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-16">
      <a routerLink="/newsletter" class="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 mb-10 transition-colors">
        <app-icon name="arrow_back" [size]="16" />
        Newsletter
      </a>

      @if (newsletter()) {
        <article>
          <header class="mb-10">
            <p class="text-xs text-white/25 font-mono mb-3">
              {{ newsletter()!.publishedAt | date: 'dd MMMM yyyy' }}
            </p>
            <h1 class="text-2xl font-bold text-white mb-2">
              {{ newsletter()!.title }}
            </h1>
            <p class="text-white/40 text-sm">{{ newsletter()!.summary }}</p>
          </header>

          <div
            class="prose prose-invert prose-sm max-w-none text-white/60 leading-relaxed"
            [innerHTML]="newsletter()!.content"
          ></div>
        </article>
      } @else if (loading()) {
        <div class="flex items-center gap-2 text-white/30 text-sm">
          <app-icon name="hourglass_empty" [size]="16" />
          Cargando...
        </div>
      } @else {
        <div class="text-center py-20 text-white/20">
          <app-icon name="error_outline" [size]="40" />
          <p class="mt-3 text-sm">Edición no encontrada</p>
        </div>
      }
    </div>
  `,
})
export class NewsletterDetailComponent implements OnInit {
  readonly id = input.required<string>();

  private newsletterService = inject(NewsletterService);

  readonly newsletter = signal<Newsletter | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.newsletterService.getById(this.id()).subscribe({
      next: (n) => {
        this.newsletter.set(n);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
