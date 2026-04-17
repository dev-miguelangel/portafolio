import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, map, Subject, startWith, switchMap } from 'rxjs';
import { NewsletterService } from '../../../core/services/newsletter.service';
import { Newsletter, NewsletterSummary } from '../../../core/models/newsletter.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-newsletters',
  imports: [FormsModule, DatePipe, IconComponent],
  template: `
    <div class="p-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white mb-1">Newsletter</h1>
          <p class="text-sm text-white/30">Gestiona las ediciones y suscriptores</p>
        </div>
        <button (click)="openNewForm()" class="btn-primary">
          <app-icon name="add" [size]="16" />
          Nueva edición
        </button>
      </div>

      <!-- Subscribers count -->
      <div class="card inline-flex items-center gap-3 mb-8">
        <app-icon name="group" [size]="18" class="text-brand-green" />
        <span class="text-sm text-white/60">
          <span class="text-white font-semibold">{{ subscribers()?.length ?? '—' }}</span> suscriptores
        </span>
      </div>

      <!-- Form modal -->
      @if (showForm()) {
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div class="bg-[#111116] border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 class="text-lg font-semibold text-white mb-6">
              {{ editingId() ? 'Editar edición' : 'Nueva edición' }}
            </h2>

            <form (ngSubmit)="onSave()" class="flex flex-col gap-4">
              <div>
                <label class="label">Título</label>
                <input type="text" name="title" [(ngModel)]="form.title" required class="input-field" placeholder="Título de la edición" />
              </div>
              <div>
                <label class="label">Resumen</label>
                <input type="text" name="summary" [(ngModel)]="form.summary" class="input-field" placeholder="Breve descripción de esta edición" />
              </div>
              <div>
                <label class="label">Contenido (HTML)</label>
                <textarea
                  name="content"
                  [(ngModel)]="form.content"
                  rows="10"
                  class="input-field resize-y font-mono text-xs"
                  placeholder="<p>Contenido de la newsletter...</p>"
                ></textarea>
              </div>

              <div>
                <label class="label">Fecha de publicación</label>
                <input
                  type="datetime-local"
                  name="publishedAt"
                  [(ngModel)]="form.publishedAt"
                  class="input-field"
                />
                <p class="text-xs text-white/30 mt-1">Déjalo vacío para guardar como borrador.</p>
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

      <!-- Newsletters list -->
      @if (newsletters().length) {
        <div class="flex flex-col gap-2">
          @for (item of newsletters(); track item.id) {
            <div class="card flex items-center justify-between gap-4">
              <div class="flex-1 min-w-0">
                <p class="font-medium text-white/80 truncate">{{ item.title }}</p>
                <p class="text-xs text-white/25 mt-0.5">
                  {{ item.publishedAt ? (item.publishedAt | date: 'dd/MM/yyyy') : 'Borrador' }}
                </p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button (click)="openEditForm(item.id)" class="btn-ghost !px-3 !py-1.5 !text-xs">
                  <app-icon name="edit" [size]="14" />
                  Editar
                </button>
                <button (click)="onDelete(item.id)" class="btn-ghost !px-3 !py-1.5 !text-xs hover:!text-red-400 hover:!border-red-500/20">
                  <app-icon name="delete_outline" [size]="14" />
                </button>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-20 text-white/20">
          <app-icon name="mail_outline" [size]="40" />
          <p class="mt-3 text-sm">Sin ediciones aún</p>
        </div>
      }
    </div>
  `,
})
export class AdminNewslettersComponent {
  private newsletterService = inject(NewsletterService);

  readonly showForm = signal(false);
  readonly saving = signal(false);
  readonly editingId = signal<string | null>(null);

  form: Partial<Newsletter> = this.emptyForm();

  private refresh$ = new Subject<void>();

  readonly newsletters = toSignal(
    this.refresh$.pipe(
      startWith(null),
      switchMap(() =>
        this.newsletterService.getAll(1, 100).pipe(
          map((r) => r.data),
          catchError(() => EMPTY),
        ),
      ),
    ),
    { initialValue: [] as NewsletterSummary[] },
  );

  readonly subscribers = toSignal(
    this.newsletterService.getSubscribers().pipe(catchError(() => EMPTY)),
  );

  openNewForm(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.showForm.set(true);
  }

  openEditForm(id: string): void {
    // Carga el newsletter completo para obtener el campo content
    this.newsletterService.getById(id).subscribe({
      next: (newsletter) => {
        this.editingId.set(id);
        this.form = { ...newsletter };
        this.showForm.set(true);
      },
    });
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  onSave(): void {
    this.saving.set(true);
    const id = this.editingId();
    const request = id
      ? this.newsletterService.update(id, this.form)
      : this.newsletterService.create(this.form);

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
    if (!confirm('¿Eliminar esta edición?')) return;
    this.newsletterService.remove(id).subscribe(() => this.refresh$.next());
  }

  private emptyForm(): Partial<Newsletter> {
    return { title: '', summary: '', content: '' };
  }
}
