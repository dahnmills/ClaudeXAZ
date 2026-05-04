import type { Meta, StoryObj } from '@storybook/angular';
import { TagComponent } from './tag.component';

const meta: Meta<TagComponent> = {
  title: 'Design System/Action/Tag',
  component: TagComponent,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['static', 'filter', 'select'] },
    label: { control: 'text' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    toggled: { action: 'toggled' },
    removed: { action: 'removed' },
  },
};

export default meta;
type Story = StoryObj<TagComponent>;

export const Static: Story = {
  args: { type: 'static', label: 'Active' },
};

export const Filter: Story = {
  args: { type: 'filter', label: 'Active' },
};

export const SelectDefault: Story = {
  args: { type: 'select', label: 'Active', selected: false },
};

export const SelectSelected: Story = {
  args: { type: 'select', label: 'Active', selected: true },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start;">
        <div style="display:flex;gap:8px;">
          <ds-tag type="static" label="Static" />
          <ds-tag type="filter" label="Filter" />
          <ds-tag type="select" label="Unselected" />
          <ds-tag type="select" label="Selected" [selected]="true" />
          <ds-tag type="select" label="Disabled" [disabled]="true" />
          <ds-tag type="select" label="Sel + Disabled" [selected]="true" [disabled]="true" />
        </div>
      </div>
    `,
  }),
};
