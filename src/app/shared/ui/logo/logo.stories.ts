import type { Meta, StoryObj } from '@storybook/angular';
import { LogoComponent } from './logo.component';

const meta: Meta<LogoComponent> = {
  title: 'Design System/Logo',
  component: LogoComponent,
  tags: ['autodocs'],
  argTypes: {
    appName:  { control: 'text' },
    reversed: { control: 'boolean' },
  },
  args: {
    appName:  'Qirin',
    reversed: false,
  },
};

export default meta;
type Story = StoryObj<LogoComponent>;

// ── Default (sur fond clair) ──────────────────────────────────
export const Default: Story = {
  args: { reversed: false },
  parameters: { backgrounds: { default: 'light' } },
};

// ── Reversed (sur fond sombre — header) ──────────────────────
export const Reversed: Story = {
  args: { reversed: true },
  parameters: { backgrounds: { default: 'dark' } },
};

// ── Côte à côte ───────────────────────────────────────────────
export const BothVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:0; overflow:hidden; border-radius:8px;">
        <div style="background:#f5f5f5; padding:24px 32px;">
          <ds-logo [reversed]="false" appName="Qirin" />
        </div>
        <div style="background:#003781; padding:24px 32px;">
          <ds-logo [reversed]="true" appName="Qirin" />
        </div>
      </div>
    `,
  }),
  parameters: { backgrounds: { disable: true } },
};
