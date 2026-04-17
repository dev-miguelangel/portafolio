import { Component, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-brand-dark/80 backdrop-blur-md">
      <nav class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2.5 group" (click)="close()">
          <span class="w-7 h-7 rounded-md bg-brand-green flex items-center justify-center">
            <span class="w-3 h-3 rounded-full bg-brand-dark"></span>
          </span>
          <span class="font-semibold text-sm text-white/80 group-hover:text-white transition-colors">
            miguelangeljaimen
          </span>
        </a>

        <!-- Desktop links -->
        <ul class="hidden md:flex items-center gap-1">
          <li>
            <a routerLink="/proyectos" routerLinkActive="text-white bg-white/5"
               class="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
              Proyectos
            </a>
          </li>
          <li>
            <a routerLink="/newsletter" routerLinkActive="text-white bg-white/5"
               class="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
              Newsletter
            </a>
          </li>
        </ul>

        <!-- Hamburger button (mobile only) -->
        <button
          class="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-white/5 transition-colors"
          (click)="toggle()"
          aria-label="Abrir menú"
        >
          <span class="block w-5 h-px bg-white/70 transition-all duration-300"
                [class.rotate-45]="open()" [class.translate-y-[6.5px]]="open()"></span>
          <span class="block w-5 h-px bg-white/70 transition-all duration-300"
                [class.opacity-0]="open()"></span>
          <span class="block w-5 h-px bg-white/70 transition-all duration-300"
                [class.-rotate-45]="open()" [class.-translate-y-[6.5px]]="open()"></span>
        </button>
      </nav>

      <!-- Mobile menu -->
      @if (open()) {
        <div class="md:hidden border-t border-white/5 bg-brand-dark/95 backdrop-blur-md">
          <ul class="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            <li>
              <a routerLink="/proyectos" routerLinkActive="text-white bg-white/5"
                 (click)="close()"
                 class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
                Proyectos
              </a>
            </li>
            <li>
              <a routerLink="/newsletter" routerLinkActive="text-white bg-white/5"
                 (click)="close()"
                 class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
                Newsletter
              </a>
            </li>
          </ul>
        </div>
      }
    </header>
  `,
})
export class NavbarComponent {
  readonly open = signal(false);

  toggle() { this.open.update(v => !v); }
  close() { this.open.set(false); }

  @HostListener('document:keydown.escape')
  onEscape() { this.close(); }
}
