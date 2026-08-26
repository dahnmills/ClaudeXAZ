import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FlyoutMenuComponent } from './flyout-menu.component';
import { FlyoutMenuItemComponent } from './flyout-menu-item.component';
import { IconComponent } from '../icon/icon.component';
import { FlagComponent } from '../flag/flag.component';

const meta: Meta<FlyoutMenuComponent> = {
  title: 'Design System/Action/Flyout Menu',
  component: FlyoutMenuComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [FlyoutMenuItemComponent, IconComponent, FlagComponent] }),
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

export const SearchTypePicker: Story = {
  name: 'Variant: search type picker',
  render: () => ({
    template: `
      <div style="width:200px;">
        <ds-flyout-menu>
          <ds-flyout-menu-item label="Company ID" icon="hash" />
          <ds-flyout-menu-item label="ID"         icon="hash" />
          <ds-flyout-menu-item label="Name"       icon="aa" />
          <ds-flyout-menu-item label="Phone"      icon="phone" />
          <ds-flyout-menu-item label="Manager"    icon="user" />
        </ds-flyout-menu>
      </div>
    `,
  }),
};

export const CountryPicker: Story = {
  name: 'Variant: country picker',
  render: () => ({
    template: `
      <div style="width:240px;">
        <ds-flyout-menu>
          <div role="menuitem" tabindex="0" class="country-row"><ds-flag code="fr" /><span>France</span></div>
          <div role="menuitem" tabindex="0" class="country-row"><ds-flag code="de" /><span>Germany</span></div>
          <div role="menuitem" tabindex="0" class="country-row"><ds-flag code="kr" /><span>Korea</span></div>
          <div role="menuitem" tabindex="0" class="country-row"><ds-flag code="gb" /><span>UK</span></div>
          <div role="menuitem" tabindex="0" class="country-row"><ds-flag code="us" /><span>USA</span></div>
        </ds-flyout-menu>
      </div>
      <style>
        .country-row {
          display:flex; align-items:center; gap:8px;
          padding:6px 8px; height:40px; cursor:pointer;
          font-family: var(--semantic-font-family);
          font-size: var(--semantic-font-text-style-size-l);
          line-height: var(--semantic-font-text-style-line-height-l);
          color: var(--semantic-color-static-text-main-secondary);
          border-radius: var(--semantic-border-radius-s);
        }
        .country-row:hover { background: var(--semantic-color-interactive-background-muted-hover); }
      </style>
    `,
  }),
};
