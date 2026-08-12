import type { Meta, StoryObj } from '@storybook/angular';
import { SpotlightComponent, type SpotlightItem } from './spotlight.component';

const CORPUS: SpotlightItem[] = [
  { id: '137381425', name: 'Amazon GB',                  type: 'Buyer',       icon: 'buyers', status: 'Open', statusTone: 'success' },
  { id: '204558719', name: 'Group Amazon FR',            type: 'Buyer',       icon: 'buyers' },
  { id: '551023884', name: 'Amazing Loco',               type: 'Buyer',       icon: 'buyers' },
  { id: '693118250', name: 'Amaze Me Farces et Attrape', type: 'Buyer',       icon: 'buyers' },
  { id: '118994372', name: 'ManA - Manual Assessment',   type: 'Application', icon: 'file-text' },
];

const RECENTS: SpotlightItem[] = [
  { id: '551023884', name: 'Amazing Loco',               type: 'Buyer',       icon: 'buyers' },
  { id: '693118250', name: 'Amaze Me Farces et Attrape', type: 'Buyer',       icon: 'buyers' },
  { id: '118994372', name: 'ManA - Manual Assessment',   type: 'Application', icon: 'file-text' },
];

const meta: Meta<SpotlightComponent> = {
  title: 'UI/Spotlight',
  component: SpotlightComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    open: true,
    items: CORPUS,
    recents: RECENTS,
  },
};

export default meta;
type Story = StoryObj<SpotlightComponent>;

/** État vide : à l'ouverture, avant toute saisie → les recherches récentes. */
export const Empty: Story = {
  args: { query: '' },
};

/** Recherche active : résultats directs + suggestions, avec ID copiable. */
export const WithResults: Story = {
  args: { query: 'ama' },
};

/** Aucun résultat pour la requête. */
export const NoResult: Story = {
  args: { query: 'zzzzz' },
};
