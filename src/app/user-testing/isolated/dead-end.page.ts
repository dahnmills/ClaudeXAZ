import { Component } from '@angular/core';

/**
 * Cul-de-sac des univers isolés : toute URL inconnue sous `/user-testing/*`
 * atterrit ici plutôt que sur l'index des scénarios. Aucun lien sortant, pour
 * qu'un testeur Useberry ne puisse jamais « remonter » vers la liste des pages,
 * même via précédent / URL trafiquée (problème rencontré sur la topbox).
 */
@Component({
  selector: 'app-ut-dead-end',
  standalone: true,
  template: `
    <main class="ut-dead">
      <p class="ut-dead__text">Écran de test indisponible.</p>
    </main>
  `,
  styles: [`
    .ut-dead {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
    }
    .ut-dead__text {
      font-family: system-ui, sans-serif;
      font-size: 15px;
      color: #767676;
    }
  `],
})
export class DeadEndPage {}
