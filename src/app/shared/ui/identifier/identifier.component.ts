import { Component, inject, input } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { SnackbarService } from '../snackbar/snackbar.service';

@Component({
  selector: 'ds-identifier',
  standalone: true,
  imports: [IconComponent, TooltipDirective],
  templateUrl: './identifier.component.html',
  styleUrl: './identifier.component.scss',
})
export class IdentifierComponent {
  value = input.required<string>();
  icon = input<IconName | null>(null);
  copyable = input<boolean>(false);

  private snackbar = inject(SnackbarService);

  copy() {
    const value = this.value();
    navigator.clipboard?.writeText(value).then(
      () => this.snackbar.show(`${value} copied`, { tone: 'success', icon: 'check' }),
      () => this.snackbar.show('Copy failed', { tone: 'error' }),
    );
  }
}
