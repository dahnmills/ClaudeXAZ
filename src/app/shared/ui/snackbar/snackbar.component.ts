import { Component, ViewEncapsulation, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type SnackbarTone = 'neutral' | 'success' | 'error';

@Component({
  selector: 'ds-snackbar',
  standalone: true,
  imports: [IconComponent],
  template: `
    @if (icon()) {
      <ds-icon [name]="icon()!" [size]="16" />
    }
    <span class="ds-snackbar__text">{{ text() }}</span>
  `,
  styleUrl: './snackbar.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClass()',
    'role': 'status',
  },
})
export class SnackbarComponent {
  text = input.required<string>();
  tone = input<SnackbarTone>('neutral');
  icon = input<string | null>(null);

  hostClass() {
    return ['ds-snackbar', `ds-snackbar--${this.tone()}`].join(' ');
  }
}
