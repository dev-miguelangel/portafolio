import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ProjectsService } from '../../../core/services/projects.service';
import { Project } from '../../../core/models/project.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, UpperCasePipe, IconComponent],
  template: `
    <div class="max-w-3xl mx-auto px-6 py-16">
      <a routerLink="/proyectos" class="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 mb-10 transition-colors">
        <app-icon name="arrow_back" [size]="16" />
        Volver a proyectos
      </a>

      @if (project()) {
        <article>
          <h1 class="text-3xl font-bold text-white mb-3">{{ project()!.title }}</h1>

          <div class="flex items-center gap-3 mb-8">
            <span class="text-xs text-white/30">
              {{ project()!.status | uppercase }}
            </span>
            @for (tag of project()!.tags; track tag) {
              <span class="px-2 py-0.5 rounded text-xs bg-white/[0.04] text-white/30 border border-white/[0.06]">
                {{ tag }}
              </span>
            }
          </div>

          <p class="text-white/60 leading-relaxed mb-10">
            {{ project()!.description }}
          </p>

          <div class="flex items-center gap-4">
            @if (project()!.demoUrl) {
              <a [href]="project()!.demoUrl!" target="_blank" rel="noopener noreferrer" class="btn-ghost">
                <app-icon name="play_circle" [size]="16" />
                Ver demo
              </a>
            }
            @if (project()!.productionUrl) {
              <a [href]="project()!.productionUrl!" target="_blank" rel="noopener noreferrer" class="btn-primary">
                <app-icon name="open_in_new" [size]="16" />
                Ir a producción
              </a>
            }
          </div>
        </article>
      } @else if (loading()) {
        <div class="flex items-center gap-2 text-white/30 text-sm">
          <app-icon name="hourglass_empty" [size]="16" />
          Cargando...
        </div>
      } @else {
        <div class="text-center py-20 text-white/20">
          <app-icon name="error_outline" [size]="40" />
          <p class="mt-3 text-sm">Proyecto no encontrado</p>
        </div>
      }
    </div>
  `,
})
export class ProjectDetailComponent implements OnInit {
  readonly id = input.required<string>();

  private projectsService = inject(ProjectsService);

  readonly project = signal<Project | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.projectsService.getById(this.id()).subscribe({
      next: (p) => {
        this.project.set(p);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
