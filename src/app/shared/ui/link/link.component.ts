import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LinkTone = 'default' | 'neutral' | 'reversed';
export type LinkSize = 'm' | 's';
export type LinkWeight = 'regular' | 'semi-bold';

@Component({
  selector: 'ds-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class LinkComponent {
  href      = input<string>('#');
  tone      = input<LinkTone>('default');
  size      = input<LinkSize>('m');
  weight    = input<LinkWeight>('regular');
  underline = input<boolean>(false);
  disabled  = input<boolean>(false);
  external  = input<boolean>(false);

  hostClasses = computed(() => [
    'ds-link',
    `ds-link--tone-${this.tone()}`,
    `ds-link--size-${this.size()}`,
    `ds-link--weight-${this.weight()}`,
    this.underline() ? 'ds-link--underline'  : '',
    this.disabled()  ? 'ds-link--disabled'   : '',
  ].filter(Boolean).join(' '));
}
