import { Component, input } from '@angular/core';
import { type ThumbKind } from './buyer-summary-v2.data';

/** Schematic vignette of a Bento card for the gallery: the kind of content
 *  (big figure, curve, bars, list, table, gauge, key figures) drawn with
 *  neutral shapes, never a real value. Decorative: the button around it
 *  carries the accessible name. Candidate for a design system atom once it
 *  has a Figma master. */
@Component({
  selector: 'app-bento-thumb',
  standalone: true,
  templateUrl: './bento-thumb.component.html',
  styleUrl: './bento-thumb.component.scss',
  host: { 'aria-hidden': 'true', '[class]': "'bt bt--' + kind()" },
})
export class BentoThumbComponent {
  kind = input.required<ThumbKind>();

  /** Bar heights of the bars vignette, in quarters of the drawing height. */
  readonly bars = [2, 3, 2, 4, 3, 4];
  readonly rows = [0, 1, 2, 3];
  readonly cols = [0, 1, 2];
}
