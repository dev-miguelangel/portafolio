import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="border-t border-white/5 py-8 mt-24">
      <div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-white/30">
          &copy; {{ year }} @miguelangel.jaimen Todos los derechos reservados.
        </p>
        <p class="text-xs text-white/20">
          Construido con Angular + NestJS
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
