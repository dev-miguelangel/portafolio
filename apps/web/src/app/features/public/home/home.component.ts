import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map } from 'rxjs';
import { ProjectsService } from '../../../core/services/projects.service';
import { ProjectCardComponent } from '../../../shared/components/project-card/project-card.component';
import { NewsletterFormComponent } from '../../../shared/components/newsletter-form/newsletter-form.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProjectCardComponent, NewsletterFormComponent, IconComponent],
  template: `
    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-6 pt-24 pb-16">
      <div class="max-w-2xl">
        <div class="flex items-center gap-2 mb-6">
          <span class="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
          <span class="text-xs text-white/40 font-mono">Disponible para colaborar</span>
        </div>

        <h1 class="text-5xl sm:text-6xl font-bold leading-tight mb-6">
          <span class="text-gradient">Hola, soy Miguelángel.</span><br />
          <span class="text-gradient-green">Construyo software</span><br />
          <span class="text-white/60">que resuelve problemas reales.</span>
        </h1>

        <p class="text-base text-white/50 leading-relaxed max-w-xl mb-8">
          Entusiasta creador de software enfocado en soluciones simples para problemas
          cotidianos y flujos complejos. Aquí comparto mis ideas, proyectos y avances.
        </p>

        <div class="flex items-center gap-3">
          <a routerLink="/proyectos" class="btn-primary">
            <app-icon name="grid_view" [size]="16" />
            Ver proyectos
          </a>
          <a routerLink="/newsletter" class="btn-ghost">
            <app-icon name="mail_outline" [size]="16" />
            Newsletter
          </a>
        </div>
      </div>
    </section>

    <!-- Projects preview -->
    <section class="max-w-6xl mx-auto px-6 pb-20">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-xl font-semibold text-white/80">Proyectos recientes</h2>
        <a routerLink="/proyectos" class="text-sm text-white/40 hover:text-brand-green transition-colors flex items-center gap-1">
          Ver todos
          <app-icon name="arrow_forward" [size]="14" />
        </a>
      </div>

      @if (projects()?.length) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (project of projects()!.slice(0, 6); track project.id) {
            <app-project-card [project]="project" />
          }
        </div>
      } @else {
        <div class="text-center py-16 text-white/20">
          <app-icon name="folder_open" [size]="40" variant="outlined" />
          <p class="mt-3 text-sm">Proyectos próximamente</p>
        </div>
      }
    </section>

    <!-- Newsletter CTA -->
    <section class="border-t border-white/5">
      <div class="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 class="text-2xl font-bold text-white mb-3">
          Mantente al tanto
        </h2>
        <p class="text-white/40 text-sm mb-8 max-w-md mx-auto">
          Suscríbete para recibir actualizaciones sobre nuevas ideas, proyectos y avances directamente en tu correo.
        </p>
        <app-newsletter-form />
      </div>
    </section>
  `,
})
export class HomeComponent {
  private projectsService = inject(ProjectsService);

  readonly projects = toSignal(
    this.projectsService.getAll(1, 6).pipe(
      map((res) => res.data),
      catchError(() => EMPTY),
    ),
  );
}
