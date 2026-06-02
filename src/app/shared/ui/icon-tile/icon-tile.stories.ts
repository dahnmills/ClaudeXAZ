import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { IconTileComponent } from './icon-tile.component';
import { IconComponent } from '../icon/icon.component';

const meta: Meta<IconTileComponent> = {
  title: 'Design System/Foundation/Icon Tile',
  component: IconTileComponent,
  decorators: [moduleMetadata({ imports: [IconTileComponent, IconComponent] })],
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
    tone: { control: 'select', options: ['brand', 'neutral', 'subtle'] },
  },
};
export default meta;
type Story = StoryObj<IconTileComponent>;

export const Default: Story = {
  args: { size: 'm', tone: 'brand' },
  render: (args) => ({
    props: args,
    template: `<ds-icon-tile [size]="size" [tone]="tone"><ds-icon name="grid" [size]="24" /></ds-icon-tile>`,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:24px;align-items:center;">
        <ds-icon-tile size="s" tone="brand"><ds-icon name="grid" [size]="16" /></ds-icon-tile>
        <ds-icon-tile size="m" tone="brand"><ds-icon name="grid" [size]="20" /></ds-icon-tile>
        <ds-icon-tile size="l" tone="brand"><ds-icon name="grid" [size]="24" /></ds-icon-tile>
      </div>
    `,
  }),
};
