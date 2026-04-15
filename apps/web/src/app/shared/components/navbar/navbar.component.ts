import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-brand-dark/80 backdrop-blur-md">
      <nav class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2.5 group">
          <span class="w-7 h-7 rounded-md bg-brand-green flex items-center justify-center">
            <span class="w-3 h-3 rounded-full bg-brand-dark"></span>
          </span>
          <span class="font-semibold text-sm text-white/80 group-hover:text-white transition-colors">
            miguelangeljaimen
          </span>
        </a>

        <ul class="flex items-center gap-1">
          <li>
            <a
              routerLink="/proyectos"
              routerLinkActive="text-white bg-white/5"
              class="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              Proyectos
            </a>
          </li>
          <li>
            <a
              routerLink="/newsletter"
              routerLinkActive="text-white bg-white/5"
              class="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              Newsletter
            </a>
          </li>
        </ul>
      </nav>
    </header>
  `,
})
export class NavbarComponent {}
