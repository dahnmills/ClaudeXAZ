import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FlyoutMenuComponent } from './flyout-menu.component';
import { FlyoutMenuItemComponent } from './flyout-menu-item.component';

const meta: Meta<FlyoutMenuComponent> = {
  title: 'Design System/Flyout Menu',
  component: FlyoutMenuComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [FlyoutMenuItemComponent] }),
  ],
};

export default meta;
type Story = StoryObj<FlyoutMenuComponent>;

export const FourActions: Story = {
  name: '4 actions (typical)',
  render: () => ({
    template: `
      <div style="padding:32px;background:#f4f4f4;display:inline-block;">
        <ds-flyout-menu>
          <ds-flyout-menu-item label="Duplicate" icon="duplicate" />
          <ds-flyout-menu-item label="Archive"   icon="archive" />
          <ds-flyout-menu-item label="Share"     icon="share" />
          <ds-flyout-menu-item label="Delete"    icon="trash" [disabled]="true" />
        </ds-flyout-menu>
      </div>
    `,
  }),
};

export const SevenActions: Story = {
  name: '7 actions',
  render: () => ({
    template: `
      <div style="padding:32px;background:#f4f4f4;display:inline-block;">
        <ds-flyout-menu>
          <ds-flyout-menu-item label="Edit"       icon="edit" />
          <ds-flyout-menu-item label="Duplicate"  icon="duplicate" />
          <ds-flyout-menu-item label="Move"       icon="contract" />
          <ds-flyout-menu-item label="Archive"    icon="archive" />
          <ds-flyout-menu-item label="Share"      icon="share" />
          <ds-flyout-menu-item label="Export"     icon="download" />
          <ds-flyout-menu-item label="Delete"     icon="trash" />
        </ds-flyout-menu>
      </div>
    `,
  }),
};

export const NoIcons: Story = {
  name: 'Without icons',
  render: () => ({
    template: `
      <div style="padding:32px;background:#f4f4f4;display:inline-block;">
        <ds-flyout-menu>
          <ds-flyout-menu-item label="Item selection" />
          <ds-flyout-menu-item label="Item selection" />
          <ds-flyout-menu-item label="Item selection" />
        </ds-flyout-menu>
      </div>
    `,
  }),
};
