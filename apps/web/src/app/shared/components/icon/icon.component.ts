import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type IconVariant = 'filled' | 'outlined';

@Component({
  selector: 'app-icon',
  imports: [CommonModule],
  template: `
    <span
      [class]="variant() === 'outlined' ? 'material-icons-outlined' : 'material-icons'"
      [style.font-size]="size() + 'px'"
      [class.align-middle]="true"
      aria-hidden="true"
    >{{ name() }}</span>
  `,
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input<number>(24);
  readonly variant = input<IconVariant>('filled');
}
