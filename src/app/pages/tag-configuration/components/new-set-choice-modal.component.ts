import { Component, computed, effect, input, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { VisualButtonComponent } from '../../../shared/ui/visual-button/visual-button.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { FunctionalNoticeComponent } from '../../../shared/ui/functional-notice/functional-notice.component';
import { HistoryRowComponent } from './history-row.component';
import { Country, RuleSetHistoryEntry } from '../tag-configuration.models';
import { legalFormsForCountry } from '../tag-configuration.data';

export type NewSetAction = 'previous' | 'scratch' | 'import';

/** Un set réutilisable, avec le pays dont il vient. */
export interface PreviousSet { entry: RuleSetHistoryEntry; country: Country; }

/**
 * "Create new set" entry point: pick previous set / blank / JSON upload as
 * a selectable card, then confirm with Next. Choosing "Previous set" moves
 * to a second step listing past rule-sets to pick from (same row layout as
 * the History tab) before confirming.
 *
 * La liste couvre **tous** les pays, pays courant en premier : démarrer un pays
 * en repartant d'un voisin est le vrai cas d'usage. Un set venu d'ailleurs
 * n'apporte pas la même devise ni les mêmes formes juridiques, la modale le
 * dit avant la copie, quand on peut encore reculer.
 */
@Component({
  selector: 'tag-new-set-choice-modal',
  standalone: true,
  imports: [ModalComponent, VisualButtonComponent, IconComponent, ButtonComponent, FunctionalNoticeComponent, HistoryRowComponent],
  templateUrl: './new-set-choice-modal.component.html',
  styleUrl: './new-set-choice-modal.component.scss',
})
export class NewSetChoiceModalComponent {
  open   = input<boolean>(false);
  /** Pays de destination : celui sélectionné dans la toolbar. */
  target = input.required<Country>();
  sets   = input<PreviousSet[]>([]);

  chosen = output<NewSetAction>();
  fromPrevious = output<PreviousSet>();
  closed = output<void>();

  step = signal<'choice' | 'previous'>('choice');
  selectedAction = signal<NewSetAction | null>(null);
  selectedSet = signal<PreviousSet | null>(null);

  constructor() {
    effect(() => {
      if (!this.open()) return;
      this.step.set('choice');
      this.selectedAction.set(null);
      this.selectedSet.set(null);
    });
  }

  title = computed(() => this.step() === 'previous' ? 'Select a previous set' : 'Create new set of rules');
  canGoNext = computed(() => this.step() === 'previous' ? !!this.selectedSet() : !!this.selectedAction());

  /** Pays courant d'abord : c'est le choix par défaut, pas une option parmi d'autres. */
  orderedSets = computed<PreviousSet[]>(() => {
    const code = this.target().code;
    return [...this.sets()].sort((a, b) =>
      (a.country.code === code ? 0 : 1) - (b.country.code === code ? 0 : 1));
  });

  /** Écarts entre le set choisi et le pays de destination. Aucun montant n'est
   *  converti : on signale, on ne réécrit pas les seuils à la place de l'analyste. */
  divergence = computed(() => {
    const sel = this.selectedSet();
    const target = this.target();
    if (!sel || sel.country.code === target.code) return null;

    const known = legalFormsForCountry(target.code).map(o => o.value);
    const foreign = [...new Set(
      sel.entry.rules.flatMap(r => r.criteria.legalForm ?? []).filter(f => !known.includes(f)),
    )];
    const amountRules = sel.entry.rules.filter(r => r.criteria.exposure).length;

    return {
      source: sel.country,
      currencyDiffers: sel.country.currency !== target.currency,
      amountRules,
      foreignForms: foreign,
      formRules: sel.entry.rules.filter(r => (r.criteria.legalForm ?? []).some(f => foreign.includes(f))).length,
    };
  });

  divergenceMessage = computed(() => {
    const d = this.divergence();
    if (!d) return '';
    const parts: string[] = [];
    if (d.currencyDiffers) {
      parts.push(`${d.amountRules} ${d.amountRules === 1 ? 'rule carries' : 'rules carry'} exposure thresholds in ${d.source.currency}, and this country works in ${this.target().currency}. Amounts are copied as they are. Nothing is converted for you.`);
    }
    if (d.foreignForms.length) {
      parts.push(`${d.formRules} ${d.formRules === 1 ? 'rule filters' : 'rules filter'} on ${d.foreignForms.join(', ')}, which ${this.target().name} does not use. They are kept and flagged: dropping them would widen the rule instead of narrowing it.`);
    }
    if (!parts.length) {
      parts.push(`The set comes from ${d.source.name}. Review each rule before validating.`);
    }
    return parts.join(' ');
  });

  /** Un même identifiant de set peut exister dans deux pays : la sélection tient
   *  sur le couple pays + set, jamais sur le set seul. */
  isSelected(s: PreviousSet): boolean {
    const sel = this.selectedSet();
    return !!sel && sel.entry.id === s.entry.id && sel.country.code === s.country.code;
  }

  select(action: NewSetAction): void { this.selectedAction.set(action); }
  selectSet(set: PreviousSet): void { this.selectedSet.set(set); }

  back(): void { this.step.set('choice'); this.selectedSet.set(null); }

  next(): void {
    if (this.step() === 'choice') {
      const action = this.selectedAction();
      if (!action) return;
      if (action === 'previous') { this.step.set('previous'); return; }
      this.chosen.emit(action);
      return;
    }
    const set = this.selectedSet();
    if (!set) return;
    this.fromPrevious.emit(set);
  }
}
