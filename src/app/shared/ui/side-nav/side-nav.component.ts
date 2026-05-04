import { Component, computed, model } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ds-side-nav',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role': 'navigation',
  },
})
export class SideNavComponent {
  collapsed = model<boolean>(true);

  hostClasses = computed(() => [
    'ds-side-nav',
    this.collapsed() ? 'ds-side-nav--collapsed' : '',
  ].filter(Boolean).join(' '));

  toggle() { this.collapsed.update(v => !v); }
}
