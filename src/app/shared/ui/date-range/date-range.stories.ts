import type { Meta, StoryObj } from '@storybook/angular';
import { DateRangeComponent } from './date-range.component';

const meta: Meta<DateRangeComponent> = {
  title: 'Design System/Data Entry/Date Range',
  component: DateRangeComponent,
  tags: ['autodocs'],
  argTypes: {
    type:          { control: 'select', options: ['single', 'dual'],  description: 'Nombre de calendriers affichés' },
    selection:     { control: 'select', options: ['range', 'date'],   description: 'Mode de sélection' },
    showShortcuts: { control: 'boolean', description: 'Afficher les raccourcis' },
    showTime:      { control: 'boolean', description: 'Afficher les champs date/heure' },
    showFooter:    { control: 'boolean', description: 'Afficher Cancel / Apply' },
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

export const WithShortcuts: Story = {
  name: 'Avec shortcuts',
  args: { type: 'single', selection: 'range', showShortcuts: true },
};

export const WithShortcutsDual: Story = {
  name: 'Shortcuts + 2 calendriers',
  args: { type: 'dual', selection: 'range', showShortcuts: true },
};

export const WithTime: Story = {
  name: 'Avec time inputs',
  args: { type: 'dual', selection: 'range', showTime: true },
};

export const Full: Story = {
  name: 'Complet (shortcuts + time + footer)',
  args: {
    type:          'dual',
    selection:     'range',
    showShortcuts: true,
    showTime:      true,
    showFooter:    true,
  },
};
