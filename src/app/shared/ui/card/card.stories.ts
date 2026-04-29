import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CardComponent } from './card.component';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { LinkComponent } from '../link/link.component';

const meta: Meta<CardComponent> = {
  title: 'Design System/Data Display/Card',
  component: CardComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BadgeComponent, ButtonComponent, LinkComponent],
    }),
  ],
  argTypes: {
    noPadding: { control: 'boolean' },
    loading:   { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CardComponent>;

export const Default: Story = {
  args: { noPadding: false },
  render: (args) => ({
    props: args,
    template: `
      <ds-card [noPadding]="noPadding" style="max-width:360px;">
        <div style="font-size:14px;font-weight:600;margin-bottom:8px;">Titre de la carte</div>
        <div style="font-size:14px;color:#414141;">Contenu libre projeté via ng-content.</div>
      </ds-card>
    `,
  }),
};

export const WithBadgeAndButton: Story = {
  render: () => ({
    template: `
      <ds-card style="max-width:360px;display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:14px;font-weight:600;">Polices actives</div>
          <ds-badge label="Actif" status="success" variant="light" size="s"></ds-badge>
        </div>
        <div style="font-size:14px;color:#414141;">Contrat n° 12345678 — expire le 01/12/2026</div>
        <div style="display:flex;gap:12px;align-items:center;">
          <ds-button type="primary">Déclarer un sinistre</ds-button>
          <ds-link tone="default" href="#">Voir le détail</ds-link>
        </div>
      </ds-card>
    `,
  }),
};

export const NoPadding: Story = {
  render: () => ({
    template: `
      <ds-card [noPadding]="true" style="max-width:360px;overflow:hidden;">
        <div style="background:#007ab3;padding:16px;color:white;font-size:14px;font-weight:600;">
          Header full-bleed
        </div>
        <div style="padding:16px;font-size:14px;color:#414141;">
          Contenu avec padding géré manuellement.
        </div>
      </ds-card>
    `,
  }),
};
