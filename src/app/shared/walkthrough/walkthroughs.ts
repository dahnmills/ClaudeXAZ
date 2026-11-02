import type { Walkthrough, WalkthroughStep } from './walkthrough.model';

export type { Walkthrough, WalkthroughStep } from './walkthrough.model';

/** Libellé unique de l'entrée du menu « ? », le même sur toutes les pages. */
export const TOUR_MENU_LABEL = 'Take a tour of this page';

/** Les 4 cases du layout 2×2, chacune remplie d'une card différente : on finit
 *  sur un board utile (une revue de risque), pas sur une case remplie. Les cards
 *  sont visées par leur rang dans le panneau (ordre du catalogue de la page). */
const BOARD_CARDS = ['Grade', 'Exposure', 'Risk figures', 'Limit'];

function fillSteps(): WalkthroughStep[] {
  return BOARD_CARDS.flatMap((card, i) => [
    {
      element: '.bs-slot__empty',
      title: `Fill a spot · ${BOARD_CARDS.length - i} left`,
      description: i === 0
        ? 'Click an empty spot to choose the card that goes in it.'
        : 'Click the next empty spot.',
      advance: 'click' as const, side: 'bottom' as const,
    },
    {
      element: `.drawer-cards .drawer-card:nth-child(${i + 1}) .drawer-card__foot ds-button-icon[type="secondary"]`,
      title: `Add ${card}`,
      description: i === 0
        ? `Click + on ${card} to place it in the spot. Outside the tour, you can also drag a card onto the board.`
        : `Click + on ${card}.`,
      advance: 'click' as const, side: 'left' as const,
    },
  ]);
}

/**
 * Catalogue des tours. Les sélecteurs visent des classes déjà présentes dans la
 * page plutôt que des attributs ajoutés pour l'occasion : la page n'a pas à
 * connaître son tour. Renommer une de ces classes casse le tour, le passage de
 * bout en bout le signale.
 */
export const WALKTHROUGHS: Walkthrough[] = [
  {
    id: 'buyer-summary',
    page: 'buyer-summary',
    steps: [
      {
        title: 'Build your own board',
        description: 'In about 2 minutes, you will build a risk review board with four cards, then give it a name. You do every click; follow the highlighted spot.',
        advance: 'next', nextLabel: 'Start',
      },
      {
        element: '.bs-action-bar > ds-button',
        title: 'Manage your boards',
        description: 'A board is the set of cards you see on a buyer. Click Manage boards.',
        advance: 'click', side: 'bottom',
      },
      {
        element: '.manage-board__create:not(.manage-board__create--alt)',
        title: 'Create a new board',
        description: 'Click Create a new board.',
        advance: 'click', side: 'left',
      },
      {
        // 5e layout du catalogue : « 2×2 grid », 4 cases de même taille
        element: '.create-board__grid ds-grid-selection:nth-child(5)',
        title: 'Pick the 2×2 grid',
        description: 'Four spots of the same size: a good start. Click the 2×2 grid.',
        advance: 'click', side: 'left',
      },
      ...fillSteps(),
      {
        element: '.bs-configure-surface .bs-slot',
        title: 'Resize a card',
        description: 'Drag the corner handle of a card to make it wider or taller. Try it, then click Next.',
        advance: 'next', side: 'right',
      },
      {
        element: '.bs-floatbar ds-button[type="primary"]',
        title: 'Save your board',
        description: 'All four spots are filled. Click Save board.',
        advance: 'click', side: 'top',
      },
      {
        element: '.bs-action-bar > ds-button',
        title: 'Open Manage boards again',
        description: 'Your board is saved as “My board”. Give it a real name: click Manage boards.',
        advance: 'click', side: 'bottom',
      },
      {
        element: '.manage-board__item--current ds-button-icon[ariaLabel="Rename"]',
        title: 'Rename it',
        description: 'Your new board is the one ticked. Click the pencil.',
        advance: 'click', side: 'left',
      },
      {
        element: '.manage-board__item--current',
        title: 'Type a name',
        description: 'Type a name, for example Risk review, then press the tick.',
        advance: 'gone', gone: '.manage-board__rename', side: 'left',
      },
      {
        title: 'Your board is ready',
        description: 'It now shows in the board list at the top right. You can edit, rename or delete it from Manage boards. This tour stays in the Help menu.',
        advance: 'done', nextLabel: 'Done',
      },
    ],
  },
];

/** Le tour de la page affichée, s'il existe. La page est un segment entier de
 *  l'URL, que l'on soit dans la zone dev (/prototype/…), testeur (/review/…) ou à la racine. */
export function walkthroughFor(url: string): Walkthrough | null {
  const segments = url.split(/[?#]/)[0].split('/').filter(Boolean);
  return WALKTHROUGHS.find(w => segments.includes(w.page)) ?? null;
}
