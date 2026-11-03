/** Tours guidés du menu « ? ». Module pur : aucun import Angular, lu par les tests node. */

export interface WalkthroughStep {
  /** Sélecteur CSS de l'élément mis en avant (le premier trouvé). Absent : bulle
   *  centrée, pour l'intro et la fin. */
  element?: string;
  title: string;
  description: string;
  /**
   * Ce qui fait avancer l'étape :
   * - click : l'utilisateur clique l'élément mis en avant (et l'étape suivante est à l'écran) ;
   * - gone : l'élément `gone` disparaît (ex. le champ de renommage une fois confirmé) ;
   * - next : bouton de la bulle, pour une étape libre (essayer un geste) ou l'intro ;
   * - done : bouton de fin du tour.
   */
  advance: 'click' | 'gone' | 'next' | 'done';
  /** Pour advance 'gone' : sélecteur dont la disparition fait avancer. */
  gone?: string;
  /** Libellé du bouton pour 'next' et 'done' (défaut : Next / Done). */
  nextLabel?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export interface Walkthrough {
  id: string;
  /** Segment d'URL de la page (ex. 'buyer-summary'). Un tour au plus par page. */
  page: string;
  steps: WalkthroughStep[];
}
