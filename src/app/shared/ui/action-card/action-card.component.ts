import { Component, input } from '@angular/core';
import { LinkComponent } from '../link/link.component';
import { IconComponent } from '../icon/icon.component';
import { IconTileComponent } from '../icon-tile/icon-tile.component';

@Component({
  selector: 'ds-action-card',
  standalone: true,
  imports: [LinkComponent, IconComponent, IconTileComponent],
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
