import { Component, input, output } from '@angular/core';
import { WidgetCardComponent } from '../widget-card/widget-card.component';
import { LinkComponent } from '../link/link.component';
import { BadgeComponent, type BadgeStatus } from '../badge/badge.component';
import { IconComponent, type IconName } from '../icon/icon.component';

export interface NewsfeedTag { label: string; status?: BadgeStatus; }

/**
 * Widget "Newsfeed" de Buyer Summary : titre + badges (sentiment/importance) +
 * titre de l'actu (lien) + date + extrait.
 *
 * Compose `ds-widget-card` et `ds-link`/`ds-badge`/`ds-icon`.
 */
@Component({
  selector: 'ds-newsfeed',
  standalone: true,
  imports: [WidgetCardComponent, LinkComponent, BadgeComponent, IconComponent],
  templateUrl: './newsfeed.component.html',
  styleUrl: './newsfeed.component.scss',
  host: { 'class': 'ds-newsfeed' },
})
export class NewsfeedComponent {
  title    = input<string>('Newsfeed');
  tags     = input<NewsfeedTag[]>([]);
  headline = input.required<string>();
  href     = input<string>('#');
  date     = input<string>('');
  dateIcon = input<IconName>('clock');
  excerpt  = input<string>('');

  headlineClicked = output<void>();
  actionClicked   = output<void>();
}
