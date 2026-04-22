import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map } from 'rxjs';
import { ProjectsService } from '../../../core/services/projects.service';
import { ProjectCardComponent } from '../../../shared/components/project-card/project-card.component';
import { ProjectModalComponent } from '../../../shared/components/project-modal/project-modal.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ProjectStatus, Project } from '../../../core/models/project.model';

type Filter = 'all' | ProjectStatus;

@Component({
  selector: 'app-projects',
  imports: [ProjectCardComponent, ProjectModalComponent, IconComponent],
  template: `
    <div class="max-w-6xl mx-auto px-6 py-16">
      <h1 class="text-3xl font-bold text-white mb-2">Proyectos</h1>
      <p class="text-white/40 text-sm mb-10">
        Ideas, demos y proyectos en producción.
      </p>

      <!-- Filters -->
      <div class="flex items-center gap-2 mb-8 flex-wrap">
        @for (f of filters; track f.value) {
          <button
            (click)="activeFilter.set(f.value)"
            class="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
            [class.bg-brand-green]="activeFilter() === f.value"
            [class.text-brand-dark]="activeFilter() === f.value"
            [class.bg-white]="activeFilter() !== f.value"
            [class.bg-opacity-5]="activeFilter() !== f.value"
            [class.text-white]="activeFilter() !== f.value"
            [class.text-opacity-40]="activeFilter() !== f.value"
          >
            {{ f.label }}
          </button>
        }
      </div>

      @if (filteredProjects().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (project of filteredProjects(); track project.id) {
            <app-project-card 
              [project]="project"
              (viewProject)="openModal($event)"
            />
          }
        </div>
      } @else {
        <div class="text-center py-24 text-white/20">
          <app-icon name="search_off" [size]="48" variant="outlined" />
          <p class="mt-3 text-sm">Sin proyectos en esta categoría</p>
        </div>
      }
    </div>

    <!-- Modal -->
    <app-project-modal
      [project]="selectedProject()"
      [isOpen]="isModalOpen()"
      (close)="closeModal()"
    />
  `,
})
export class ProjectsComponent {
  private projectsService = inject(ProjectsService);

  readonly activeFilter = signal<Filter>('all');
  readonly isModalOpen = signal(false);
  readonly selectedProject = signal<Project | null>(null);

  readonly filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'production', label: 'Producción' },
    { value: 'demo', label: 'Demo' },
    { value: 'idea', label: 'Idea' },
  ];

  private readonly allProjects = toSignal(
    this.projectsService.getAll(1, 100).pipe(
      map((res) => res.data),
      catchError(() => EMPTY),
    ),
    { initialValue: [] },
  );

  get filteredProjects() {
    return () => {
      const projects = this.allProjects();
      const filter = this.activeFilter();
      if (filter === 'all') return projects;
      return projects.filter((p) => p.status === filter);
    };
  }

  openModal(project: any): void {
    this.projectsService.getById(project.id).subscribe((fullProject) => {
      this.selectedProject.set(fullProject);
      this.isModalOpen.set(true);
    });
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedProject.set(null);
  }
}
