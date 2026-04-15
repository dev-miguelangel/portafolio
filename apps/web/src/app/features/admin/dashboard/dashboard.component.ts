import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, EMPTY, map } from 'rxjs';
import { ProjectsService } from '../../../core/services/projects.service';
import { NewsletterService } from '../../../core/services/newsletter.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, IconComponent],
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p class="text-white/30 text-sm mb-10">Vista general del portafolio</p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div class="card">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs text-white/30 mb-1">Proyectos</p>
              <p class="text-3xl font-bold text-white">{{ stats()?.projects ?? '—' }}</p>
            </div>
            <app-icon name="folder" [size]="22" class="text-white/15" variant="outlined" />
          </div>
          <a routerLink="/admin/proyectos" class="mt-4 text-xs text-white/30 hover:text-brand-green transition-colors flex items-center gap-1">
            Administrar
            <app-icon name="arrow_forward" [size]="12" />
          </a>
        </div>

        <div class="card">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs text-white/30 mb-1">Newsletters</p>
              <p class="text-3xl font-bold text-white">{{ stats()?.newsletters ?? '—' }}</p>
            </div>
            <app-icon name="mail" [size]="22" class="text-white/15" variant="outlined" />
          </div>
          <a routerLink="/admin/newsletters" class="mt-4 text-xs text-white/30 hover:text-brand-green transition-colors flex items-center gap-1">
            Administrar
            <app-icon name="arrow_forward" [size]="12" />
          </a>
        </div>

        <div class="card">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs text-white/30 mb-1">Suscriptores</p>
              <p class="text-3xl font-bold text-white">{{ stats()?.subscribers ?? '—' }}</p>
            </div>
            <app-icon name="group" [size]="22" class="text-white/15" variant="outlined" />
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <a routerLink="/admin/proyectos" class="btn-primary">
          <app-icon name="add" [size]="16" />
          Nuevo proyecto
        </a>
        <a routerLink="/admin/newsletters" class="btn-ghost">
          <app-icon name="edit" [size]="16" />
          Nueva edición
        </a>
        <a routerLink="/" target="_blank" class="btn-ghost">
          <app-icon name="open_in_new" [size]="16" />
          Ver sitio
        </a>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  private projectsService = inject(ProjectsService);
  private newsletterService = inject(NewsletterService);

  readonly stats = toSignal(
    combineLatest([
      this.projectsService.getAll(1, 1),
      this.newsletterService.getAll(1, 1),
      this.newsletterService.getSubscribers(),
    ]).pipe(
      map(([projects, newsletters, subscribers]) => ({
        projects: projects.total,
        newsletters: newsletters.total,
        subscribers: subscribers.length,
      })),
      catchError(() => EMPTY),
    ),
  );
}
