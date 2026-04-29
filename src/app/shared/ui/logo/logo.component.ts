import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'ds-logo',
  standalone: true,
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'aria-label': 'Qirin',
  },
})
export class LogoComponent {
  appName = input<string>('Qirin');
  reversed = input<boolean>(false);

  hostClasses = computed(() => [
    'ds-logo',
    this.reversed() ? 'ds-logo--reversed' : '',
  ].filter(Boolean).join(' '));
}
