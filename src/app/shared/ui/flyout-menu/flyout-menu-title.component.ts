import { Component, input } from '@angular/core';

/**
 * Atom interne au composant Flyout Menu : intertitre d'une section de menu.
 * Source : Figma > Data Entry > Dropdown / .Item (Type=Title, node 2049:5148).
 * Pas cliquable. Le séparateur entre deux sections est un <ds-divider />
 * (même trait que Figma .Item Type=Separator).
 */
@Component({
  selector: 'ds-flyout-menu-title',
  standalone: true,
  template: `{{ label() }}`,
  styleUrl: './flyout-menu-title.component.scss',
  host: { class: 'ds-flyout-menu-title', role: 'presentation' },
})
export class FlyoutMenuTitleComponent {
  label = input.required<string>();
}
