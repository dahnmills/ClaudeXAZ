import type { Meta, StoryObj } from '@storybook/angular';
import { RadioCardComponent } from './radio-card.component';

const meta: Meta<RadioCardComponent> = {
  title: 'Design System/Data Entry/Radio Card',
  component: RadioCardComponent,
  tags: ['autodocs'],
  argTypes: {
    label:    { control: 'text' },
    sublabel: { control: 'text' },
    badge:    { control: 'text' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<RadioCardComponent>;

export const Playground: Story = {
  args: {
    label: 'None',
    sublabel: 'Ultra fab, Inc.',
    badge: 'Draft',
    selected: false,
    disabled: false,
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:440px;">
        <ds-radio-card label="None" sublabel="Ultra fab, Inc." badge="Draft" [selected]="false"></ds-radio-card>
        <ds-radio-card label="None" sublabel="Ultra fab, Inc." badge="Draft" [selected]="true"></ds-radio-card>
        <ds-radio-card label="None" sublabel="Ultra fab, Inc." badge="Draft" [disabled]="true"></ds-radio-card>
        <ds-radio-card label="None" sublabel="Ultra fab, Inc." badge="Draft" [selected]="true" [disabled]="true"></ds-radio-card>
      </div>
    `,
  }),
};
