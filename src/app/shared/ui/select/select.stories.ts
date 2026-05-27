import type { Meta, StoryObj } from '@storybook/angular';
import { SelectComponent } from './select.component';

const meta: Meta<SelectComponent> = {
  title: 'Design System/Data Entry/Select',
  component: SelectComponent,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    selectionChange: { action: 'selectionChange' },
  },
  args: {
    label: 'Type',
    placeholder: 'Choose…',
    options: [
      { value: 'siren', label: 'SIREN' },
      { value: 'siret', label: 'SIRET' },
      { value: 'rcs', label: 'RCS' },
    ],
    value: '',
    disabled: false,
    error: false,
  },
};

export default meta;
type Story = StoryObj<SelectComponent>;

export const Default: Story = {};

export const Selected: Story = {
  args: { value: 'siren' },
};

export const Disabled: Story = {
  args: { value: 'siren', disabled: true },
};

export const Error: Story = {
  args: { error: true, errorMessage: 'Please choose a type.' },
};
