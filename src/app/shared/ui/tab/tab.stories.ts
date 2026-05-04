import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TabComponent } from './tab.component';
import { IconComponent } from '../icon/icon.component';

const meta: Meta<TabComponent> = {
  title: 'Design System/Tab',
  component: TabComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [IconComponent] })],
  argTypes: {
    tone:     { control: 'select', options: ['default', 'accent', 'reversed'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    icon:     { control: 'boolean' },
    chevron:  { control: 'boolean' },
    counter:  { control: { type: 'number' } },
    clicked:  { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<TabComponent>;

export const Default: Story = {
  args: {
    tone: 'default',
    selected: false,
    disabled: false,
    icon: false,
    chevron: false,
    counter: null,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="border-bottom:1px solid #d9d9d9;display:flex;padding:0 16px;">
        <ds-tab
          [tone]="tone"
          [selected]="selected"
          [disabled]="disabled"
          [icon]="icon"
          [chevron]="chevron"
          [counter]="counter"
          (clicked)="clicked()"
        >
          <ds-icon slot="icon" name="search" [size]="20" />
          Tableau de bord
        </ds-tab>
      </div>
    `,
  }),
};

export const WithIcon: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:32px;border-bottom:1px solid #d9d9d9;padding:0 16px;">
        <ds-tab [icon]="true" [selected]="true">
          <ds-icon slot="icon" name="search" [size]="20" />
          Search
        </ds-tab>
        <ds-tab [icon]="true">
          <ds-icon slot="icon" name="clock" [size]="20" />
          Recent
        </ds-tab>
        <ds-tab [icon]="true">
          <ds-icon slot="icon" name="star" [size]="20" />
          Favorites
        </ds-tab>
      </div>
    `,
  }),
};

export const WithCounter: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:32px;border-bottom:1px solid #d9d9d9;padding:0 16px;">
        <ds-tab [icon]="true" [counter]="3" [selected]="true">
          <ds-icon slot="icon" name="clock" [size]="20" />
          Recent
        </ds-tab>
        <ds-tab [icon]="true" [counter]="12">
          <ds-icon slot="icon" name="star" [size]="20" />
          Favorites
        </ds-tab>
        <ds-tab [counter]="99">Notifications</ds-tab>
      </div>
    `,
  }),
};

export const WithChevron: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:32px;border-bottom:1px solid #d9d9d9;padding:0 16px;">
        <ds-tab [chevron]="true" [selected]="true">Reports</ds-tab>
        <ds-tab [chevron]="true">Tools</ds-tab>
        <ds-tab [icon]="true" [chevron]="true">
          <ds-icon slot="icon" name="settings" [size]="20" />
          Settings
        </ds-tab>
      </div>
    `,
  }),
};

export const ToneDefault: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:32px;align-items:stretch;border-bottom:1px solid #d9d9d9;padding:0 16px;">
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
      <div style="display:flex;gap:32px;padding:0 16px;align-items:stretch;">
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
      <div style="display:flex;gap:32px;align-items:stretch;border-bottom:1px solid #d9d9d9;padding:0 16px;">
        <ds-tab tone="accent" [selected]="true">Actif</ds-tab>
        <ds-tab tone="accent">Archivé</ds-tab>
        <ds-tab tone="accent">En cours</ds-tab>
      </div>
    `,
  }),
};
