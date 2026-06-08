import type { Meta, StoryObj } from '@storybook/angular';
import { TileComponent } from './tile.component';

const meta: Meta<TileComponent> = {
  title: 'Design System/Action/Tile',
  component: TileComponent,
  tags: ['autodocs'],
  argTypes: {
    label:    { control: 'text' },
    icon:     { control: 'text' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    clicked:  { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<TileComponent>;

export const Playground: Story = {
  args: { label: 'Label', icon: 'user', selected: false, disabled: false },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <ds-tile label="Label" icon="user"></ds-tile>
        <ds-tile label="Label" icon="user" [selected]="true"></ds-tile>
        <ds-tile label="Label" icon="user" [disabled]="true"></ds-tile>
      </div>
    `,
  }),
};
