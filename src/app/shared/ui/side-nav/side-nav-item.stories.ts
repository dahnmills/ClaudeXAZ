import type { Meta, StoryObj } from '@storybook/angular';
import { SideNavItemComponent } from './side-nav-item.component';

const ICON_FILE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const meta: Meta<SideNavItemComponent> = {
  title: 'Design System/Internals/Side Nav Item',
  component: SideNavItemComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Atome interne au composant `ds-side-nav`. Voir Side Nav pour l\'usage composé complet.',
      },
    },
  },
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<SideNavItemComponent>;

export const Default: Story = {
  args: { selected: false, disabled: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:220px;">
        <ds-side-nav-item [selected]="selected" [disabled]="disabled">
          ${ICON_FILE}
          Contrats
        </ds-side-nav-item>
      </div>
    `,
  }),
};

export const Selected: Story = {
  args: { selected: true, disabled: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:220px;">
        <ds-side-nav-item [selected]="selected" [disabled]="disabled">
          ${ICON_FILE}
          Contrats
        </ds-side-nav-item>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: { selected: false, disabled: true },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:220px;">
        <ds-side-nav-item [selected]="selected" [disabled]="disabled">
          ${ICON_FILE}
          Historique (bientôt)
        </ds-side-nav-item>
      </div>
    `,
  }),
};
