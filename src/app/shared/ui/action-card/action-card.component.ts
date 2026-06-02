import { Component, computed, input, output } from '@angular/core';
import { LinkComponent } from '../link/link.component';
import { IconComponent } from '../icon/icon.component';
import { IconTileComponent } from '../icon-tile/icon-tile.component';
import { RadioComponent } from '../radio/radio.component';
import { TagComponent } from '../tag/tag.component';

export type ActionCardVariant = 'standard' | 'selectable';

@Component({
  selector: 'ds-action-card',
  standalone: true,
  imports: [LinkComponent, IconComponent, IconTileComponent, RadioComponent, TagComponent],
  templateUrl: './action-card.component.html',
  styleUrl: './action-card.component.scss',
  host: {
    '[class]': 'hostClasses()',
    '[attr.role]': 'variant() === "selectable" ? "radio" : null',
    '[attr.aria-checked]': 'variant() === "selectable" ? selected() : null',
    '[attr.tabindex]': 'variant() === "selectable" ? 0 : null',
    '(click)': 'onCardClick()',
    '(keydown.enter)': 'onCardClick()',
    '(keydown.space)': 'onKeySpace($event)',
  },
})
export class ActionCardComponent {
  variant     = input<ActionCardVariant>('standard');
  title       = input.required<string>();
  description = input<string>('');
  linkLabel   = input<string>('Get started');
  linkHref    = input<string>('#');

  selected    = input<boolean>(false);
  badgeLabel  = input<string | null>(null);

  selectedChange = output<boolean>();

  hostClasses = computed(() => [
    'ds-action-card',
    `ds-action-card--${this.variant()}`,
    this.variant() === 'selectable' && this.selected() ? 'ds-action-card--selected' : '',
  ].filter(Boolean).join(' '));

  onCardClick(): void {
    if (this.variant() !== 'selectable') return;
    this.selectedChange.emit(true);
  }
  onKeySpace(ev: Event): void {
    if (this.variant() !== 'selectable') return;
    ev.preventDefault();
    this.selectedChange.emit(true);
  }
}
