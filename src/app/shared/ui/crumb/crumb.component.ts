import { Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ds-crumb',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './crumb.component.html',
  styleUrl: './crumb.component.scss',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class CrumbComponent {
  label       = input.required<string>();
  href        = input<string>('#');
  currentPage = input<boolean>(false);
  disabled    = input<boolean>(false);

  clicked = output<void>();

  hostClasses = computed(() => [
    'ds-crumb',
    this.currentPage() ? 'ds-crumb--current'  : '',
    this.disabled()    ? 'ds-crumb--disabled' : '',
  ].filter(Boolean).join(' '));
}
