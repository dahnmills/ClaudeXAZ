import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Design System/Action/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    type:     { control: 'select', options: ['primary', 'secondary', 'tertiary', 'plain'] },
    tone:     { control: 'select', options: ['default', 'accent'] },
    reversed: { control: 'boolean' },
    disabled: { control: 'boolean' },
    clicked:  { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: { type: 'primary', tone: 'default', reversed: false, disabled: false },
  render: (args) => ({
    props: args,
    template: `
      <ds-button [type]="type" [tone]="tone" [reversed]="reversed" [disabled]="disabled" (clicked)="clicked()">
        Valider
      </ds-button>
    `,
  }),
};

export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <ds-button type="primary">Primary</ds-button>
        <ds-button type="secondary">Secondary</ds-button>
        <ds-button type="tertiary">Tertiary</ds-button>
        <ds-button type="plain">Plain</ds-button>
      </div>
    `,
  }),
};

export const AccentTone: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <ds-button type="primary"   tone="accent">Primary</ds-button>
        <ds-button type="secondary" tone="accent">Secondary</ds-button>
        <ds-button type="tertiary"  tone="accent">Tertiary</ds-button>
        <ds-button type="plain"     tone="accent">Plain</ds-button>
      </div>
    `,
  }),
};

export const Reversed: Story = {
  parameters: { backgrounds: { default: 'dark' } },
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <ds-button type="primary"   [reversed]="true">Primary</ds-button>
        <ds-button type="secondary" [reversed]="true">Secondary</ds-button>
        <ds-button type="tertiary"  [reversed]="true">Tertiary</ds-button>
        <ds-button type="plain"     [reversed]="true">Plain</ds-button>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <ds-button type="primary"   [disabled]="true">Primary</ds-button>
        <ds-button type="secondary" [disabled]="true">Secondary</ds-button>
        <ds-button type="tertiary"  [disabled]="true">Tertiary</ds-button>
      </div>
    `,
  }),
};
