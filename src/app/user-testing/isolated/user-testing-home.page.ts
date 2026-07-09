import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Universe {
  path: string;
  label: string;
  hint: string;
}

const UNIVERSES: Universe[] = [
  { path: 'search', label: 'Search', hint: 'Recherche d\'entreprises' },
  { path: 'admin-data', label: 'Admin Data', hint: 'Édition des données admin' },
  { path: 'buyer-summary/137381425', label: 'Buyer Summary', hint: 'Dossier acheteur' },
  { path: 'tag-configuration', label: 'TAG Configuration', hint: 'Règles d\'auto-grading' },
  { path: 'home', label: 'Home', hint: 'Accueil du produit' },
  { path: 'filters', label: 'Filters', hint: 'Filtres de recherche' },
  { path: 'accordion', label: 'Topbox · Accordion', hint: 'Variante accordéon' },
  { path: 'modal', label: 'Topbox · Modal', hint: 'Variante modale' },
];

/**
 * Accueil privé des univers isolés (Useberry). Réservé à l'auteur : liste
 * chaque écran cloisonné avec son URL complète, prête à coller dans un test.
 * Chaque univers est mono-écran et verrouillé (voir lockIsolatedGuard).
 */
@Component({
  selector: 'app-ut-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-testing-home.page.html',
  styleUrl: './user-testing-home.page.scss',
})
export class UserTestingHomePage {
  readonly universes = UNIVERSES;
  copied = signal<string | null>(null);

  /** URL absolue avec hash, prête à coller dans Useberry. */
  fullUrl(path: string): string {
    return `${location.origin}/#/user-testing/${path}`;
  }

  copyLabel(label: string): string {
    return `Copier l'URL de ${label}`;
  }

  copy(path: string): void {
    navigator.clipboard?.writeText(this.fullUrl(path)).then(
      () => {
        this.copied.set(path);
        setTimeout(() => this.copied.set(null), 1600);
      },
      () => {},
    );
  }
}
