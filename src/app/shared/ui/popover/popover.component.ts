import { Component, input, output, computed } from '@angular/core';
import { ButtonIconComponent } from '../button-icon/button-icon.component';

export type PopoverPosition =
  | 'top-left'    | 'top-center'    | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'
  | 'right-top'   | 'right-center'  | 'right-bottom'
  | 'left-top'    | 'left-center'   | 'left-bottom';

@Component({
  selector: 'ds-popover',
  standalone: true,
  imports: [ButtonIconComponent],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
  host: { '[class]': 'hostClasses()' },
})
export class PopoverComponent {
  title     = input<string>('');
  position  = input<PopoverPosition>('bottom-left');
  reversed  = input<boolean>(false);
  dismissible = input<boolean>(true);

  closed = output<void>();

  hostClasses = computed(() => [
    'ds-popover',
    `ds-popover--${this.position()}`,
    this.reversed() ? 'ds-popover--reversed' : '',
  ].filter(Boolean).join(' '));
}
