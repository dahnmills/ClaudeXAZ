import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FilterDrawerComponent, FilterDefinition } from './filter-drawer.component';

const SAMPLE_FILTERS: FilterDefinition[] = [
  {
    id: 'status',
    label: 'Status',
    type: 'checkbox-list',
    defaultOpen: true,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'closed', label: 'Closed' },
    ],
  },
  {
    id: 'country',
    label: 'Country',
    type: 'select',
    options: [
      { value: 'fr', label: 'France' },
      { value: 'de', label: 'Germany' },
      { value: 'es', label: 'Spain' },
    ],
  },
];

const meta: Meta<FilterDrawerComponent> = {
  title: 'Design System/Layout/Filter Drawer',
  component: FilterDrawerComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [FilterDrawerComponent] })],
};

export default meta;
type Story = StoryObj<FilterDrawerComponent>;

export const Default: Story = {
  args: {
    open: true,
    title: 'Filters',
    filters: SAMPLE_FILTERS,
  },
  render: (args) => ({
    props: args,
    template: `
      <ds-filter-drawer [open]="open" [title]="title" [filters]="filters" />
    `,
  }),
};

export const Empty: Story = {
  args: {
    open: true,
    title: 'Filters',
    filters: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <ds-filter-drawer [open]="open" [title]="title" [filters]="filters" />
    `,
  }),
};
