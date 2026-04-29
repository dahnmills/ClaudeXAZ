import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-action-card',
  standalone: true,
  imports: [],
  templateUrl: './action-card.component.html',
  styleUrl: './action-card.component.scss',
  host: { 'class': 'ds-action-card' },
})
export class ActionCardComponent {
  title       = input.required<string>();
  description = input<string>('');
  linkLabel   = input<string>('Get started');
  linkHref    = input<string>('#');
}
