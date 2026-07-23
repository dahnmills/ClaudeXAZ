import { Component, computed, effect, input, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { InputTextComponent } from '../../../shared/ui/input-text/input-text.component';
import { FunctionalNoticeComponent } from '../../../shared/ui/functional-notice/functional-notice.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { FreshnessConfig } from '../tag-configuration.models';

const THRESHOLD_ORDER_ERROR = '"Old after" must be greater than or equal to "Fresh up to".';

/**
 * Edit grade freshness thresholds modal (P2) — 3-state model (Fresh / Outdated / Old),
 * 2 thresholds (freshUpToMonths, oldAfterMonths) x 2 grade types (Last checked autograde,
 * Valid manual grade). Current values are read-only; New values are the editable draft.
 * Per-group constraint: oldAfterMonths >= freshUpToMonths.
 *
 * Layout: one rm-card per grade type, each with 4 small label-above-input fields
 * (not a 5-column table) — a threshold value is 1-3 digits, so sizing every field
 * to fit its own label (instead of a shared table column) keeps inputs compact.
 *
 * Composition: ds-modal (self-composes header/content/footer via title input +
 * [slot=actions]) + ds-input-text (readonly for current fields) + ds-icon
 * (current → new arrow) + ds-functional-notice (inline warning) + ds-button.
 */
@Component({
  selector: 'tag-freshness-modal',
  standalone: true,
  imports: [ModalComponent, InputTextComponent, FunctionalNoticeComponent, ButtonComponent, IconComponent],
  templateUrl: './freshness-modal.component.html',
  styleUrl: './freshness-modal.component.scss',
})
export class FreshnessModalComponent {
  open   = input<boolean>(false);
  config = input.required<FreshnessConfig>();

  readonly thresholdOrderError = THRESHOLD_ORDER_ERROR;

  save   = output<FreshnessConfig>();
  closed = output<void>();

  // current (read-only display), seeded from config() on open
  curLastFresh = signal(0);
  curLastOld   = signal(0);
  curManFresh  = signal(0);
  curManOld    = signal(0);

  // new (editable draft), held as strings for ds-input-text
  lastFresh = signal('0');
  lastOld   = signal('0');
  manFresh  = signal('0');
  manOld    = signal('0');

  constructor() {
    effect(() => {
      if (!this.open()) return;
      const c = this.config();
      this.curLastFresh.set(c.lastCheckedAutograde.freshUpToMonths);
      this.curLastOld.set(c.lastCheckedAutograde.oldAfterMonths);
      this.curManFresh.set(c.validManualGrade.freshUpToMonths);
      this.curManOld.set(c.validManualGrade.oldAfterMonths);
      this.lastFresh.set(String(c.lastCheckedAutograde.freshUpToMonths));
      this.lastOld.set(String(c.lastCheckedAutograde.oldAfterMonths));
      this.manFresh.set(String(c.validManualGrade.freshUpToMonths));
      this.manOld.set(String(c.validManualGrade.oldAfterMonths));
    });
  }

  private n(s: string): number {
    const v = parseInt(s, 10);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  lastValid = computed(() => this.n(this.lastOld()) >= this.n(this.lastFresh()));
  manValid  = computed(() => this.n(this.manOld())  >= this.n(this.manFresh()));
  canSave   = computed(() => this.lastValid() && this.manValid());

  onSave(): void {
    if (!this.canSave()) return;
    this.save.emit({
      lastCheckedAutograde: { freshUpToMonths: this.n(this.lastFresh()), oldAfterMonths: this.n(this.lastOld()) },
      validManualGrade:     { freshUpToMonths: this.n(this.manFresh()),  oldAfterMonths: this.n(this.manOld()) },
    });
  }
}
