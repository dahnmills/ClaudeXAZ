import { Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconTileComponent } from '../icon-tile/icon-tile.component';
import { LinkComponent } from '../link/link.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { BadgeComponent } from '../badge/badge.component';
import { IdentifierComponent } from '../identifier/identifier.component';
import { DividerComponent } from '../divider/divider.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { PropertiesPanelComponent, type PropertySection } from '../properties-panel/properties-panel.component';
import type { PolicyResultData } from './policy.model';
import {
  policyKeyLabel, policyBadge, policyDateBlock, policyDetailColumns, policyTileIcon, EMPTY_VALUE,
} from './policy-card.view';

export * from './policy.model';

/**
 * Résultat de recherche d'une police ou d'un draft. Même enveloppe et même rangée
 * d'actions que ds-result-card : un buyer et une police se lisent pareil dans une
 * liste. Première lecture : nom, statut, clé, produit et assuré, date utile
 * (renouvellement, fin ou mise à jour). Le reste au dépliage.
 */
@Component({
  selector: 'ds-policy-result-card',
  standalone: true,
  imports: [IconComponent, IconTileComponent, LinkComponent, ButtonIconComponent, BadgeComponent, IdentifierComponent, DividerComponent, TooltipDirective, PropertiesPanelComponent],
  templateUrl: './policy-result-card.component.html',
  styleUrl: './policy-result-card.component.scss',
  host: { '[class]': 'hostClasses()' },
})
export class PolicyResultCardComponent {
  data = input.required<PolicyResultData>();
  open = input<boolean>(false);
  /** s : version resserrée pour les listes d'historique. */
  size = input<'s' | 'm'>('m');
  favorited = input<boolean>(false);
  /** Référence des alertes de renouvellement ; figée dans les stories. */
  today = input<Date>(new Date());

  toggled = output<void>();
  starred = output<void>();
  opened = output<void>();

  hostClasses = computed(() => ['ds-policy-result-card', this.open() ? 'ds-policy-result-card--open' : '', this.size() === 's' ? 'ds-policy-result-card--s' : ''].filter(Boolean).join(' '));

  keyLabel = computed(() => policyKeyLabel(this.data()));
  badge = computed(() => policyBadge(this.data()));
  dateBlock = computed(() => policyDateBlock(this.data(), this.today()));
  tileIcon = computed(() => policyTileIcon(this.data()));

  /** Produit puis assuré ; le produit manque parfois sur un draft. */
  secondLine = computed(() => [this.data().product, this.data().insuredName].filter(Boolean).join(' · '));

  /** Une donnée absente (hors Compass, draft peu renseigné) garde le poids d'un vide. */
  detailSections = computed<PropertySection[]>(() => policyDetailColumns(this.data()).map(col => ({
    rows: col.map(r => ({ ...r, muted: r.value === EMPTY_VALUE })),
  })));

  onOpen(ev: Event) {
    ev.preventDefault();
    this.opened.emit();
  }
}
