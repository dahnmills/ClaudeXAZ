import type { Meta, StoryObj } from '@storybook/angular';
import { DateRangeComponent } from './date-range.component';

const meta: Meta<DateRangeComponent> = {
  title: 'Design System/Data Entry/Date Range',
  component: DateRangeComponent,
  tags: ['autodocs'],
  argTypes: {
    type:      { control: 'select', options: ['single', 'dual'],  description: 'Nombre de calendriers affichés' },
    selection: { control: 'select', options: ['range', 'date'],   description: 'Mode de sélection' },
  },
};

export default meta;
type Story = StoryObj<DateRangeComponent>;

export const RangeSingleCalendar: Story = {
  name: 'Range — 1 calendrier',
  args: { type: 'single', selection: 'range' },
};

export const RangeDualCalendar: Story = {
  name: 'Range — 2 calendriers',
  args: { type: 'dual', selection: 'range' },
};

export const DateSingleCalendar: Story = {
  name: 'Date unique — 1 calendrier',
  args: { type: 'single', selection: 'date' },
};

export const DateDualCalendar: Story = {
  name: 'Date unique — 2 calendriers',
  args: { type: 'dual', selection: 'date' },
};
