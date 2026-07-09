import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Coquille des univers isolés `/user-testing/*` (tests Useberry).
 *
 * Volontairement nue : juste un <router-outlet/>. Contrairement au ReviewShell,
 * elle NE monte PAS le compagnon de feedback, et l'inspecteur est masqué sous ce
 * préfixe (voir AppComponent). Aucun lien de navigation transverse → chaque
 * écran est un univers clos qu'on ne peut pas quitter vers l'index des scénarios.
 */
@Component({
  selector: 'app-user-testing-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class UserTestingShellComponent {}
