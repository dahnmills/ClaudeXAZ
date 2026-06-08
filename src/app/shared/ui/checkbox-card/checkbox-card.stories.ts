import type { Meta, StoryObj } from '@storybook/angular';
import { CheckboxCardComponent } from './checkbox-card.component';

const meta: Meta<CheckboxCardComponent> = {
  title: 'Design System/Data Entry/Checkbox Card',
  component: CheckboxCardComponent,
  tags: ['autodocs'],
  argTypes: {
    label:    { control: 'text' },
    sublabel: { control: 'text' },
    badge:    { control: 'text' },
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CheckboxCardComponent>;

export const Playground: Story = {
  args: {
    label: 'None',
    sublabel: 'Ultra fab, Inc.',
    badge: 'Draft',
    checked: false,
    disabled: false,
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:440px;">
        <ds-checkbox-card label="None" sublabel="Ultra fab, Inc." badge="Draft" [checked]="false"></ds-checkbox-card>
        <ds-checkbox-card label="None" sublabel="Ultra fab, Inc." badge="Draft" [checked]="true"></ds-checkbox-card>
        <ds-checkbox-card label="None" sublabel="Ultra fab, Inc." badge="Draft" [disabled]="true"></ds-checkbox-card>
        <ds-checkbox-card label="None" sublabel="Ultra fab, Inc." badge="Draft" [checked]="true" [disabled]="true"></ds-checkbox-card>
      </div>
    `,
  }),
};
