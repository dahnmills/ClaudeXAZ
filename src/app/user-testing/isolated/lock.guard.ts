import { CanDeactivateFn } from '@angular/router';

/**
 * Verrou des univers isolés (Useberry).
 *
 * Empêche tout écran `/user-testing/*` d'être quitté : un clic interne qui
 * déclenche `router.navigate(['/buyer-summary', id])` (parcours search → buyer,
 * par ex.) est annulé — on reste sur l'URL et l'environnement courants. Chaque
 * univers est strictement mono-écran ; on ne peut ni enchaîner un parcours, ni
 * retomber sur l'index des scénarios.
 *
 * Retourner `false` annule la navigation et laisse l'URL inchangée.
 */
export const lockIsolatedGuard: CanDeactivateFn<unknown> = (_c, currentRoute, currentState, nextState) => {
  const here = currentState.url.split('?')[0];
  const next = nextState.url.split('?')[0];
  // On autorise seulement de rester exactement sur le même écran (ex. maj de
  // query params) ; tout changement de chemin est bloqué.
  return next === here;
};
