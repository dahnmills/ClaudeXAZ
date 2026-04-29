import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'ds-side-nav',
  standalone: true,
  imports: [],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role': 'navigation',
  },
})
export class SideNavComponent {
  collapsed = input<boolean>(false);

  hostClasses = computed(() => [
    'ds-side-nav',
    this.collapsed() ? 'ds-side-nav--collapsed' : '',
  ].filter(Boolean).join(' '));
}
