import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HeaderComponent } from './header.component';
import { LogoComponent } from '../logo/logo.component';
import { TabComponent } from '../tab/tab.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';

const ICON_SEARCH = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
const ICON_HELP   = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M6 6.5a2 2 0 114 0c0 1-1 1.5-2 2v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="12" r="0.75" fill="currentColor"/></svg>`;
const ICON_BELL   = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2a5 5 0 015 5v3l1 1H2l1-1V7a5 5 0 015-5z" stroke="currentColor" stroke-width="1.5"/><path d="M6.5 13.5a1.5 1.5 0 003 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

const meta: Meta<HeaderComponent> = {
  title: 'Design System/Header',
  component: HeaderComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', backgrounds: { default: 'dark' } },
  decorators: [
    moduleMetadata({
      imports: [LogoComponent, TabComponent, ButtonIconComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<HeaderComponent>;

// ── Qirin (maquette cible) ────────────────────────────────────
export const Qirin: Story = {
  render: () => ({
    template: `
      <ds-header>
        <ds-logo slot="logo" [reversed]="true" appName="Qirin" />

        <ng-container slot="tabs">
          <ds-tab tone="reversed" [selected]="true">Home</ds-tab>
          <ds-tab tone="reversed">Buyers</ds-tab>
          <ds-tab tone="reversed">Policies</ds-tab>
          <ds-tab tone="reversed">Tools</ds-tab>
          <ds-tab tone="reversed">Configuration</ds-tab>
        </ng-container>

        <ng-container slot="actions">
          <ds-button-icon type="tertiary" [reversed]="true" size="s" ariaLabel="Rechercher">
            <span [innerHTML]="iconSearch"></span>
          </ds-button-icon>
          <ds-button-icon type="tertiary" [reversed]="true" size="s" ariaLabel="Aide">
            <span [innerHTML]="iconHelp"></span>
          </ds-button-icon>
          <ds-button-icon type="tertiary" [reversed]="true" size="s" ariaLabel="Notifications">
            <span [innerHTML]="iconBell"></span>
          </ds-button-icon>
        </ng-container>

        <ng-container slot="account">
          <ds-tab tone="reversed">John Doe</ds-tab>
        </ng-container>
      </ds-header>
    `,
    props: {
      iconSearch: ICON_SEARCH,
      iconHelp:   ICON_HELP,
      iconBell:   ICON_BELL,
    },
  }),
};

// ── Buyers tab active ─────────────────────────────────────────
export const BuyersActive: Story = {
  render: () => ({
    template: `
      <ds-header>
        <ds-logo slot="logo" [reversed]="true" appName="Qirin" />

        <ng-container slot="tabs">
          <ds-tab tone="reversed">Home</ds-tab>
          <ds-tab tone="reversed" [selected]="true">Buyers</ds-tab>
          <ds-tab tone="reversed">Policies</ds-tab>
          <ds-tab tone="reversed">Tools</ds-tab>
          <ds-tab tone="reversed">Configuration</ds-tab>
        </ng-container>

        <ng-container slot="actions">
          <ds-button-icon type="tertiary" [reversed]="true" size="s" ariaLabel="Rechercher">
            <span [innerHTML]="iconSearch"></span>
          </ds-button-icon>
          <ds-button-icon type="tertiary" [reversed]="true" size="s" ariaLabel="Notifications">
            <span [innerHTML]="iconBell"></span>
          </ds-button-icon>
        </ng-container>

        <ng-container slot="account">
          <ds-tab tone="reversed">John Doe</ds-tab>
        </ng-container>
      </ds-header>
    `,
    props: { iconSearch: ICON_SEARCH, iconBell: ICON_BELL },
  }),
};
