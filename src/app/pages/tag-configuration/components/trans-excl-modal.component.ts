import { Component, computed, effect, input, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { InputSearchComponent } from '../../../shared/ui/input-search/input-search.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ButtonIconComponent } from '../../../shared/ui/button-icon/button-icon.component';
import { FunctionalNoticeComponent } from '../../../shared/ui/functional-notice/functional-notice.component';
import { TagComponent } from '../../../shared/ui/tag/tag.component';
import { FlyoutMenuComponent } from '../../../shared/ui/flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../../../shared/ui/flyout-menu/flyout-menu-item.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { StatusReasonCode } from '../tag-configuration.models';
import { STATUS_REASON_REFERENTIAL } from '../tag-configuration.data';

/**
 * Edit TRANS-NA-EXCL modal (P3) — status reason codes excluded from the
 * TRANS-NA calculation for the current country.
 *
 * "Current codes" is a read-only list (code key + description + remove).
 * "Add codes" is a search box filtering the referential (excluding already
 * -selected codes) rendered as a ds-flyout-menu; clicking a candidate adds it.
 * An empty list is a valid, savable state — shown with an info notice
 * explaining that saving with no codes will allow all status reason codes.
 *
 * Composition: ds-modal (self-composes header/content/footer via title input
 * + [slot=actions]) + ds-input-search + ds-flyout-menu/-item + ds-tag (static)
 * + ds-functional-notice + ds-button + ds-button-icon.
 */
@Component({
  selector: 'tag-trans-excl-modal',
  standalone: true,
  imports: [
    ModalComponent, InputSearchComponent, ButtonComponent, ButtonIconComponent,
    FunctionalNoticeComponent, TagComponent, FlyoutMenuComponent, FlyoutMenuItemComponent,
    IconComponent,
  ],
  templateUrl: './trans-excl-modal.component.html',
  styleUrl: './trans-excl-modal.component.scss',
})
export class TransExclModalComponent {
  open        = input<boolean>(false);
  codes       = input.required<StatusReasonCode[]>();
  countryName = input<string>('');

  save   = output<StatusReasonCode[]>();
  closed = output<void>();

  local  = signal<StatusReasonCode[]>([]);
  search = signal('');

  constructor() {
    effect(() => {
      if (this.open()) {
        this.local.set(this.codes().map(c => ({ ...c })));
        this.search.set('');
      }
    });
  }

  isEmpty = computed(() => this.local().length === 0);

  candidates = computed(() => {
    const have = new Set(this.local().map(c => c.code));
    const q = this.search().trim().toLowerCase();
    return STATUS_REASON_REFERENTIAL
      .filter(c => !have.has(c.code))
      .filter(c => !q || c.code.toLowerCase().includes(q) || c.label.toLowerCase().includes(q));
  });

  add(c: StatusReasonCode): void {
    this.local.update(l => [...l, { ...c }]);
    this.search.set('');
  }

  removeCode(code: string): void {
    this.local.update(l => l.filter(c => c.code !== code));
  }

  onSave(): void {
    this.save.emit(this.local());   // empty list allowed
  }
}
