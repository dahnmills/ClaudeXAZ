import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { signal } from '@angular/core';
import { TableRowComponent } from './table-row.component';
import { CellComponent } from './cell.component';
import { CellHeaderComponent } from './cell-header.component';
import { CellActionComponent } from './cell-action.component';
import { CellSelectionComponent } from './cell-selection.component';
import { FlyoutMenuComponent } from '../flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../flyout-menu/flyout-menu-item.component';
import { BadgeComponent } from '../badge/badge.component';

const meta: Meta<TableRowComponent> = {
  title: 'Design System/Data Display/Table/Table Row',
  component: TableRowComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        CellComponent,
        CellHeaderComponent,
        CellActionComponent,
        CellSelectionComponent,
        FlyoutMenuComponent,
        FlyoutMenuItemComponent,
        BadgeComponent,
      ],
    }),
  ],
  argTypes: {
    state:       { control: 'select', options: ['default', 'active', 'disabled'] },
    interactive: { control: 'boolean' },
    new:         { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<TableRowComponent>;

const ROW_TEMPLATE = (props: { state?: string; interactive?: boolean; new?: boolean }) => `
  <div style="width:1100px;">
    <ds-table-row
      [state]="'${props.state ?? 'default'}'"
      [interactive]="${!!props.interactive}"
      [new]="${!!props.new}"
    >
      <ds-cell-selection control="check" [checked]="false" />
      <ds-cell style="flex:1;">The Interactive College</ds-cell>
      <ds-cell style="flex:1;">
        <ds-badge label="Computing" status="info" variant="strong" size="s" />
      </ds-cell>
      <ds-cell style="flex:1;">09/05/2023</ds-cell>
      <ds-cell-action ariaLabel="Row actions">
        <ds-flyout-menu slot="menu">
          <ds-flyout-menu-item label="Edit"   icon="edit" />
          <ds-flyout-menu-item label="Delete" icon="trash" />
        </ds-flyout-menu>
      </ds-cell-action>
    </ds-table-row>
  </div>
`;

export const Default: Story = {
  args: { state: 'default', interactive: false, new: false },
  render: (args) => ({ template: ROW_TEMPLATE(args) }),
};

export const Interactive: Story = {
  name: 'Interactive (hover effect)',
  args: { state: 'default', interactive: true },
  render: (args) => ({ template: ROW_TEMPLATE(args) }),
};

export const Active: Story = {
  args: { state: 'active', interactive: true },
  render: (args) => ({ template: ROW_TEMPLATE(args) }),
};

export const Disabled: Story = {
  args: { state: 'disabled' },
  render: (args) => ({ template: ROW_TEMPLATE(args) }),
};

export const New: Story = {
  name: 'New row (emphasized)',
  args: { state: 'default', interactive: true, new: true },
  render: (args) => ({ template: ROW_TEMPLATE(args) }),
};

export const FullTable: Story = {
  name: 'Full table example',
  parameters: { layout: 'fullscreen' },
  render: () => ({
    props: {
      sortDir:  signal<'asc' | 'desc' | null>('asc'),
      checked:  signal<Record<string, boolean>>({}),
      activeId: signal<string | null>(null),
      rows: [
        { id: '1', name: 'The Interactive College', status: 'Computing', upload: '09/05/2023', isNew: true },
        { id: '2', name: 'Bloom Marketing',         status: 'Computing', upload: '09/05/2023', isNew: true },
        { id: '3', name: 'The Spice Route',         status: 'Computing', upload: '09/05/2023', isNew: false },
        { id: '4', name: 'Gourmet Sandwich',        status: 'Uploaded',  upload: '05/05/2023', isNew: false },
        { id: '5', name: 'Ready Continental',       status: 'Uploaded',  upload: '05/05/2023', isNew: false },
        { id: '6', name: 'My Vegetarian Dinner',    status: 'Uploaded',  upload: '04/05/2023', isNew: false },
        { id: '7', name: 'Evergrow',                status: 'Uploaded',  upload: '04/05/2023', isNew: false },
      ],
      toggleCheck(rowId: string, current: Record<string, boolean>, value: boolean, target: ReturnType<typeof signal<Record<string, boolean>>>): void {
        target.set({ ...current, [rowId]: value });
      },
    },
    template: `
      <div style="padding:32px;font-family:var(--semantic-font-family);">
        <div style="width:1100px;">
          <!-- Header row -->
          <ds-table-row>
            <ds-cell-header type="selection" />
            <ds-cell-header style="flex:1;" type="default" title="File name" [sortable]="true" [sortDirection]="sortDir()" (sortClicked)="sortDir.set(sortDir() === 'asc' ? 'desc' : 'asc')" />
            <ds-cell-header style="flex:1;" type="default" title="Status" />
            <ds-cell-header style="flex:1;" type="default" title="Initial upload" [sortable]="true" />
            <ds-cell-header type="action" />
          </ds-table-row>

          <!-- Body rows -->
          @for (row of rows; track row.id) {
            <ds-table-row
              [state]="activeId() === row.id ? 'active' : 'default'"
              [interactive]="true"
              [new]="row.isNew"
              (clicked)="activeId.set(row.id)"
            >
              <ds-cell-selection
                control="check"
                [checked]="!!checked()[row.id]"
                (checkedChange)="toggleCheck(row.id, checked(), $event, checked)"
              />
              <ds-cell style="flex:1;">{{ row.name }}</ds-cell>
              <ds-cell style="flex:1;">
                <ds-badge
                  [label]="row.status"
                  [status]="row.status === 'Computing' ? 'info' : 'success'"
                  variant="strong"
                  size="s"
                />
              </ds-cell>
              <ds-cell style="flex:1;">{{ row.upload }}</ds-cell>
              <ds-cell-action ariaLabel="Row actions">
                <ds-flyout-menu slot="menu">
                  <ds-flyout-menu-item label="Edit"      icon="edit" />
                  <ds-flyout-menu-item label="Duplicate" icon="duplicate" />
                  <ds-flyout-menu-item label="Archive"   icon="archive" />
                  <ds-flyout-menu-item label="Delete"    icon="trash" />
                </ds-flyout-menu>
              </ds-cell-action>
            </ds-table-row>
          }
        </div>
      </div>
    `,
  }),
};
