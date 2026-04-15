import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-56 shrink-0 border-r border-white/5 bg-white/[0.02] flex flex-col">
        <div class="h-16 flex items-center px-5 border-b border-white/5">
          <span class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-md bg-brand-green flex items-center justify-center">
              <span class="w-2.5 h-2.5 rounded-full bg-brand-dark"></span>
            </span>
            <span class="text-sm font-semibold text-white/80">Admin</span>
          </span>
        </div>

        <nav class="flex-1 p-3">
          <ul class="flex flex-col gap-0.5">
            @for (item of navItems; track item.path) {
              <li>
                <a
                  [routerLink]="item.path"
                  routerLinkActive="bg-white/[0.06] text-white"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all"
                >
                  <app-icon [name]="item.icon" [size]="18" variant="outlined" />
                  {{ item.label }}
                </a>
              </li>
            }
          </ul>
        </nav>

        <div class="p-3 border-t border-white/5">
          <button
            (click)="auth.logout()"
            class="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <app-icon name="logout" [size]="18" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  readonly auth = inject(AuthService);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { label: 'Proyectos', icon: 'folder', path: '/admin/proyectos' },
    { label: 'Newsletter', icon: 'mail', path: '/admin/newsletters' },
  ];
}
