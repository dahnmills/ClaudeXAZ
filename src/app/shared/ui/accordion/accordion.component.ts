import { Component, computed, input, model } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type AccordionTone = 'default' | 'alt';

@Component({
  selector: 'ds-accordion',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  host: { '[class]': 'hostClasses()' },
})
export class AccordionComponent {
  title    = input.required<string>();
  tone     = input<AccordionTone>('default');
  disabled = input<boolean>(false);

  /** Bindable via [(open)] */
  open = model<boolean>(false);

  hostClasses = computed(() => [
    'ds-accordion',
    `ds-accordion--tone-${this.tone()}`,
    this.open()     ? 'ds-accordion--open'     : '',
    this.disabled() ? 'ds-accordion--disabled' : '',
  ].filter(Boolean).join(' '));

  toggle() {
    if (this.disabled()) return;
    this.open.update(v => !v);
  }
}
