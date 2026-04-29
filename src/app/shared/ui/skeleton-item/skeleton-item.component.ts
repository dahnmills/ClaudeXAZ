import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-skeleton-item',
  standalone: true,
  template: '',
  styleUrl: './skeleton-item.component.scss',
  host: {
    'class': 'ds-skeleton-item',
    'aria-hidden': 'true',
    '[style.width]':        'width()',
    '[style.height]':       'height()',
    '[style.border-radius]': 'radius()',
  },
})
export class SkeletonItemComponent {
  /** Largeur du bloc squelette. Ex: '100%', '200px', '50%' */
  width  = input<string>('100%');
  /** Hauteur du bloc squelette. 12px = valeur Figma pour une ligne de texte */
  height = input<string>('12px');
  /** Rayon de bordure. 4px = Figma text line, '50%' = avatar circulaire */
  radius = input<string>('4px');
}
