import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CellActionComponent } from './cell-action.component';
import { FlyoutMenuComponent } from '../flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../flyout-menu/flyout-menu-item.component';

const meta: Meta<CellActionComponent> = {
  title: 'Design System/Data Display/Table/Cell Action',
  component: CellActionComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [FlyoutMenuComponent, FlyoutMenuItemComponent] }),
  ],
  argTypes: {
    size:      { control: 'select', options: ['s', 'm'] },
    ariaLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<CellActionComponent>;

export const Default: Story = {
  args: { size: 'm', ariaLabel: 'Row actions' },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:32px;">
        <ds-cell-action [size]="size" [ariaLabel]="ariaLabel">
          <ds-flyout-menu slot="menu">
            <ds-flyout-menu-item label="Edit"      icon="edit" />
            <ds-flyout-menu-item label="Duplicate" icon="duplicate" />
            <ds-flyout-menu-item label="Archive"   icon="archive" />
            <ds-flyout-menu-item label="Delete"    icon="trash" />
          </ds-flyout-menu>
        </ds-cell-action>
      </div>
    `,
  }),
};

export const SizeS: Story = {
  name: 'Size S',
  args: { size: 's' },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:32px;">
        <ds-cell-action [size]="size">
          <ds-flyout-menu slot="menu">
            <ds-flyout-menu-item label="View"   icon="eye" />
            <ds-flyout-menu-item label="Edit"   icon="edit" />
            <ds-flyout-menu-item label="Delete" icon="trash" />
          </ds-flyout-menu>
        </ds-cell-action>
      </div>
    `,
  }),
};
