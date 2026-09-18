import { Component, computed, model, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { InputTextComponent } from '../input-text/input-text.component';
import { TagComponent } from '../tag/tag.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { DividerComponent } from '../divider/divider.component';

/** Jeu de critères complémentaires, tel que le parent le détient. */
export interface MoreCriteriaValues {
  /** ids des statuts sélectionnés, voir STATUS_CRITERIA. */
  statuses: string[];
  extendCountry: boolean;
  street: string;
  city: string;
  region: string;
  zip: string;
  phone: string;
}

export const STATUS_CRITERIA: { id: string; label: string }[] = [
  { id: 'active',      label: 'Active' },
  { id: 'closed',      label: 'Closed' },
  { id: 'provisional', label: 'Provisionnal' },
];

/** Jeu vide. Fonction et pas constante : chaque appelant a le sien. */
export function emptyMoreCriteria(): MoreCriteriaValues {
  return { statuses: [], extendCountry: false, street: '', city: '', region: '', zip: '', phone: '' };
}

/** Nombre de critères renseignés. Le compteur de la barre de recherche et
 *  l'onglet des recherches récentes lisent la même fonction. */
export function moreCriteriaCount(v: MoreCriteriaValues): number {
  let n = v.statuses.length;
  if (v.extendCountry) n++;
  for (const field of [v.street, v.city, v.region, v.zip, v.phone]) {
    if (field.trim()) n++;
  }
  return n;
}

/**
 * Un critère et sa valeur, `value` à `null` quand il n'est pas renseigné.
 *
 * Une valeur seule (« Active », « 75004 ») ne dit pas de quel critère elle
 * vient, et un critère absent doit garder sa place : c'est ce qui permet de lire
 * deux recherches récentes l'une sous l'autre en retrouvant chaque critère au
 * même endroit.
 */
export interface CriteriaSlot {
  key: string;
  value: string | null;
}

/** Les critères complémentaires, tous, renseignés ou pas, nommés pour être
 *  réaffichés hors du panneau.
 *
 *  Les statuts tiennent dans un seul emplacement : trois fois « STATUS » de
 *  suite répète le nom du critère pour rien. Ils sortent dans l'ordre du
 *  panneau, pas dans celui des clics, sinon deux recherches identiques se
 *  liraient différemment. */
export function moreCriteriaSlots(v: MoreCriteriaValues): Record<
  'status' | 'street' | 'city' | 'region' | 'zip' | 'phone' | 'extendedSearch',
  CriteriaSlot
> {
  const statuses = STATUS_CRITERIA.filter(c => v.statuses.includes(c.id)).map(c => c.label);
  const text = (s: string) => s.trim() || null;
  return {
    status:         { key: 'Status',          value: statuses.join(', ') || null },
    street:         { key: 'Street',          value: text(v.street) },
    city:           { key: 'City',            value: text(v.city) },
    region:         { key: 'Region',          value: text(v.region) },
    zip:            { key: 'ZIP',             value: text(v.zip) },
    phone:          { key: 'Phone',           value: text(v.phone) },
    extendedSearch: { key: 'Extended search', value: v.extendCountry ? 'Yes' : null },
  };
}

@Component({
  selector: 'ds-more-criteria',
  standalone: true,
  imports: [IconComponent, ButtonComponent, ButtonIconComponent, CheckboxComponent, InputTextComponent, TagComponent, TextareaComponent, DividerComponent],
  templateUrl: './more-criteria.component.html',
  styleUrl: './more-criteria.component.scss',
  host: { 'class': 'ds-more-criteria' },
})
export class MoreCriteriaComponent {
  /**
   * Critères portés par le parent. Le panneau s'ouvre et se ferme, la sélection
   * lui survit : elle appartient à la recherche, pas au panneau.
   */
  value = model<MoreCriteriaValues>(emptyMoreCriteria());

  cleared = output<void>();
  closed = output<void>();

  readonly statusCriteria = STATUS_CRITERIA;

  count = computed(() => moreCriteriaCount(this.value()));

  isSelected(id: string): boolean {
    return this.value().statuses.includes(id);
  }

  toggleChip(id: string) {
    this.value.update(v => ({
      ...v,
      statuses: v.statuses.includes(id)
        ? v.statuses.filter(s => s !== id)
        : [...v.statuses, id],
    }));
  }

  patch(fields: Partial<MoreCriteriaValues>) {
    this.value.update(v => ({ ...v, ...fields }));
  }

  clearAll() {
    this.value.set(emptyMoreCriteria());
    this.cleared.emit();
  }
}
