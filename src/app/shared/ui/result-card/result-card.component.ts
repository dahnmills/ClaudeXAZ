import { Component, computed, inject, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { SnackbarService } from '../snackbar/snackbar.service';

export interface InfoRow { label: string; value: string; }

export interface ResultCardData {
  name: string;
  city?: string;
  address: string;
  companyId?: string;
  score?: number;
  exists?: boolean;
  general?: InfoRow[];
  financial?: InfoRow[];
  localIds?: InfoRow[];
  providers?: string[];
}

@Component({
  selector: 'ds-result-card',
  standalone: true,
  imports: [IconComponent, ButtonIconComponent, TooltipDirective],
  templateUrl: './result-card.component.html',
  styleUrl: './result-card.component.scss',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class ResultCardComponent {
  data = input.required<ResultCardData>();
  open = input<boolean>(false);
  favorited = input<boolean>(false);

  toggled = output<void>();
  added = output<void>();
  starred = output<void>();

  exists = computed(() => this.data().exists ?? true);

  private snackbar = inject(SnackbarService);

  copyId() {
    const id = this.data().companyId;
    if (!id) return;
    navigator.clipboard?.writeText(id).then(
      () => this.snackbar.show(`Company ID ${id} copied`, { tone: 'success', icon: 'check' }),
      () => this.snackbar.show('Copy failed', { tone: 'error' }),
    );
  }

  hostClasses = computed(() => [
    'ds-result-card',
    this.open() ? 'ds-result-card--open' : '',
  ].filter(Boolean).join(' '));

  scorePct = computed(() => {
    const s = this.data().score ?? 0;
    return Math.max(0, Math.min(1, s)) * 100;
  });
}
