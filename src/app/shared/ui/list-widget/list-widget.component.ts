import { Component, input, output } from '@angular/core';
import { WidgetCardComponent } from '../widget-card/widget-card.component';
import { LinkComponent } from '../link/link.component';
import { BadgeComponent, type BadgeStatus } from '../badge/badge.component';
import { DividerComponent } from '../divider/divider.component';
import { type IconName } from '../icon/icon.component';

export interface ListWidgetItem {
  label: string;
  date?: string;
  href?: string;
  badge?: { label: string; status?: BadgeStatus };
}

/**
 * Widget "liste" de Buyer Summary : titre + suite d'items (lien + date + badge),
 * séparés par des filets. Couvre les widgets Job to do et Notepad.
 *
 * Compose `ds-widget-card` (coquille) et `ds-link`/`ds-badge`/`ds-divider`.
 */
@Component({
  selector: 'ds-list-widget',
  standalone: true,
  imports: [WidgetCardComponent, LinkComponent, BadgeComponent, DividerComponent],
  templateUrl: './list-widget.component.html',
  styleUrl: './list-widget.component.scss',
  host: { 'class': 'ds-list-widget' },
})
export class ListWidgetComponent {
  title      = input.required<string>();
  items      = input<ListWidgetItem[]>([]);
  /** Icône du bouton d'action du header (lien externe ou menu). */
  actionIcon = input<IconName>('export-share');
  actionAriaLabel = input<string>('Open');

  itemClicked   = output<ListWidgetItem>();
  actionClicked = output<void>();
}
