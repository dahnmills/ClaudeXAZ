import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SCREENS, Screen, versionLabel } from '../screens.data';

// Not every screen is Useberry-eligible — this curated order is intentional.
const CURATED_PATHS = [
  'search',
  'admin-data',
  'buyer-summary/137381425',
  'tag-configuration',
  'home',
  'filters',
  'accordion',
  'modal',
  'maintenance',
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
  readonly universes: Screen[] = CURATED_PATHS.map(
    (path) => SCREENS.find((s) => s.path === path)!,
  );
  readonly versionLabel = versionLabel;
  copied = signal<string | null>(null);

  /** URL absolue avec hash, prête à coller dans Useberry. */
  fullUrl(path: string): string {
    return `${location.origin}/#/user-testing/${path}`;
  }

  copyLabel(label: string): string {
    return `Copy URL for ${label}`;
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
