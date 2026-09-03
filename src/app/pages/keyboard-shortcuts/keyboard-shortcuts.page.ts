import { Component, inject } from '@angular/core';
import { BuyerSummaryComponent } from '../buyer-summary/buyer-summary.component';
import { ShortcutsService } from '../../user-testing/topbox/shortcuts.service';

/**
 * Écran de test de l'aide-mémoire clavier.
 *
 * Comme la page Spotlight, ce n'est pas un écran de plus : c'est un vrai écran
 * produit (le dossier acheteur, qui porte le shell, son header et son « ? »)
 * avec la fonctionnalité posée dessus. Tester le panneau sur un fond vide ne
 * dirait rien de ce qu'il occulte ni de ce qu'on peut encore lire au-dessus.
 *
 * Le panneau s'ouvre à l'arrivée — c'est le sujet de l'écran. Le chemin réel
 * (« ? » → « Keyboard shortcuts », ou la touche `?`) reste disponible une fois
 * qu'on l'a fermé, et fonctionne de la même façon sur tous les autres écrans.
 */
@Component({
  selector: 'app-keyboard-shortcuts-page',
  standalone: true,
  imports: [BuyerSummaryComponent],
  templateUrl: './keyboard-shortcuts.page.html',
  styleUrl: './keyboard-shortcuts.page.scss',
})
export class KeyboardShortcutsPage {
  private shortcuts = inject(ShortcutsService);

  constructor() {
    this.shortcuts.open();
  }
}
