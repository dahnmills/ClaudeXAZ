import {
  Component, ElementRef, HostListener,
  inject, input, model, output, signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { BadgeComponent } from '../badge/badge.component';
import { LinkComponent } from '../link/link.component';
import type { BadgeStatus } from '../badge/badge.component';

export interface SearchRecentItem {
  label:       string;       // ex. "IMMO DU MARAIS"
  badgeStatus: BadgeStatus;  // 'info' | 'warning' | 'neutral' | …
  badgeLabel:  string;       // ex. "Buyer"
}

@Component({
  selector: 'ds-search-bar',
  standalone: true,
  imports: [FormsModule, ButtonComponent, BadgeComponent, LinkComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  host: { 'class': 'ds-search-bar' },
})
export class SearchBarComponent {
  placeholder        = input<string>('Search…');
  buttonLabel        = input<string>('Search');
  value              = model<string>('');
  recentSearches     = input<SearchRecentItem[]>([]);
  advancedSearchHref = input<string>('#');

  search       = output<string>();
  recentSelect = output<SearchRecentItem>();

  flyoutOpen = signal(false);

  private el = inject(ElementRef);

  /** Ferme le flyout si le clic est en dehors du composant */
  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target as Node)) {
      this.flyoutOpen.set(false);
    }
  }

  onInputFocus(): void {
    if (this.recentSearches().length > 0) {
      this.flyoutOpen.set(true);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter')  this.onSearch();
    if (event.key === 'Escape') this.flyoutOpen.set(false);
  }

  onSearch(): void {
    this.flyoutOpen.set(false);
    this.search.emit(this.value());
  }

  selectRecent(item: SearchRecentItem): void {
    this.value.set(item.label);
    this.flyoutOpen.set(false);
    this.recentSelect.emit(item);
  }
}
