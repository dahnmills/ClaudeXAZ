import { Component, computed, input, output } from '@angular/core';
import { ButtonRangeComponent, ButtonRangeStatus } from './button-range.component';

export type ButtonRangeGroupMode = 'multi' | 'range' | 'single';

export interface ButtonRangeGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ds-button-range-group',
  standalone: true,
  imports: [ButtonRangeComponent],
  template: `
    <div class="ds-button-range-group" role="group" [attr.aria-label]="ariaLabel()">
      @for (option of options(); track option.value) {
        <ds-button-range
          [label]="option.label"
          [status]="statusFor(option.value)"
          [disabled]="!!option.disabled"
          (clicked)="onOptionClicked(option.value)"
        />
      }
    </div>
  `,
  styles: [`
    :host { display: contents; }
    .ds-button-range-group {
      display: flex;
      flex-wrap: wrap;
      gap: var(--semantic-measurement-spacing-xs);
    }
  `],
})
export class ButtonRangeGroupComponent {
  options = input.required<ButtonRangeGroupOption[]>();
  value = input<string[]>([]);
  mode = input<ButtonRangeGroupMode>('range');
  ariaLabel = input<string>('');

  valueChange = output<string[]>();
  optionClicked = output<string>();

  statusFor(optionValue: string): ButtonRangeStatus {
    const selected = this.value();
    if (selected.length === 0) return 'default';

    const mode = this.mode();
    if (mode === 'multi' || mode === 'single') {
      return selected.includes(optionValue) ? 'selected' : 'default';
    }

    const options = this.options().map((option) => option.value);
    const index = options.indexOf(optionValue);
    if (index < 0) return 'default';

    const selectedIndexes = selected
      .map((v) => options.indexOf(v))
      .filter((v) => v >= 0)
      .sort((a, b) => a - b);
    if (selectedIndexes.length === 0) return 'default';
    const first = selectedIndexes[0];
    const last = selectedIndexes[selectedIndexes.length - 1];

    if (index === first || index === last) return 'selected';
    if (index > first && index < last) return 'between';
    return 'default';
  }

  onOptionClicked(optionValue: string): void {
    const next = this.computeNext(optionValue);
    this.valueChange.emit(next);
    this.optionClicked.emit(optionValue);
  }

  private computeNext(optionValue: string): string[] {
    const selected = this.value();
    const mode = this.mode();

    if (mode === 'single') {
      return selected.includes(optionValue) ? [] : [optionValue];
    }

    if (mode === 'multi') {
      return selected.includes(optionValue)
        ? selected.filter((v) => v !== optionValue)
        : [...selected, optionValue];
    }

    const options = this.options().map((option) => option.value);
    if (selected.length !== 1 || selected.includes(optionValue)) {
      return [optionValue];
    }

    const firstIndex = options.indexOf(selected[0]);
    const nextIndex = options.indexOf(optionValue);
    if (firstIndex < 0 || nextIndex < 0) return [optionValue];

    const [start, end] = firstIndex < nextIndex ? [firstIndex, nextIndex] : [nextIndex, firstIndex];
    return [options[start], options[end]];
  }
}
