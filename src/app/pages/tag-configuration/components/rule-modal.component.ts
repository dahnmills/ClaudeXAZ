import { Component, computed, effect, input, output, signal, WritableSignal } from '@angular/core';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { SelectComponent } from '../../../shared/ui/select/select.component';
import { InputTextComponent } from '../../../shared/ui/input-text/input-text.component';
import { SegmentedControlComponent } from '../../../shared/ui/segmented-control/segmented-control.component';
import { CheckboxComponent } from '../../../shared/ui/checkbox/checkbox.component';
import { DividerComponent } from '../../../shared/ui/divider/divider.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import {
  TagRule, RuleCriteria, EMPTY_CRITERIA, Decision, Grade, Sensitivity, GradeType, Freshness, Comparison,
} from '../tag-configuration.models';
import {
  SENSITIVITY_OPTIONS, GRADE_OPTIONS, GRADE_TYPE_OPTIONS, FRESHNESS_OPTIONS,
  COMPARISON_OPTIONS, DECISION_OPTIONS, COMPANY_ROLE_OPTIONS, NACE_OPTIONS, LEGAL_FORM_OPTIONS,
  EXPOSURE_OP_OPTIONS, TRANSFERRED_OPTIONS,
} from '../tag-configuration.data';

/**
 * Create/Edit rule modal — 4 grouped criteria sections (matching rule-card accents)
 * + a divider-separated Outcome (TAG Decision) section.
 * Local editable state is seeded from `rule()` on open via an effect; multi-selects
 * are held as Set<string>, single-selects as string ('Any' means "no constraint" / null).
 */
@Component({
  selector: 'tag-rule-modal',
  standalone: true,
  imports: [
    ModalComponent, SelectComponent, InputTextComponent, SegmentedControlComponent,
    CheckboxComponent, DividerComponent, ButtonComponent, ConfirmDialogComponent,
  ],
  templateUrl: './rule-modal.component.html',
  styleUrl: './rule-modal.component.scss',
})
export class RuleModalComponent {
  open     = input<boolean>(false);
  rule     = input<TagRule | null>(null);
  currency = input<string>('EUR');

  save   = output<TagRule>();
  closed = output<void>();

  // option lists exposed to the template
  SENSITIVITY_OPTIONS = SENSITIVITY_OPTIONS; GRADE_OPTIONS = GRADE_OPTIONS;
  GRADE_TYPE_OPTIONS = GRADE_TYPE_OPTIONS; FRESHNESS_OPTIONS = FRESHNESS_OPTIONS;
  COMPARISON_OPTIONS = COMPARISON_OPTIONS; DECISION_OPTIONS = DECISION_OPTIONS;
  COMPANY_ROLE_OPTIONS = COMPANY_ROLE_OPTIONS; NACE_OPTIONS = NACE_OPTIONS;
  LEGAL_FORM_OPTIONS = LEGAL_FORM_OPTIONS; EXPOSURE_OP_OPTIONS = EXPOSURE_OP_OPTIONS;
  TRANSFERRED_OPTIONS = TRANSFERRED_OPTIONS;

  isEdit = computed(() => this.rule() != null);
  title  = computed(() => this.isEdit() ? 'Edit rule' : 'Create a new rule');

  // editable local state (multi as Set<string>, single as string; '' or 'Any' = null)
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
      this.baseline = this.snapshot();
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
  private snapshot(): string { return JSON.stringify(this.buildCriteria()) + this.decision(); }
  private isDirty(): boolean { return this.snapshot() !== this.baseline; }

  // exposure amount required (and numeric) when an operator is chosen
  canSave = computed(() => !this.exposureOp() || (!!this.exposureAmt() && !isNaN(parseInt(this.exposureAmt(), 10))));

  toggleSet(sig: WritableSignal<Set<string>>, value: string): void {
    const next = new Set(sig()); next.has(value) ? next.delete(value) : next.add(value); sig.set(next);
  }

  onDecisionChange(value: string): void { this.decision.set(value as Decision); }

  onSave(): void {
    if (!this.canSave()) return;
    const r = this.rule();
    this.save.emit({
      id: r?.id ?? `r-${Date.now()}`,
      position: r?.position ?? 9999,
      status: r?.status ?? 'Valid',
      decision: this.decision(),
      criteria: this.buildCriteria(),
    });
  }
  requestClose(): void { this.isDirty() ? this.confirmCloseOpen.set(true) : this.closed.emit(); }
  confirmClose(): void { this.confirmCloseOpen.set(false); this.closed.emit(); }
  cancelClose(): void { this.confirmCloseOpen.set(false); }
}
