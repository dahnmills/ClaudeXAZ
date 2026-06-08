import { Component, computed, input, model } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';

/**
 * Collapsible Table — section pliable autour d'une table.
 * Source : Figma > Data Display > Collapsible Table 🟢
 *
 * Le contenu (table, list, properties-panel, etc.) est passé via ng-content.
 */
@Component({
  selector: 'ds-collapsible-table',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './collapsible-table.component.html',
  styleUrl: './collapsible-table.component.scss',
  host: { '[class]': 'hostClasses()' },
})
export class CollapsibleTableComponent {
  category = input.required<string>();
  /** Icône optionnelle à gauche du titre (ex: 'edit', 'file'). */
  icon     = input<IconName | ''>('');
  disabled = input<boolean>(false);

  open = model<boolean>(false);

  hostClasses = computed(() => [
    'ds-collapsible-table',
    this.open()     ? 'ds-collapsible-table--open'     : '',
    this.disabled() ? 'ds-collapsible-table--disabled' : '',
  ].filter(Boolean).join(' '));

  toggle() {
    if (this.disabled()) return;
    this.open.update(v => !v);
  }
}
