import { Component, computed, input } from '@angular/core';

/** Couleur de police (code risque porté par la police). `none` = « NO COLOR ». */
export type PolicyColorValue = 'red' | 'orange' | 'yellow' | 'green' | 'none' | 'unknown';
export type PolicyColorSize  = 's' | 'm';

const LETTER: Record<PolicyColorValue, string> = {
  red: 'R', orange: 'O', yellow: 'Y', green: 'G', none: 'N', unknown: 'U',
};

const NAME: Record<PolicyColorValue, string> = {
  red: 'red', orange: 'orange', yellow: 'yellow', green: 'green', none: 'no color', unknown: 'unknown',
};

/**
 * Pastille ronde à une lettre qui porte la couleur d'une police.
 * Source : Figma [CU] Coverbook 2026 > Local Components > Policy color
 * (Size S dans les cellules de tableau, M dans les panneaux).
 *
 * La lettre double toujours la couleur (jamais la couleur seule) ; `showName`
 * ajoute le nom en clair à droite (« Y yellow » du panneau police).
 */
@Component({
  selector: 'ds-policy-color',
  standalone: true,
  template: `
    <span class="ds-policy-color__pill" aria-hidden="true">{{ letter() }}</span>
    @if (showName()) {
      <span class="ds-policy-color__name">{{ name() }}</span>
    } @else {
      <span class="ds-policy-color__sr">Policy color {{ name() }}</span>
    }
  `,
  styleUrl: './policy-color.component.scss',
  host: {
    '[class]': 'hostClasses()',
    '[attr.title]': '"Policy color: " + name()',
  },
})
export class PolicyColorComponent {
  color    = input<PolicyColorValue>('none');
  size     = input<PolicyColorSize>('s');
  showName = input<boolean>(false);

  letter = computed(() => LETTER[this.color()]);
  name   = computed(() => NAME[this.color()]);

  hostClasses = computed(() => [
    'ds-policy-color',
    `ds-policy-color--${this.color()}`,
    `ds-policy-color--size-${this.size()}`,
  ].join(' '));
}
