import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SideNavComponent } from './side-nav.component';
import { SideNavItemComponent } from './side-nav-item.component';

const ICON_DASHBOARD = `<svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/></svg>`;
const ICON_FILE      = `<svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICON_CHART     = `<svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const meta: Meta<SideNavComponent> = {
  title: 'Design System/SideNav',
  component: SideNavComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SideNavItemComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<SideNavComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <ds-side-nav style="height:320px;">
        <ds-side-nav-item [selected]="true">
          ${ICON_DASHBOARD}
          Tableau de bord
        </ds-side-nav-item>
        <ds-side-nav-item>
          ${ICON_FILE}
          Contrats
        </ds-side-nav-item>
        <ds-side-nav-item>
          ${ICON_CHART}
          Rapports
        </ds-side-nav-item>
        <ds-side-nav-item [disabled]="true">
          ${ICON_FILE}
          Historique (bientôt)
        </ds-side-nav-item>
      </ds-side-nav>
    `,
  }),
};

export const WithPageLayout: Story = {
  render: () => ({
    template: `
      <div style="display:flex;height:400px;border:1px solid #d9d9d9;border-radius:4px;overflow:hidden;">
        <ds-side-nav>
          <ds-side-nav-item [selected]="true">${ICON_DASHBOARD} Tableau de bord</ds-side-nav-item>
          <ds-side-nav-item>${ICON_FILE} Contrats</ds-side-nav-item>
          <ds-side-nav-item>${ICON_CHART} Rapports</ds-side-nav-item>
        </ds-side-nav>
        <div style="flex:1;padding:24px;background:#fff;">
          <p style="font-size:14px;color:#414141;">Contenu de la page</p>
        </div>
      </div>
    `,
  }),
};
