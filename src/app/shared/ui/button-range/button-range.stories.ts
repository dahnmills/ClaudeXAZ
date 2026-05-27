import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonRangeComponent } from './button-range.component';

const meta: Meta<ButtonRangeComponent> = {
  title: 'Design System/Action/Button Range',
  component: ButtonRangeComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    status: { control: 'select', options: ['default', 'selected', 'between'] },
    disabled: { control: 'boolean' },
    clicked: { action: 'clicked' },
  },
  args: {
    label: '1',
    status: 'default',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<ButtonRangeComponent>;

export const Default: Story = {};

export const Selected: Story = {
  args: { status: 'selected' },
};

export const Between: Story = {
  args: { status: 'between' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <ds-button-range label="1" status="default" />
        <ds-button-range label="2" status="selected" />
        <ds-button-range label="3" status="between" />
        <ds-button-range label="4" status="between" />
        <ds-button-range label="5" status="selected" />
        <ds-button-range label="6" status="default" />
        <ds-button-range label="7" status="default" [disabled]="true" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <ds-button-range label="S0" status="default" />
        <ds-button-range label="S1" status="selected" />
        <ds-button-range label="S2P" status="between" />
        <ds-button-range label="SN" status="selected" />
        <ds-button-range label="NA" status="default" />
      </div>
    `,
  }),
};
