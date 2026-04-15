import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map, Subject, switchMap, startWith } from 'rxjs';
import { ProjectsService } from '../../../core/services/projects.service';
import { Project, ProjectStatus, ProjectSummary } from '../../../core/models/project.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-projects',
  imports: [FormsModule, IconComponent],
  template: `
    <div class="p-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white mb-1">Proyectos</h1>
          <p class="text-sm text-white/30">Administra los proyectos del portafolio</p>
        </div>
        <button (click)="openForm()" class="btn-primary">
          <app-icon name="add" [size]="16" />
          Nuevo proyecto
        </button>
      </div>

      <!-- Form modal -->
      @if (showForm()) {
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div class="bg-[#111116] border border-white/10 rounded-2xl p-8 w-full max-w-lg">
            <h2 class="text-lg font-semibold text-white mb-6">
              {{ editingId() ? 'Editar proyecto' : 'Nuevo proyecto' }}
            </h2>

            <form (ngSubmit)="onSave()" class="flex flex-col gap-4">
              <div>
                <label class="label">Título</label>
                <input type="text" name="title" [(ngModel)]="form.title" required class="input-field" placeholder="Nombre del proyecto" />
              </div>
              <div>
                <label class="label">Descripción</label>
                <textarea name="description" [(ngModel)]="form.description" rows="3" class="input-field resize-none" placeholder="¿De qué trata el proyecto?"></textarea>
              </div>
              <div>
                <label class="label">Estado</label>
                <select name="status" [(ngModel)]="form.status" class="input-field">
                  <option value="idea">Idea</option>
                  <option value="demo">Demo</option>
                  <option value="production">Producción</option>
                </select>
              </div>
              <div>
                <label class="label">Tags (separados por coma)</label>
                <input type="text" name="tags" [(ngModel)]="tagsInput" class="input-field" placeholder="Angular, NestJS, PostgreSQL" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="label">URL Demo</label>
                  <input type="url" name="demoUrl" [(ngModel)]="form.demoUrl" class="input-field" placeholder="https://" />
                </div>
                <div>
                  <label class="label">URL Producción</label>
                  <input type="url" name="productionUrl" [(ngModel)]="form.productionUrl" class="input-field" placeholder="https://" />
                </div>
              </div>

              <div class="flex items-center gap-3 mt-2">
                <button type="submit" class="btn-primary" [disabled]="saving()">
                  @if (saving()) {
                    <app-icon name="hourglass_empty" [size]="16" />
                  } @else {
                    <app-icon name="save" [size]="16" />
                  }
                  Guardar
                </button>
                <button type="button" (click)="closeForm()" class="btn-ghost">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Projects list -->
      @if (projects().length) {
        <div class="flex flex-col gap-2">
          @for (project of projects(); track project.id) {
            <div class="card flex items-center justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-white/20 uppercase font-mono">{{ project.status }}</span>
                  <p class="font-medium text-white/80 truncate">{{ project.title }}</p>
                </div>
                <p class="text-xs text-white/30 mt-0.5 truncate">{{ project.description }}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button (click)="openForm(project)" class="btn-ghost !px-3 !py-1.5 !text-xs">
                  <app-icon name="edit" [size]="14" />
                  Editar
                </button>
                <button (click)="onDelete(project.id)" class="btn-ghost !px-3 !py-1.5 !text-xs hover:!text-red-400 hover:!border-red-500/20">
                  <app-icon name="delete_outline" [size]="14" />
                </button>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-20 text-white/20">
          <app-icon name="folder_open" [size]="40" variant="outlined" />
          <p class="mt-3 text-sm">Sin proyectos aún</p>
        </div>
      }
    </div>
  `,
})
export class AdminProjectsComponent {
  private projectsService = inject(ProjectsService);

  readonly showForm = signal(false);
  readonly saving = signal(false);
  readonly editingId = signal<string | null>(null);

  form: Partial<Project> = this.emptyForm();
  tagsInput = '';

  private refresh$ = new Subject<void>();

  readonly projects = toSignal(
    this.refresh$.pipe(
      startWith(null),
      switchMap(() =>
        this.projectsService.getAll(1, 100).pipe(
          map((r) => r.data),
          catchError(() => EMPTY),
        ),
      ),
    ),
    { initialValue: [] as ProjectSummary[] },
  );

  openForm(project?: ProjectSummary): void {
    this.editingId.set(project?.id ?? null);
    this.form = project
      ? {
          title: project.title,
          description: project.description,
          status: project.status,
          tags: project.tags,
          demoUrl: project.demoUrl,
          productionUrl: project.productionUrl,
          imageUrl: project.imageUrl,
        }
      : this.emptyForm();
    this.tagsInput = project?.tags.join(', ') ?? '';
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  onSave(): void {
    const payload: Partial<Project> = {
      ...this.form,
      tags: this.tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    };
    this.saving.set(true);

    const id = this.editingId();
    const request = id
      ? this.projectsService.update(id, payload)
      : this.projectsService.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
        this.refresh$.next();
      },
      error: () => this.saving.set(false),
    });
  }

  onDelete(id: string): void {
    if (!confirm('¿Eliminar este proyecto?')) return;
    this.projectsService.remove(id).subscribe(() => this.refresh$.next());
  }

  private emptyForm(): Partial<Project> {
    return {
      title: '',
      description: '',
      status: 'idea' as ProjectStatus,
      tags: [],
      demoUrl: null,
      productionUrl: null,
      imageUrl: null,
    };
  }
}
