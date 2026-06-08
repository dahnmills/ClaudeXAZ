import type { Meta, StoryObj } from '@storybook/angular';
import { InputDateComponent } from './input-date.component';

const meta: Meta<InputDateComponent> = {
  title: 'Design System/Data Entry/Input Date',
  component: InputDateComponent,
  tags: ['autodocs'],
  argTypes: {
    label:        { control: 'text' },
    placeholder:  { control: 'text' },
    value:        { control: 'text' },
    optional:     { control: 'boolean' },
    error:        { control: 'boolean' },
    errorMessage: { control: 'text' },
    disabled:     { control: 'boolean' },
    readonly:     { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<InputDateComponent>;

export const Playground: Story = {
  args: {
    label: 'Date',
    placeholder: 'dd/mm/yyyy',
    optional: false,
    error: false,
    errorMessage: 'Please enter a valid date.',
    disabled: false,
    readonly: false,
  },
};

/** États visuels côte-à-côte */
export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:320px;">
        <ds-input-date label="Default" placeholder="dd/mm/yyyy"></ds-input-date>
        <ds-input-date label="With value" value="2026-06-03"></ds-input-date>
        <ds-input-date label="Read only" [readonly]="true" value="2026-06-03"></ds-input-date>
        <ds-input-date label="Disabled" [disabled]="true"></ds-input-date>
        <ds-input-date label="Error" [error]="true" errorMessage="Please enter a valid date."></ds-input-date>
      </div>
    `,
  }),
};
