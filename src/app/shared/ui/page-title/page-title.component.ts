import { Component, input, output } from '@angular/core';
import { BadgeComponent, type BadgeStatus } from '../badge/badge.component';
import { LinkComponent } from '../link/link.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ds-page-title',
  standalone: true,
  imports: [BadgeComponent, LinkComponent, IconComponent],
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.scss',
  host: {
    'class': 'ds-page-title',
  },
})
export class PageTitleComponent {
  title       = input.required<string>();
  id          = input<string | null>(null);
  badgeLabel  = input<string | null>(null);
  badgeStatus = input<BadgeStatus>('warning');
  actionLabel = input<string | null>(null);
  actionHref  = input<string>('#');

  actionClicked = output<void>();
}
