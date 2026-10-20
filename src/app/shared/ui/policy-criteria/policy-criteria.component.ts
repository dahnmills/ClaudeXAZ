import { Component, computed, model, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { TagComponent } from '../tag/tag.component';
import { InputTextComponent } from '../input-text/input-text.component';
import { DividerComponent } from '../divider/divider.component';
import { SegmentedControlComponent, type SegmentedOption } from '../segmented-control/segmented-control.component';
import type { PolicyStatus } from '../policy-result-card/policy.model';
import { POLICY_STATUSES, defaultPolicyCriteria, type PolicyCriteriaValues } from './policy-criteria.model';

export * from './policy-criteria.model';

/**
 * More criteria d'une recherche Policies. Même coque que ds-more-criteria
 * (en-tête, divider, rangées libellé + contrôle), contenu propre aux polices.
 */
@Component({
  selector: 'ds-policy-criteria',
  standalone: true,
  imports: [IconComponent, ButtonComponent, ButtonIconComponent, TagComponent, InputTextComponent, DividerComponent, SegmentedControlComponent],
  templateUrl: './policy-criteria.component.html',
  styleUrl: './policy-criteria.component.scss',
  host: { class: 'ds-policy-criteria' },
})
export class PolicyCriteriaComponent {
  value = model<PolicyCriteriaValues>(defaultPolicyCriteria());
  closed = output<void>();

  readonly statuses = POLICY_STATUSES;
  readonly searchInOptions: SegmentedOption[] = [
    { value: 'policies', label: 'Policies' },
    { value: 'drafts',   label: 'Drafts' },
  ];

  /** Un draft n'a pas de statut : les tags restent visibles, désactivés, avec la raison. */
  statusDisabled = computed(() => this.value().searchIn === 'drafts');

  setSearchIn(v: string) {
    this.value.update(c => ({ ...c, searchIn: v === 'drafts' ? 'drafts' : 'policies' }));
  }

  isSelected(id: PolicyStatus) {
    return this.value().statuses.includes(id);
  }

  toggleStatus(id: PolicyStatus) {
    if (this.statusDisabled()) return;
    this.value.update(c => ({
      ...c,
      statuses: c.statuses.includes(id) ? c.statuses.filter(s => s !== id) : [...c.statuses, id],
    }));
  }

  setExtension(v: string) {
    this.value.update(c => ({ ...c, extension: v }));
  }

  reset() {
    this.value.set(defaultPolicyCriteria());
  }
}
