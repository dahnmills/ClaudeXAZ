import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ChipComponent } from './chip.component';
import { IconComponent } from '../icon/icon.component';

const meta: Meta<ChipComponent> = {
  title: 'Design System/Action/Chip',
  component: ChipComponent,
  decorators: [moduleMetadata({ imports: [ChipComponent, IconComponent] })],
  tags: ['autodocs'],
  argTypes: {
    type:     { control: 'select', options: ['static', 'filter', 'select'] },
    size:     { control: 'select', options: ['s', 'm'] },
    emphasis: { control: 'select', options: ['light', 'strong'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<ChipComponent>;

export const Static: Story = {
  args: { label: 'France', type: 'static', size: 'm' },
};

export const Filter: Story = {
  args: { label: 'Trade sector: Aviation', type: 'filter', size: 'm' },
};

export const Select: Story = {
  args: { label: 'Active', type: 'select', selected: true, size: 'm' },
};

export const SelectStrong: Story = {
  args: { label: 'New', type: 'select', emphasis: 'strong', selected: true, size: 'm' },
};

export const WithIcon: Story = {
  args: { label: 'Search', type: 'select' },
  render: (args) => ({
    props: args,
    template: `<ds-chip [label]="label" [type]="type"><ds-icon slot="icon-left" name="search" [size]="14" /></ds-chip>`,
  }),
};
