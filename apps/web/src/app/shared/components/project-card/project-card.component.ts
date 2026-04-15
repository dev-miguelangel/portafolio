import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { ProjectSummary, ProjectStatus } from '../../../core/models/project.model';

const STATUS_MAP: Record<ProjectStatus, { label: string; classes: string }> = {
  idea: {
    label: 'Idea',
    classes: 'bg-white/5 text-white/40',
  },
  demo: {
    label: 'Demo',
    classes: 'bg-blue-500/10 text-blue-400',
  },
  production: {
    label: 'Producción',
    classes: 'bg-brand-green/10 text-brand-green',
  },
};

@Component({
  selector: 'app-project-card',
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <article class="card flex flex-col gap-4 group cursor-pointer" [routerLink]="['/proyectos', project().id]">
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mb-2"
            [ngClass]="statusConfig().classes"
          >
            {{ statusConfig().label }}
          </span>
          <h3 class="font-semibold text-white group-hover:text-brand-green transition-colors truncate">
            {{ project().title }}
          </h3>
        </div>
        <app-icon
          name="arrow_forward"
          [size]="16"
          class="text-white/20 group-hover:text-brand-green transition-colors mt-1 shrink-0"
        />
      </div>

      <p class="text-sm text-white/50 line-clamp-2 leading-relaxed">
        {{ project().description }}
      </p>

      @if (project().tags.length > 0) {
        <div class="flex flex-wrap gap-1.5 mt-auto pt-2">
          @for (tag of project().tags.slice(0, 4); track tag) {
            <span class="px-2 py-0.5 rounded text-xs bg-white/[0.04] text-white/30 border border-white/[0.06]">
              {{ tag }}
            </span>
          }
        </div>
      }

      <div class="flex items-center gap-3 pt-1 border-t border-white/[0.05]">
        @if (project().demoUrl) {
          <a
            [href]="project().demoUrl!"
            target="_blank"
            rel="noopener noreferrer"
            (click)="$event.stopPropagation()"
            class="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <app-icon name="play_circle" [size]="14" />
            Demo
          </a>
        }
        @if (project().productionUrl) {
          <a
            [href]="project().productionUrl!"
            target="_blank"
            rel="noopener noreferrer"
            (click)="$event.stopPropagation()"
            class="flex items-center gap-1.5 text-xs text-brand-green/70 hover:text-brand-green transition-colors"
          >
            <app-icon name="open_in_new" [size]="14" />
            Ver en producción
          </a>
        }
      </div>
    </article>
  `,
})
export class ProjectCardComponent {
  readonly project = input.required<ProjectSummary>();

  get statusConfig() {
    return () => STATUS_MAP[this.project().status];
  }
}
