import type { Meta, StoryObj } from '@storybook/angular';
import { TabComponent } from './tab.component';

const meta: Meta<TabComponent> = {
  title: 'Design System/Tab',
  component: TabComponent,
  tags: ['autodocs'],
  argTypes: {
    tone:     { control: 'select', options: ['default', 'accent', 'reversed'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    clicked:  { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<TabComponent>;

export const Default: Story = {
  args: { tone: 'default', selected: false, disabled: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="border-bottom:1px solid #d9d9d9;">
        <ds-tab [tone]="tone" [selected]="selected" [disabled]="disabled" (clicked)="clicked()">
          Tableau de bord
        </ds-tab>
      </div>
    `,
  }),
};

export const ToneDefault: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:16px;align-items:stretch;border-bottom:1px solid #d9d9d9;">
        <ds-tab tone="default" [selected]="true">Tableau de bord</ds-tab>
        <ds-tab tone="default">Contrats</ds-tab>
        <ds-tab tone="default">Rapports</ds-tab>
        <ds-tab tone="default" [disabled]="true">Désactivé</ds-tab>
      </div>
    `,
  }),
};

export const ToneReversed: Story = {
  parameters: { backgrounds: { default: 'dark' } },
  render: () => ({
    template: `
      <div style="display:flex;gap:16px;padding:0 16px;align-items:stretch;">
        <ds-tab tone="reversed" [selected]="true">Accueil</ds-tab>
        <ds-tab tone="reversed">Portefeuille</ds-tab>
        <ds-tab tone="reversed">Opérations</ds-tab>
        <ds-tab tone="reversed">Rapports</ds-tab>
      </div>
    `,
  }),
};

export const ToneAccent: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:16px;align-items:stretch;border-bottom:1px solid #d9d9d9;">
        <ds-tab tone="accent" [selected]="true">Actif</ds-tab>
        <ds-tab tone="accent">Archivé</ds-tab>
        <ds-tab tone="accent">En cours</ds-tab>
      </div>
    `,
  }),
};
