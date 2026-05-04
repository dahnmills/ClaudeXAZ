import { Component, computed, effect, output, signal } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { InputTextComponent } from '../input-text/input-text.component';
import { TagComponent } from '../tag/tag.component';

interface StatusChip { id: string; label: string; selected: boolean; }

@Component({
  selector: 'ds-more-criteria',
  standalone: true,
  imports: [IconComponent, ButtonComponent, ButtonIconComponent, CheckboxComponent, InputTextComponent, TagComponent],
  templateUrl: './more-criteria.component.html',
  styleUrl: './more-criteria.component.scss',
  host: { 'class': 'ds-more-criteria' },
})
export class MoreCriteriaComponent {
  cleared = output<void>();
  closed = output<void>();
  countChange = output<number>();

  statusChips = signal<StatusChip[]>([
    { id: 'active',      label: 'Active',      selected: false },
    { id: 'closed',      label: 'Closed',      selected: false },
    { id: 'provisional', label: 'Provisionnal', selected: false },
  ]);

  extendCountry = signal<boolean>(false);
  street = signal<string>('');
  city = signal<string>('');
  region = signal<string>('');
  zip = signal<string>('');
  phone = signal<string>('');

  count = computed(() => {
    let n = 0;
    n += this.statusChips().filter(c => c.selected).length;
    if (this.extendCountry()) n++;
    if (this.street().trim()) n++;
    if (this.city().trim()) n++;
    if (this.region().trim()) n++;
    if (this.zip().trim()) n++;
    if (this.phone().trim()) n++;
    return n;
  });

  constructor() {
    effect(() => this.countChange.emit(this.count()));
  }

  toggleChip(id: string) {
    this.statusChips.update(arr => arr.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  }

  clearAll() {
    this.statusChips.update(arr => arr.map(c => ({ ...c, selected: false })));
    this.extendCountry.set(false);
    this.street.set('');
    this.city.set('');
    this.region.set('');
    this.zip.set('');
    this.phone.set('');
    this.cleared.emit();
  }
}
