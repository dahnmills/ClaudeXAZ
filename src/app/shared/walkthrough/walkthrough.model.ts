/** Parcours guidés du menu « ? ». Module pur : aucun import Angular, lu par les tests node. */

export interface WalkthroughStep {
  /** Sélecteur CSS de l'élément mis en avant ; le premier trouvé dans la page. */
  element: string;
  title: string;
  description: string;
  /**
   * click : l'utilisateur fait le geste lui-même, l'étape avance quand il clique
   * l'élément (et que l'étape suivante est à l'écran). done : bouton Done, fin du parcours.
   */
  advance: 'click' | 'done';
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export interface Walkthrough {
  id: string;
  /** Libellé de l'entrée du menu « ? ». */
  label: string;
  /** Segment d'URL de la page où le parcours a du sens (ex. 'buyer-summary'). */
  page: string;
  steps: WalkthroughStep[];
}
