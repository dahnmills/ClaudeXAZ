import { Component, computed, effect, input, output, signal } from '@angular/core';
import { ModalComponent }     from '../../../shared/ui/modal/modal.component';
import { ButtonComponent }    from '../../../shared/ui/button/button.component';
import { InputTextComponent } from '../../../shared/ui/input-text/input-text.component';
import { FunctionalNoticeComponent } from '../../../shared/ui/functional-notice/functional-notice.component';
import { FreshnessConfig }    from '../tag-configuration.models';

@Component({
  selector: 'tag-freshness-modal',
  standalone: true,
  imports: [ModalComponent, ButtonComponent, InputTextComponent, FunctionalNoticeComponent],
  templateUrl: './freshness-modal.component.html',
  styleUrl:    './freshness-modal.component.scss',
})
export class FreshnessModalComponent {
  open   = input<boolean>(false);
  config = input<FreshnessConfig>({
    lastVerified: { freshMonths: 6,  outdatedMonths: 12 },
    manualGrade:  { freshMonths: 12, outdatedMonths: 24 },
  });

  closed = output<void>();
  saved  = output<FreshnessConfig>();

  // Two-way bound to inputs (string for ds-input-text).
  lvFresh    = signal('6');
  lvOutdated = signal('12');
  mgFresh    = signal('12');
  mgOutdated = signal('24');

  constructor() {
    // Seed fields from config each time the modal opens.
    effect(() => {
      if (this.open()) {
        const c = this.config();
        this.lvFresh.set(String(c.lastVerified.freshMonths));
        this.lvOutdated.set(String(c.lastVerified.outdatedMonths));
        this.mgFresh.set(String(c.manualGrade.freshMonths));
        this.mgOutdated.set(String(c.manualGrade.outdatedMonths));
      }
    });
  }

  private num(v: string): number | null {
    const n = parseInt(v, 10);
    return Number.isNaN(n) || n < 0 ? null : n;
  }

  lvValid = computed(() => {
    const f = this.num(this.lvFresh()), o = this.num(this.lvOutdated());
    return f !== null && o !== null && f < o;
  });
  mgValid = computed(() => {
    const f = this.num(this.mgFresh()), o = this.num(this.mgOutdated());
    return f !== null && o !== null && f < o;
  });
  isValid = computed(() => this.lvValid() && this.mgValid());

  errorMessage = computed(() =>
    this.isValid() ? '' : 'The "Fresh ≤" value must be a positive number lower than "Old >".',
  );

  onSave(): void {
    if (!this.isValid()) return;
    this.saved.emit({
      lastVerified: { freshMonths: this.num(this.lvFresh())!, outdatedMonths: this.num(this.lvOutdated())! },
      manualGrade:  { freshMonths: this.num(this.mgFresh())!, outdatedMonths: this.num(this.mgOutdated())! },
    });
  }
}
