import type { Meta, StoryObj } from '@storybook/angular';
import { MultiSelectComponent, type MultiSelectOption } from './multi-select.component';

const statuses: MultiSelectOption[] = [
  { value: 'issued',    label: 'Issued' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'expired',   label: 'Expired' },
  { value: 'pending',   label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
];

const meta: Meta<MultiSelectComponent> = {
  title: 'Design System/Data Entry/Multi Select',
  component: MultiSelectComponent,
  tags: ['autodocs'],
  args: { label: 'Status', options: statuses, placeholder: 'Select a status' },
};

export default meta;
type Story = StoryObj<MultiSelectComponent>;

export const Empty: Story = { args: { value: [] } };
export const Some: Story = { args: { value: ['issued', 'expired'] } };
export const Overflow: Story = { args: { value: ['issued', 'cancelled', 'expired', 'pending', 'suspended'] } };
export const Error: Story = { args: { value: [], error: true, errorMessage: 'Select at least one status' } };
export const Disabled: Story = { args: { value: ['issued'], disabled: true } };
export const Inline: Story = { args: { label: '', variant: 'inline', icon: 'check-circle', value: ['issued', 'cancelled', 'expired'] } };
