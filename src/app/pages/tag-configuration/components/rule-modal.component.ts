import { Component, computed, effect, input, output, signal } from '@angular/core';
import { ModalComponent }     from '../../../shared/ui/modal/modal.component';
import { ButtonComponent }    from '../../../shared/ui/button/button.component';
import { InputTextComponent } from '../../../shared/ui/input-text/input-text.component';
import { SelectComponent, SelectOption } from '../../../shared/ui/select/select.component';
import { FunctionalNoticeComponent } from '../../../shared/ui/functional-notice/functional-notice.component';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { VisualButtonComponent } from '../../../shared/ui/visual-button/visual-button.component';
import {
  TagRule, TagDecision, TagRuleCriteria, TagFreshness, DECISION_BADGE,
} from '../tag-configuration.models';

const FRESHNESS_OPTIONS: SelectOption[] = [
  { value: '',         label: 'Any' },
  { value: 'fresh',    label: 'FRESH' },
  { value: 'outdated', label: 'OUTDATED' },
  { value: 'old',      label: 'OLD' },
];

const TYPE_OPTIONS: SelectOption[] = [
  { value: '',           label: 'Any' },
  { value: 'ALGORITHMIC', label: 'Algorithmic' },
  { value: 'MANUAL',      label: 'Manual' },
];

const TRANSFERRED_OPTIONS: SelectOption[] = [
  { value: '',    label: 'Any' },
  { value: 'yes', label: 'Yes' },
  { value: 'no',  label: 'No' },
];

const SENSITIVITY_SET = ['S0', 'S1', 'S2', 'S3'];
const AUTOGRADE_SET    = ['04', '05', '06', '07', '08', '09', '10'];

@Component({
  selector: 'tag-rule-modal',
  standalone: true,
  imports: [ModalComponent, ButtonComponent, InputTextComponent, SelectComponent, FunctionalNoticeComponent, ConfirmDialogComponent, VisualButtonComponent],
  templateUrl: './rule-modal.component.html',
  styleUrl:    './rule-modal.component.scss',
})
export class RuleModalComponent {
  open = input<boolean>(false);
  rule = input<TagRule | null>(null);   // null = create mode

  closed = output<void>();
  saved  = output<TagRule>();

  isEditMode = computed(() => this.rule() !== null);
  title      = computed(() => this.isEditMode() ? 'Edit rule' : 'Create rule');

  readonly decisions: TagDecision[] = ['valid', 'refuse', 'task', 'nc'];
  readonly decisionBadge = DECISION_BADGE;
  readonly freshnessOptions = FRESHNESS_OPTIONS;
  readonly typeOptions = TYPE_OPTIONS;
  readonly transferredOptions = TRANSFERRED_OPTIONS;

  selectedDecision = signal<TagDecision>('task');

  /** Snapshot of seeded form state, to detect unsaved edits. */
  private baseline = signal('');
  discardPromptOpen = signal(false);

  // ── Field signals (text = comma-separated lists; selects = single value) ──
  sensitivity   = signal('');
  exposureMin   = signal('');
  exposureMax   = signal('');
  newAutograde  = signal('');
  validValue    = signal('');
  validType     = signal('');
  validFreshness = signal('');
  validTransferred = signal('');
  validVsNew    = signal('');
  lastAgValue   = signal('');
  lastAgFreshness = signal('');
  lastAgVsNew   = signal('');
  nace          = signal('');
  legalForm     = signal('');
  role          = signal('');

  /**
   * "Transferred" only has meaning for a manually-set grade. Disabled until
   * Type = MANUAL, mirroring the moteur's dependency (cf. draft V2, mock 2.1).
   */
  transferredDisabled = computed(() => this.validType() !== 'MANUAL');

  constructor() {
    effect(() => {
      if (this.open()) this.seed();
    });
    // When Type leaves MANUAL, the Transferred constraint no longer applies: clear it.
    effect(() => {
      if (this.transferredDisabled() && this.validTransferred() !== '') {
        this.validTransferred.set('');
      }
    });
  }

  private seed(): void {
    const r = this.rule();
    if (!r) {
      this.selectedDecision.set('task');
      [this.sensitivity, this.exposureMin, this.exposureMax, this.newAutograde,
       this.validValue, this.validType, this.validFreshness, this.validTransferred, this.validVsNew,
       this.lastAgValue, this.lastAgFreshness, this.lastAgVsNew,
       this.nace, this.legalForm, this.role].forEach(s => s.set(''));
      queueMicrotask(() => this.baseline.set(this.snapshot()));
      return;
    }
    const c = r.criteria;
    this.selectedDecision.set(r.decision);
    this.sensitivity.set(c.sensitivity?.join(', ') ?? '');
    this.exposureMin.set(c.exposureMin?.toString() ?? '');
    this.exposureMax.set(c.exposureMax?.toString() ?? '');
    this.newAutograde.set(c.newAutograde?.join(', ') ?? '');
    this.validValue.set(c.validValue?.join(', ') ?? '');
    this.validType.set(c.validType?.[0] ?? '');
    this.validFreshness.set(c.validFreshness ?? '');
    this.validTransferred.set(c.validTransferred === null ? '' : (c.validTransferred ? 'yes' : 'no'));
    this.validVsNew.set(c.validVsNew ?? '');
    this.lastAgValue.set(c.lastAgValue?.join(', ') ?? '');
    this.lastAgFreshness.set(c.lastAgFreshness ?? '');
    this.lastAgVsNew.set(c.lastAgVsNew ?? '');
    this.nace.set(c.nace?.join(', ') ?? '');
    this.legalForm.set(c.legalForm?.join(', ') ?? '');
    this.role.set(c.role?.join(', ') ?? '');
    queueMicrotask(() => this.baseline.set(this.snapshot()));
  }

  private snapshot(): string {
    return JSON.stringify([
      this.selectedDecision(), this.sensitivity(), this.exposureMin(), this.exposureMax(),
      this.newAutograde(), this.validValue(), this.validType(), this.validFreshness(),
      this.validTransferred(), this.validVsNew(), this.lastAgValue(), this.lastAgFreshness(),
      this.lastAgVsNew(), this.nace(), this.legalForm(), this.role(),
    ]);
  }
  isDirty = computed(() => this.snapshot() !== this.baseline());

  /** Close request : guard unsaved edits. */
  requestClose(): void {
    if (this.isDirty()) this.discardPromptOpen.set(true);
    else this.closed.emit();
  }
  confirmDiscard(): void { this.discardPromptOpen.set(false); this.closed.emit(); }
  cancelDiscard():  void { this.discardPromptOpen.set(false); }

  private list(v: string): string[] | null {
    const parts = v.split(',').map(s => s.trim()).filter(Boolean);
    return parts.length ? parts : null;
  }
  private numOrNull(v: string): number | null {
    const n = parseInt(v.replace(/\s/g, ''), 10);
    return Number.isNaN(n) ? null : n;
  }
  private fresh(v: string): TagFreshness | null {
    return v === 'fresh' || v === 'outdated' || v === 'old' ? v : null;
  }

  private buildCriteria(): TagRuleCriteria {
    return {
      sensitivity:     this.list(this.sensitivity()),
      exposureMin:     this.numOrNull(this.exposureMin()),
      exposureMax:     this.numOrNull(this.exposureMax()),
      newAutograde:    this.list(this.newAutograde()),
      validValue:      this.list(this.validValue()),
      validType:       this.list(this.validType()),
      validFreshness:  this.fresh(this.validFreshness()),
      validTransferred: this.validTransferred() === '' ? null : this.validTransferred() === 'yes',
      validVsNew:      this.validVsNew().trim() || null,
      lastAgValue:     this.list(this.lastAgValue()),
      lastAgFreshness: this.fresh(this.lastAgFreshness()),
      lastAgVsNew:     this.lastAgVsNew().trim() || null,
      nace:            this.list(this.nace()),
      legalForm:       this.list(this.legalForm()),
      role:            this.list(this.role()),
    };
  }

  /** A rule with no active criteria matches every company — flag it. */
  isCatchAll = computed(() => {
    const c = this.buildCriteria();
    return Object.values(c).every(v => v === null);
  });

  /** Exposure min must be ≤ max when both are set. */
  exposureValid = computed(() => {
    const lo = this.numOrNull(this.exposureMin()), hi = this.numOrNull(this.exposureMax());
    return lo === null || hi === null || lo <= hi;
  });

  /** Enum criteria must reference known values (typos = rules that never match). */
  private unknown(v: string, set: string[]): string[] {
    return (this.list(v) ?? []).map(x => x.toUpperCase()).filter(x => !set.includes(x));
  }
  sensitivityBad = computed(() => this.unknown(this.sensitivity(), SENSITIVITY_SET));
  autogradeBad   = computed(() => this.unknown(this.newAutograde(), AUTOGRADE_SET));
  sensitivityValid = computed(() => this.sensitivityBad().length === 0);
  autogradeValid   = computed(() => this.autogradeBad().length === 0);

  canSave = computed(() =>
    this.exposureValid() && this.sensitivityValid() && this.autogradeValid(),
  );

  onSave(): void {
    if (!this.canSave()) return;
    const base = this.rule();
    this.saved.emit({
      id:       base?.id       ?? crypto.randomUUID(),
      position: base?.position ?? 0,
      decision: this.selectedDecision(),
      criteria: this.buildCriteria(),
    });
  }
}
