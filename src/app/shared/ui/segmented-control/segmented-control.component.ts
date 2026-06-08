import { Component, computed, input, output } from '@angular/core';
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
  host: { 'class': 'ds-segmented-control', 'role': 'tablist' },
})
export class SegmentedControlComponent {
  options  = input.required<SegmentedOption[]>();
  selected = input<string>('');
  disabled = input<boolean>(false);

  selectedChange = output<string>();

  isSelected(value: string): boolean {
    return this.selected() === value;
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
      (opt.disabled || this.disabled()) ? 'ds-segmented-control__item--disabled' : '',
    ].filter(Boolean).join(' ');
  }

  onSelect(opt: SegmentedOption) {
    if (opt.disabled || this.disabled()) return;
    this.selectedChange.emit(opt.value);
  }
}
