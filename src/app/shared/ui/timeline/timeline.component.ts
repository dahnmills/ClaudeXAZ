import { Component } from '@angular/core';

/**
 * Timeline — conteneur vertical d'events.
 * Source : Figma > Data Display > Timeline 🟠
 *
 * Compose <ds-timeline-event> en children.
 */
@Component({
  selector: 'ds-timeline',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './timeline.component.scss',
  host: { 'class': 'ds-timeline', 'role': 'list' },
})
export class TimelineComponent {}
