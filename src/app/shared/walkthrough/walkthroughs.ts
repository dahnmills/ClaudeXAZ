import type { Walkthrough } from './walkthrough.model';

export type { Walkthrough, WalkthroughStep } from './walkthrough.model';

/**
 * Catalogue des parcours. Les sélecteurs visent des classes déjà présentes dans
 * la page plutôt que des attributs ajoutés pour l'occasion : la page n'a pas à
 * connaître ses parcours. Renommer une de ces classes casse le parcours, le test
 * de bout en bout du menu le signale.
 */
export const WALKTHROUGHS: Walkthrough[] = [
  {
    id: 'create-custom-board',
    label: 'Create a custom board',
    page: 'buyer-summary',
    steps: [
      {
        element: '.bs-action-bar > ds-button',
        title: 'Manage your boards',
        description: 'A board is the set of cards you see on a buyer. Click Manage boards to build your own.',
        advance: 'click', side: 'bottom',
      },
      {
        element: '.manage-board__create:not(.manage-board__create--alt)',
        title: 'Create a new board',
        description: 'Click Create a new board.',
        advance: 'click', side: 'left',
      },
      {
        element: '.create-board__grid',
        title: 'Pick a layout',
        description: 'Choose a starting layout. You can change every card afterwards.',
        advance: 'click', side: 'left',
      },
      {
        element: '.bs-slot__empty',
        title: 'Fill a spot',
        description: 'Click an empty spot to choose the card that goes in it.',
        advance: 'click', side: 'bottom',
      },
      {
        element: '.drawer-card__foot ds-button-icon[type="secondary"]',
        title: 'Add a card',
        description: 'Click + on a card to place it in the spot. You can fill the other spots the same way.',
        advance: 'click', side: 'left',
      },
      {
        element: '.bs-floatbar ds-button[type="primary"]',
        title: 'Save your board',
        description: 'Fill as many spots as you like, then click Save board.',
        advance: 'click', side: 'top',
      },
      {
        element: '.bs-action-bar__select',
        title: 'Your new board',
        description: 'It is selected here. Switch boards from this list; rename or edit them from Manage boards.',
        advance: 'done', side: 'bottom',
      },
    ],
  },
];

/** Les parcours de la page affichée. La page est un segment entier de l'URL, que
 *  l'on soit dans la zone dev (/prototype/…), testeur (/review/…) ou à la racine. */
export function walkthroughsFor(url: string): Walkthrough[] {
  const segments = url.split(/[?#]/)[0].split('/').filter(Boolean);
  return WALKTHROUGHS.filter(w => segments.includes(w.page));
}
