import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FlyoutMenuComponent } from './flyout-menu.component';
import { FlyoutMenuItemComponent } from './flyout-menu-item.component';
import { IconComponent } from '../icon/icon.component';
import { FlagComponent } from '../flag/flag.component';

const meta: Meta = {
  title: 'Local Components/Flyout Menu Variants',
  decorators: [
    moduleMetadata({ imports: [FlyoutMenuComponent, FlyoutMenuItemComponent, IconComponent, FlagComponent] }),
  ],
  parameters: { backgrounds: { default: 'grey' } },
};

export default meta;
type Story = StoryObj;

export const SearchTypePicker: Story = {
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
