import type { Meta, StoryObj } from '@storybook/angular';
import { CellHeaderComponent } from './cell-header.component';

const meta: Meta<CellHeaderComponent> = {
  title: 'Design System/Data Display/Table/Cell Header',
  component: CellHeaderComponent,
  tags: ['autodocs'],
  argTypes: {
    type:             { control: 'select', options: ['default', 'action', 'selection'] },
    title:            { control: 'text' },
    subTitle:         { control: 'text' },
    sortable:         { control: 'boolean' },
    sortDirection:    { control: 'select', options: [null, 'asc', 'desc'] },
    allSelected:      { control: 'boolean' },
    allIndeterminate: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CellHeaderComponent>;

export const Default: Story = {
  args: { type: 'default', title: 'Header', sortable: true, sortDirection: null },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:240px;">
        <ds-cell-header
          [type]="type"
          [title]="title"
          [sortable]="sortable"
          [sortDirection]="sortDirection"
        />
      </div>
    `,
  }),
};

export const Sorted: Story = {
  name: 'Sorted ascending',
  args: { type: 'default', title: 'File name', sortable: true, sortDirection: 'asc' },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:240px;">
        <ds-cell-header [type]="type" [title]="title" [sortable]="sortable" [sortDirection]="sortDirection" />
      </div>
    `,
  }),
};

export const WithSubtitle: Story = {
  name: 'With subtitle',
  args: { type: 'default', title: 'Header', subTitle: 'EUR', sortable: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:240px;">
        <ds-cell-header [type]="type" [title]="title" [subTitle]="subTitle" />
      </div>
    `,
  }),
};

export const SelectionAll: Story = {
  name: 'Selection (select all)',
  args: { type: 'selection', allSelected: false, allIndeterminate: false },
  render: (args) => ({
    props: args,
    template: `<ds-cell-header [type]="type" [allSelected]="allSelected" [allIndeterminate]="allIndeterminate" />`,
  }),
};

export const SelectionIndeterminate: Story = {
  name: 'Selection — indeterminate',
  args: { type: 'selection', allSelected: false, allIndeterminate: true },
  render: (args) => ({
    props: args,
    template: `<ds-cell-header [type]="type" [allSelected]="allSelected" [allIndeterminate]="allIndeterminate" />`,
  }),
};

export const ActionEmpty: Story = {
  name: 'Action (empty)',
  args: { type: 'action' },
  render: (args) => ({
    props: args,
    template: `<ds-cell-header [type]="type" />`,
  }),
};
