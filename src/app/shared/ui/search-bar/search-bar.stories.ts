import type { Meta, StoryObj } from '@storybook/angular';
import { SearchBarComponent } from './search-bar.component';

import type { SearchRecentItem } from './search-bar.component';

const recentSearches: SearchRecentItem[] = [
  { label: 'IMMO DU MARAIS', badgeStatus: 'info',    badgeLabel: 'Buyer' },
  { label: 'AMAZON',         badgeStatus: 'warning',  badgeLabel: 'Buyer' },
  { label: 'EASYJET',        badgeStatus: 'neutral',  badgeLabel: 'Buyer' },
];

const meta: Meta<SearchBarComponent> = {
  title: 'Design System/Search Bar',
  component: SearchBarComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'grey' },
  },
  argTypes: {
    placeholder:    { control: 'text' },
    buttonLabel:    { control: 'text' },
    recentSearches: { control: 'object' },
  },
  args: {
    placeholder:  'Search for a buyer',
    buttonLabel:  'Search',
  },
};

export default meta;
type Story = StoryObj<SearchBarComponent>;

// ── Barre seule (sans historique) ─────────────────────────────
export const Default: Story = {
  args: {
    recentSearches: [],
  },
  decorators: [
    (storyFn) => {
      const story = storyFn();
      return { ...story };
    },
  ],
};

// ── Avec flyout "Recherches récentes" ─────────────────────────
// Cliquer dans l'input pour ouvrir le flyout
export const WithFlyout: Story = {
  args: {
    recentSearches,
  },
  render: (args) => ({
    props: args,
    // On pré-ouvre le flyout pour la démo visuelle
    template: `
      <div style="padding: 24px; max-width: 520px; position: relative;">
        <ds-search-bar
          [placeholder]="placeholder"
          [buttonLabel]="buttonLabel"
          [recentSearches]="recentSearches"
          advancedSearchHref="#"
        />
        <p style="margin-top: 8px; font-size: 12px; color: #767676;">
          ↑ Cliquez dans le champ pour ouvrir le flyout
        </p>
      </div>
    `,
  }),
};

// ── Flyout ouvert (snapshot visuel) ──────────────────────────
// Wrap + auto-open via JS pour Storybook (story décorative)
export const FlyoutOpen: Story = {
  args: {
    recentSearches,
  },
  render: (args) => ({
    props: {
      ...args,
      // Pré-rempli pour forcer l'affichage du flyout dans la story
      onReady: () => {
        const input = document.querySelector('ds-search-bar input') as HTMLInputElement;
        if (input) setTimeout(() => input.dispatchEvent(new Event('focus')), 100);
      },
    },
    template: `
      <div style="padding: 24px; max-width: 520px; position: relative; padding-bottom: 200px;"
           [ngOnInit]="onReady()">
        <ds-search-bar
          [placeholder]="placeholder"
          [buttonLabel]="buttonLabel"
          [recentSearches]="recentSearches"
          advancedSearchHref="#"
        />
      </div>
    `,
  }),
};
