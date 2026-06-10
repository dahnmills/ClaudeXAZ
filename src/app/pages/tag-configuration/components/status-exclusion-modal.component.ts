import { Component, computed, effect, input, output, signal } from '@angular/core';
import { ModalComponent }      from '../../../shared/ui/modal/modal.component';
import { ButtonComponent }     from '../../../shared/ui/button/button.component';
import { ButtonIconComponent } from '../../../shared/ui/button-icon/button-icon.component';
import { IconComponent }       from '../../../shared/ui/icon/icon.component';
import { InputSearchComponent } from '../../../shared/ui/input-search/input-search.component';
import { StatusExclusion }     from '../tag-configuration.models';

@Component({
  selector: 'tag-status-exclusion-modal',
  standalone: true,
  imports: [ModalComponent, ButtonComponent, ButtonIconComponent, IconComponent, InputSearchComponent],
  templateUrl: './status-exclusion-modal.component.html',
  styleUrl:    './status-exclusion-modal.component.scss',
})
export class StatusExclusionModalComponent {
  open        = input<boolean>(false);
  exclusions  = input<StatusExclusion[]>([]);
  /** IRP CLOSTHDO closed-status reference. Admins pick from this set; free entry is forbidden. */
  referential = input<StatusExclusion[]>([]);

  closed = output<void>();
  saved  = output<StatusExclusion[]>();

  items = signal<StatusExclusion[]>([]);
  query = signal('');

  constructor() {
    // Seed the working list from the input every time the modal opens.
    effect(() => {
      if (this.open()) {
        this.items.set(this.exclusions().map(e => ({ ...e })));
        this.query.set('');
      }
    });
  }

  private selectedCodes = computed(() => new Set(this.items().map(i => i.code)));

  /** Referential entries not yet selected, narrowed by the search query (code or label). */
  results = computed<StatusExclusion[]>(() => {
    const q = this.query().trim().toLowerCase();
    const selected = this.selectedCodes();
    return this.referential()
      .filter(r => !selected.has(r.code))
      .filter(r => !q || r.code.toLowerCase().includes(q) || r.label.toLowerCase().includes(q));
  });

  add(entry: StatusExclusion): void {
    if (this.selectedCodes().has(entry.code)) return;
    this.items.update(list => [...list, { ...entry }]);
  }

  removeItem(code: string): void {
    this.items.update(list => list.filter(i => i.code !== code));
  }

  onSave(): void {
    this.saved.emit(this.items());
  }
}
