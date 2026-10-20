import { Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconTileComponent } from '../icon-tile/icon-tile.component';
import { LinkComponent } from '../link/link.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { BadgeComponent, type BadgeStatus } from '../badge/badge.component';
import { IdentifierComponent } from '../identifier/identifier.component';
import { DividerComponent } from '../divider/divider.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { PropertiesPanelComponent, type PropertySection } from '../properties-panel/properties-panel.component';
import { POLICY_STATUS_LABELS, type PolicyResultData } from './policy.model';

export * from './policy.model';

/**
 * Résultat de recherche d'une police. Même enveloppe et même rangée d'actions
 * que ds-result-card : un buyer et une police se lisent pareil dans une liste.
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
  favorited = input<boolean>(false);

  toggled = output<void>();
  starred = output<void>();
  opened = output<void>();

  hostClasses = computed(() => ['ds-policy-result-card', this.open() ? 'ds-policy-result-card--open' : ''].filter(Boolean).join(' '));

  title = computed(() => {
    const d = this.data();
    return d.kind === 'draft' ? `Draft ${d.policyNumber}` : `Policy ${d.policyNumber}-${d.extension}`;
  });

  badge = computed<{ label: string; status: BadgeStatus }>(() => {
    const d = this.data();
    if (d.kind === 'draft' || !d.status) return { label: 'Draft', status: 'info' };
    const status: BadgeStatus = d.status === 'issued' ? 'success' : d.status === 'cancelled' ? 'error' : 'neutral';
    return { label: POLICY_STATUS_LABELS[d.status], status };
  });

  period = computed(() => `${this.data().effectiveDate} → ${this.data().expiryDate}`);

  hasDetails = computed(() => !!this.data().details?.length);

  detailSections = computed<PropertySection[]>(() => [
    { rows: (this.data().details ?? []).map(r => ({ label: r.label, value: r.value })) },
  ]);

  onOpen(ev: Event) {
    ev.preventDefault();
    this.opened.emit();
  }
}
