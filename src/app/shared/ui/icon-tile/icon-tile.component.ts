import { Component, computed, input } from '@angular/core';

export type IconTileSize = 's' | 'm' | 'l';
export type IconTileTone = 'brand' | 'neutral' | 'subtle';

/**
 * Tile décorative pour héberger une icône (slot) dans un cadre coloré.
 * Pattern récurrent : ActionCard, ResultCard product-icon, etc.
 */
@Component({
  selector: 'ds-icon-tile',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './icon-tile.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'aria-hidden': 'true',
  },
})
export class IconTileComponent {
  size = input<IconTileSize>('m');
  tone = input<IconTileTone>('brand');

  hostClasses = computed(() => [
    'ds-icon-tile',
    `ds-icon-tile--size-${this.size()}`,
    `ds-icon-tile--tone-${this.tone()}`,
  ].join(' '));
}
