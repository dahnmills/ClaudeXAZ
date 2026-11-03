import { Component, ElementRef, computed, inject, input, output } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';

export interface SegmentedOption {
  value:    string;
  label:    string;
  icon?:    IconName;
  iconPos?: 'left' | 'right';
  disabled?: boolean;
}

@Component({
  selector: 'ds-segmented-control',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './segmented-control.component.html',
  styleUrl: './segmented-control.component.scss',
  host: {
    'class': 'ds-segmented-control',
    '[attr.role]': "mode() === 'radio' ? 'radiogroup' : 'tablist'",
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-describedby]': 'describedBy() || null',
  },
})
export class SegmentedControlComponent {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  options  = input.required<SegmentedOption[]>();
  selected = input<string>('');
  disabled = input<boolean>(false);
  /** `tabs` : bascule de vue (role tablist). `radio` : réglage (role radiogroup,
   *  flèches, un seul arrêt de tabulation, options désactivées annoncées). */
  mode        = input<'tabs' | 'radio'>('tabs');
  ariaLabel   = input<string>('');
  /** Id de l'élément qui explique pourquoi une option est désactivée */
  describedBy = input<string>('');

  selectedChange = output<string>();

  private radio = computed(() => this.mode() === 'radio');

  isSelected(value: string): boolean {
    return this.selected() === value;
  }

  isOff(opt: SegmentedOption): boolean {
    return !!opt.disabled || this.disabled();
  }

  positionClass(idx: number): string {
    const total = this.options().length;
    if (total === 1) return 'ds-segmented-control__item--single';
    if (idx === 0) return 'ds-segmented-control__item--first';
    if (idx === total - 1) return 'ds-segmented-control__item--last';
    return 'ds-segmented-control__item--middle';
  }

  itemClasses(opt: SegmentedOption, idx: number): string {
    return [
      'ds-segmented-control__item',
      this.positionClass(idx),
      this.isSelected(opt.value) ? 'ds-segmented-control__item--selected' : '',
      this.isOff(opt) ? 'ds-segmented-control__item--disabled' : '',
    ].filter(Boolean).join(' ');
  }

  // Radio : seule l'option choisie est un arrêt de tabulation, désactivée ou non
  tabIndex(opt: SegmentedOption): number {
    if (this.radio()) return this.isSelected(opt.value) ? 0 : -1;
    return this.isOff(opt) ? -1 : 0;
  }

  onSelect(opt: SegmentedOption) {
    if (this.isOff(opt)) return;
    this.selectedChange.emit(opt.value);
  }

  // Radio : les flèches déplacent le focus et choisissent l'option, en
  // sautant les désactivées (APG, Radio Group)
  onKeydown(ev: KeyboardEvent, idx: number): void {
    if (!this.radio()) return;
    const step = ev.key === 'ArrowRight' || ev.key === 'ArrowDown' ? 1
      : ev.key === 'ArrowLeft' || ev.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    ev.preventDefault();
    const opts = this.options();
    for (let n = 1; n < opts.length; n++) {
      const i = (idx + step * n + opts.length) % opts.length;
      if (this.isOff(opts[i])) continue;
      this.selectedChange.emit(opts[i].value);
      this.host.nativeElement.querySelectorAll<HTMLElement>('.ds-segmented-control__item')[i]?.focus();
      return;
    }
  }
}
