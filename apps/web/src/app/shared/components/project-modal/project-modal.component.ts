import { Component, input, output, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconComponent } from '../icon/icon.component';
import { Project } from '../../../core/models/project.model';

@Component({
    selector: 'app-project-modal',
    standalone: true,
    imports: [CommonModule, IconComponent],
    template: `
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
      (click)="closeModal()"
      *ngIf="isOpen()"
    >
      <div
        class="bg-brand-dark rounded-xl border border-white/[0.05] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex items-start justify-between p-6 border-b border-white/[0.05]">
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold text-white truncate">
              {{ project()?.title }}
            </h2>
            <p class="text-white/40 text-sm mt-1">
              {{ project()?.description }}
            </p>
          </div>
          <button
            (click)="closeModal()"
            class="ml-4 p-2 hover:bg-white/[0.05] rounded-lg transition-colors text-white/60 hover:text-white shrink-0"
            aria-label="Cerrar"
          >
            <app-icon name="close" [size]="24" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-auto">
          <div
            class="w-full h-full bg-white/[0.02]"
            [innerHTML]="sanitizedHtml()"
          ></div>
        </div>

        <!-- Footer -->
        <div class="flex items-center gap-3 p-6 border-t border-white/[0.05] bg-white/[0.02]">
          @if (project()?.demoUrl) {
            <a
              [href]="project()!.demoUrl!"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.1] transition-colors text-sm font-medium"
            >
              <app-icon name="play_circle" [size]="16" />
              Demo
            </a>
          }
          @if (project()?.productionUrl) {
            <a
              [href]="project()!.productionUrl!"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-green/20 text-brand-green hover:bg-brand-green/30 transition-colors text-sm font-medium"
            >
              <app-icon name="open_in_new" [size]="16" />
              Ver en producción
            </a>
          }
          <button
            (click)="closeModal()"
            class="ml-auto px-4 py-2 rounded-lg bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.1] transition-colors text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host ::ng-deep {
      .project-content-html {
        all: revert;
        color: #fff;
      }
      .project-content-html * {
        max-width: 100%;
      }
      .project-content-html img {
        max-width: 100%;
        height: auto;
      }
      .project-content-html a {
        color: #10b981;
        text-decoration: underline;
      }
      .project-content-html a:hover {
        opacity: 0.8;
      }
    }
  `],
})
export class ProjectModalComponent {
    readonly project = input<Project | null>(null);
    readonly isOpen = input(false);
    readonly close = output<void>();

    readonly sanitizedHtml = signal<SafeHtml>('');

    constructor(private domSanitizer: DomSanitizer) {
        effect(() => {
            const html = this.project()?.projectHtml;
            if (html) {
                this.sanitizedHtml.set(
                    this.domSanitizer.bypassSecurityTrustHtml(html),
                );
            }
        });
    }

    closeModal(): void {
        this.close.emit();
    }
}
