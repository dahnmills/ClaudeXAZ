import { Component, input, output } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { DividerComponent } from '../divider/divider.component';
import { ButtonComponent } from '../button/button.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { IconComponent, type IconName } from '../icon/icon.component';

/**
 * Coquille de widget Buyer Summary : titre + actions (lien "see figures" +
 * bouton-icône lien externe) + séparateur + contenu projeté.
 *
 * Compose `ds-card` (bg/bordure/radius/padding) — ne réimplémente pas la boîte.
 * Le contenu (chart, properties-panel, liste…) est passé en ng-content.
 */
@Component({
  selector: 'ds-widget-card',
  standalone: true,
  imports: [CardComponent, DividerComponent, ButtonComponent, ButtonIconComponent, IconComponent],
  templateUrl: './widget-card.component.html',
  styleUrl: './widget-card.component.scss',
  host: { 'class': 'ds-widget-card' },
})
export class WidgetCardComponent {
  title        = input.required<string>();
  /** Affiche le lien "see figures" (widgets graphiques). */
  seeFigures   = input<boolean>(false);
  seeFiguresLabel = input<string>('see figures');
  /** Affiche le bouton-icône d'action (ouvre le détail / menu contextuel). */
  externalLink = input<boolean>(true);
  externalAriaLabel = input<string>('Open');
  /** Icône du bouton d'action (export-share pour lien externe, context-vertical pour menu…). */
  actionIcon   = input<IconName>('export-share');

  seeFiguresClicked = output<void>();
  externalClicked   = output<void>();
}
