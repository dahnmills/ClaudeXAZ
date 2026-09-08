import { Component, computed, effect, input, output, signal, WritableSignal } from '@angular/core';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { SelectComponent } from '../../../shared/ui/select/select.component';
import { InputTextComponent } from '../../../shared/ui/input-text/input-text.component';
import { RadioCardComponent, RadioCardTone } from '../../../shared/ui/radio-card/radio-card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { TagFilterChipComponent } from '../../../shared/ui/tag-filter-chip/tag-filter-chip.component';
import {
  TagRule, RuleCriteria, EMPTY_CRITERIA, Decision, Grade, Sensitivity, GradeType, Freshness, Comparison,
} from '../tag-configuration.models';
import {
  SENSITIVITY_OPTIONS, GRADE_OPTIONS, GRADE_TYPE_OPTIONS, FRESHNESS_OPTIONS,
  COMPARISON_OPTIONS, COMPANY_ROLE_OPTIONS, NACE_OPTIONS,
  EXPOSURE_OP_OPTIONS, TRANSFERRED_OPTIONS,
} from '../tag-configuration.data';

const DECISION_CARDS: { value: Decision; label: string; sublabel: string; tone: RadioCardTone }[] = [
  { value: 'Accept',     label: 'Accept',      sublabel: 'Auto-grade the company, no manual review', tone: 'success' },
  { value: 'Refuse',     label: 'Refuse',      sublabel: 'Reject the new grade automatically',        tone: 'error' },
  { value: 'CreateTask', label: 'Create task', sublabel: 'Send to manual review before applying',     tone: 'warning' },
];

/**
 * Create/Edit rule modal: reuses the "grey panel + white card per group"
 * pattern from the company creation/edit wizards (rm-panel / rm-group /
 * rm-card) so each criteria group reads as a distinct section instead of
 * blending into one flat page. Groups: Base criteria, Current valid grade,
 * Last checked autograde, Company profile, Outcome. Inside a card, fields
 * that describe ONE concept (e.g. CVG's Value/Type/Freshness/Transferred/
 * Comparison) are laid out on their own row sized to their content, not
 * forced into a uniform 3-column grid that splits a 5-field concept into
 * an arbitrary 3+2. Outcome is a 3-way radio-card picker, tone-coded per
 * DECISION_CARDS. Local editable state is seeded from `rule()` on open via
 * an effect; multi-selects are held as Set<string>, single-selects as
 * string ('Any' means "no constraint" / null).
 *
 * La position d'évaluation est un champ du formulaire, en tête : l'ordre fait
 * partie de la règle (la première qui correspond gagne), et c'est la seule
 * façon de déplacer une règle quand un filtre désactive le glisser-déposer.
 */
@Component({
  selector: 'tag-rule-modal',
  standalone: true,
  imports: [
    ModalComponent, SelectComponent, InputTextComponent,
    RadioCardComponent, ButtonComponent, ConfirmDialogComponent, TagFilterChipComponent,
  ],
  templateUrl: './rule-modal.component.html',
  styleUrl: './rule-modal.component.scss',
})
export class RuleModalComponent {
  open     = input<boolean>(false);
  rule     = input<TagRule | null>(null);
  currency = input<string>('EUR');
  /** Formes juridiques du pays courant : référentiel national, pas global. */
  legalFormOptions = input<{ value: string; label: string }[]>([]);
  /** Nombre de règles du jeu en cours, pour borner la position. */
  ruleCount = input<number>(0);

  save   = output<TagRule>();
  closed = output<void>();

  // option lists exposed to the template
  SENSITIVITY_OPTIONS = SENSITIVITY_OPTIONS; GRADE_OPTIONS = GRADE_OPTIONS;
  GRADE_TYPE_OPTIONS = GRADE_TYPE_OPTIONS; FRESHNESS_OPTIONS = FRESHNESS_OPTIONS;
  COMPARISON_OPTIONS = COMPARISON_OPTIONS; DECISION_CARDS = DECISION_CARDS;
  COMPANY_ROLE_OPTIONS = COMPANY_ROLE_OPTIONS; NACE_OPTIONS = NACE_OPTIONS;
  EXPOSURE_OP_OPTIONS = EXPOSURE_OP_OPTIONS;
  TRANSFERRED_OPTIONS = TRANSFERRED_OPTIONS;

  isEdit = computed(() => this.rule() != null);
  title  = computed(() => this.isEdit() ? 'Edit rule' : 'Create a new rule');

  /** Création : la règle peut se poser après la dernière (N+1). Modification :
   *  elle se déplace parmi les N existantes. */
  maxPosition = computed(() => this.isEdit() ? Math.max(1, this.ruleCount()) : this.ruleCount() + 1);
  positionHint = computed(() => `of ${this.maxPosition()} · rule 1 is evaluated first`);

  // editable local state (multi as Set<string>, single as string; '' or 'Any' = null)
  position        = signal<string>('1');
  sensitivity     = signal<Set<string>>(new Set());
  exposureOp      = signal<string>('');
  exposureAmt     = signal<string>('');
  newAutoGrade    = signal<Set<string>>(new Set());
  cvgValue        = signal<Set<string>>(new Set());
  cvgType         = signal<Set<string>>(new Set());
  cvgFreshness    = signal<string>('Any');
  transferred     = signal<string>('Any');
  newVsCvg        = signal<string>('Any');
  lastAgValue     = signal<Set<string>>(new Set());
  lastAgFreshness = signal<string>('Any');
  newVsLastAg     = signal<string>('Any');
  nace            = signal<Set<string>>(new Set());
  legalForm       = signal<Set<string>>(new Set());
  companyRole     = signal<Set<string>>(new Set());
  decision        = signal<Decision>('Accept');

  confirmCloseOpen = signal(false);
  private baseline = '';

  constructor() {
    effect(() => {
      if (!this.open()) return;
      const r = this.rule();
      const c = r?.criteria ?? EMPTY_CRITERIA;
      this.position.set(String(r?.position ?? this.ruleCount() + 1));
      this.sensitivity.set(new Set(c.sensitivity ?? []));
      this.exposureOp.set(c.exposure?.op ?? '');
      this.exposureAmt.set(c.exposure ? String(c.exposure.amount) : '');
      this.newAutoGrade.set(new Set(c.newAutoGrade ?? []));
      this.cvgValue.set(new Set(c.cvgValue ?? []));
      this.cvgType.set(new Set(c.cvgType ?? []));
      this.cvgFreshness.set(c.cvgFreshness ?? 'Any');
      this.transferred.set(c.transferred == null ? 'Any' : (c.transferred ? 'Yes' : 'No'));
      this.newVsCvg.set(c.newVsCvg ?? 'Any');
      this.lastAgValue.set(new Set(c.lastAgValue ?? []));
      this.lastAgFreshness.set(c.lastAgFreshness ?? 'Any');
      this.newVsLastAg.set(c.newVsLastAg ?? 'Any');
      this.nace.set(new Set(c.nace ?? []));
      this.legalForm.set(new Set(c.legalForm ?? []));
      this.companyRole.set(new Set(c.companyRole ?? []));
      this.decision.set(r?.decision ?? 'Accept');

      // Snapshot straight from the source data (c / r), never via buildCriteria()/
      // the signals: reading those signals here would register them as effect
      // dependencies, turning every field edit into a re-run that resets the form
      // back to c (EMPTY_CRITERIA in create mode).
      this.baseline = JSON.stringify(c) + (r?.decision ?? 'Accept') + String(r?.position ?? this.ruleCount() + 1);
    });
  }

  private setToNull<T>(s: Set<string>): T[] | null { return s.size ? ([...s] as T[]) : null; }
  private singleToNull<T>(v: string): T | null { return v && v !== 'Any' ? (v as T) : null; }

  private buildCriteria(): RuleCriteria {
    const amt = parseInt(this.exposureAmt(), 10);
    return {
      sensitivity: this.setToNull<Sensitivity>(this.sensitivity()),
      exposure: this.exposureOp() && !isNaN(amt) ? { op: this.exposureOp() as '>' | '<=', amount: amt } : null,
      newAutoGrade: this.setToNull<Grade>(this.newAutoGrade()),
      cvgValue: this.setToNull<Grade>(this.cvgValue()),
      cvgType: this.setToNull<GradeType>(this.cvgType()),
      cvgFreshness: this.singleToNull<Freshness>(this.cvgFreshness()),
      transferred: this.transferred() === 'Any' ? null : this.transferred() === 'Yes',
      newVsCvg: this.singleToNull<Comparison>(this.newVsCvg()),
      lastAgValue: this.setToNull<Grade>(this.lastAgValue()),
      lastAgFreshness: this.singleToNull<Freshness>(this.lastAgFreshness()),
      newVsLastAg: this.singleToNull<Comparison>(this.newVsLastAg()),
      nace: this.setToNull<string>(this.nace()),
      legalForm: this.setToNull<string>(this.legalForm()),
      companyRole: this.setToNull<string>(this.companyRole()),
    };
  }
  private snapshot(): string { return JSON.stringify(this.buildCriteria()) + this.decision() + String(this.resolvedPosition()); }
  private isDirty(): boolean { return this.snapshot() !== this.baseline; }

  // exposure amount required (and numeric) when an operator is chosen
  canSave = computed(() => !this.exposureOp() || (!!this.exposureAmt() && !isNaN(parseInt(this.exposureAmt(), 10))));

  toggleSet(sig: WritableSignal<Set<string>>, value: string): void {
    const next = new Set(sig()); next.has(value) ? next.delete(value) : next.add(value); sig.set(next);
  }

  selectDecision(value: Decision): void { this.decision.set(value); }

  /** Saisie hors bornes ramenée à la borne : une position invalide n'est pas une
   *  erreur à corriger, c'est une intention (« tout en haut », « tout en bas »). */
  onPositionInput(raw: string): void {
    const digits = raw.replace(/[^0-9]/g, '');
    this.position.set(digits);
  }

  private resolvedPosition(): number {
    const n = parseInt(this.position(), 10);
    if (isNaN(n)) return this.rule()?.position ?? this.maxPosition();
    return Math.min(Math.max(n, 1), this.maxPosition());
  }

  onPositionBlur(): void { this.position.set(String(this.resolvedPosition())); }

  onSave(): void {
    if (!this.canSave()) return;
    const r = this.rule();
    this.save.emit({
      id: r?.id ?? `r-${Date.now()}`,
      position: this.resolvedPosition(),
      decision: this.decision(),
      criteria: this.buildCriteria(),
    });
  }
  requestClose(): void { this.isDirty() ? this.confirmCloseOpen.set(true) : this.closed.emit(); }
  confirmClose(): void { this.confirmCloseOpen.set(false); this.closed.emit(); }
  cancelClose(): void { this.confirmCloseOpen.set(false); }
}
