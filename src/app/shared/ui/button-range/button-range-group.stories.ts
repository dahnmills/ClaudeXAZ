import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonRangeGroupComponent } from './button-range-group.component';

const baseOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: '10' },
  { value: 'NA', label: 'NA' },
];

const sensitivityOptions = [
  { value: 'S0', label: 'S0' },
  { value: 'S1', label: 'S1' },
  { value: 'S2P', label: 'S2P' },
  { value: 'SN', label: 'SN' },
];

const financialBuckets = [
  { value: '<1M', label: '<1M' },
  { value: '1M-10M', label: '1M-10M' },
  { value: '10M-100M', label: '10M-100M' },
  { value: '>100M', label: '>100M' },
];

const meta: Meta<ButtonRangeGroupComponent> = {
  title: 'Design System/Action/Button Range Group',
  component: ButtonRangeGroupComponent,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['multi', 'range', 'single'],
      description: 'Selection mode. `range` highlights contiguous span (start/end + between). `multi` lets several individual values toggle on/off. `single` allows only one selection.',
    },
    ariaLabel: { control: 'text' },
    valueChange: { action: 'valueChange' },
    optionClicked: { action: 'optionClicked' },
  },
  args: {
    options: baseOptions,
    value: [],
    mode: 'range',
    ariaLabel: 'Grade',
  },
};

export default meta;
type Story = StoryObj<ButtonRangeGroupComponent>;

export const RangeMode: Story = {
  name: 'Mode: Range',
  args: { mode: 'range', value: ['2', '5'] },
};

export const MultiMode: Story = {
  name: 'Mode: Multi',
  args: { mode: 'multi', value: ['3', '6', '9'] },
};

export const SingleMode: Story = {
  name: 'Mode: Single',
  args: { mode: 'single', value: ['4'] },
};

export const Empty: Story = {
  args: { value: [] },
};

export const Sensitivity: Story = {
  args: { options: sensitivityOptions, mode: 'range', value: ['S1', 'SN'], ariaLabel: 'Sensitivity' },
};

export const FinancialBuckets: Story = {
  name: 'Financial buckets (single)',
  args: { options: financialBuckets, mode: 'single', value: ['10M-100M'], ariaLabel: 'Turnover' },
};

export const WithDisabled: Story = {
  args: {
    options: baseOptions.map((option, index) => ({ ...option, disabled: index === 5 })),
    value: ['2', '8'],
    mode: 'range',
  },
};
