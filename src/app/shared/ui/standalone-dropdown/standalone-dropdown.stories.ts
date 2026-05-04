import type { Meta, StoryObj } from '@storybook/angular';
import { StandaloneDropdownComponent } from './standalone-dropdown.component';

const meta: Meta<StandaloneDropdownComponent> = {
  title: 'Local Components/Standalone Dropdown',
  component: StandaloneDropdownComponent,
  tags: ['autodocs'],
  argTypes: {
    icon:    { control: 'select', options: [null, 'hash', 'aa', 'globe', 'phone', 'user'] },
    label:   { control: 'text' },
    disabled: { control: 'boolean' },
    clicked: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<StandaloneDropdownComponent>;

export const Default: Story = {
  args: { icon: 'hash', label: 'Company ID' },
};

export const Disabled: Story = {
  args: { icon: 'globe', label: 'Select a country', disabled: true },
};

export const AllIcons: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
        <ds-standalone-dropdown icon="hash"  label="Company ID" />
        <ds-standalone-dropdown icon="hash"  label="ID" />
        <ds-standalone-dropdown icon="aa"    label="Name" />
        <ds-standalone-dropdown icon="phone" label="Phone" />
        <ds-standalone-dropdown icon="user"  label="Manager" />
        <ds-standalone-dropdown icon="globe" label="Select a country" [disabled]="true" />
      </div>
    `,
  }),
};
