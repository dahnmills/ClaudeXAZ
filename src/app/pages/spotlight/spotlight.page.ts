import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BuyerSummaryComponent } from '../buyer-summary/buyer-summary.component';
import {
  SnackbarService,
  SpotlightComponent,
  type SpotlightCountry,
  type SpotlightItem,
} from '../../shared/ui';

// Pays proposés dans le panneau de la bulle drapeau — limités aux drapeaux
// disponibles dans `ds-flag`.
const COUNTRIES: SpotlightCountry[] = [
  { code: 'fr', name: 'France' },
  { code: 'de', name: 'Germany' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'us', name: 'United States' },
  { code: 'kr', name: 'South Korea' },
];

// ── Corpus recherché (mock) ────────────────────────────────────────────────
// Multi-entités : la palette indexe des buyers ET des applications, comme le
// montre la maquette (ManA — Manual Assessment).
// Le `country` est ce que filtre la bulle drapeau — un item sans pays est donc
// exclu dès qu'un pays est sélectionné (cas de ManA, qui n'en a pas).
const CORPUS: SpotlightItem[] = [
  { id: '137381425', name: 'Amazon GB',                 type: 'Buyer',       icon: 'buyers', status: 'Open', statusTone: 'success', country: 'gb' },
  { id: '204558719', name: 'Group Amazon FR',           type: 'Buyer',       icon: 'buyers', country: 'fr' },
  { id: '551023884', name: 'Amazing Loco',              type: 'Buyer',       icon: 'buyers', country: 'us' },
  { id: '693118250', name: 'Amaze Me Farces et Attrape', type: 'Buyer',      icon: 'buyers', country: 'fr' },
  { id: '118994372', name: 'ManA - Manual Assessment',  type: 'Application', icon: 'file-text' },
  { id: '900215674', name: 'Atlantic Seafood Imports',  type: 'Buyer',       icon: 'buyers', country: 'us' },
  { id: '770042913', name: 'Stahlbau Müller AG',        type: 'Buyer',       icon: 'buyers', country: 'de' },
  { id: '482290117', name: 'Galaxy Pharma Distribution', type: 'Buyer',      icon: 'buyers', country: 'kr' },
];

// Récents affichés à l'ouverture (avant toute saisie).
const RECENTS: SpotlightItem[] = [
  { id: '551023884', name: 'Amazing Loco',             type: 'Buyer',       icon: 'buyers', country: 'us' },
  { id: '693118250', name: 'Amaze Me Farces et Attrape', type: 'Buyer',     icon: 'buyers', country: 'fr' },
  { id: '118994372', name: 'ManA - Manual Assessment', type: 'Application', icon: 'file-text' },
];

@Component({
  selector: 'app-spotlight-page',
  standalone: true,
  imports: [
    BuyerSummaryComponent,
    SpotlightComponent,
  ],
  templateUrl: './spotlight.page.html',
  styleUrl: './spotlight.page.scss',
})
export class SpotlightPage {
  private router  = inject(Router);
  private snackbar = inject(SnackbarService);

  readonly corpus    = CORPUS;
  readonly recents   = RECENTS;
  readonly countries = COUNTRIES;

  spotlightOpen = signal<boolean>(false);
  query         = signal<string>('');

  // Alt+K (Windows) / ⌥K (Mac) → ouvre la palette.
  // Ctrl+K et Ctrl+Maj+K sont pris par Edge ; Alt reste libre.
  @HostListener('document:keydown', ['$event'])
  onKeydown(ev: KeyboardEvent) {
    if (ev.altKey && (ev.key.toLowerCase() === 'k' || ev.code === 'KeyK')) {
      ev.preventDefault();
      this.spotlightOpen.set(true);
    }
  }

  onSelected(item: SpotlightItem) {
    this.snackbar.show(`Opening ${item.name}`, { tone: 'neutral' });
    if (item.type === 'Buyer') {
      this.router.navigate(['/buyer-summary', item.id]);
    }
  }

  onCopied(item: SpotlightItem) {
    this.snackbar.show(`ID ${item.id} copied`, { tone: 'success', icon: 'copy' });
  }
}
