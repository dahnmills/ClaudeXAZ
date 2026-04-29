import type { Meta, StoryObj } from '@storybook/angular';
import { CellComponent } from './cell.component';

const meta: Meta<CellComponent> = {
  title: 'Design System/Data Display/Table/Cell',
  component: CellComponent,
  tags: ['autodocs'],
  argTypes: {
    size:       { control: 'select', options: ['s', 'm'] },
    align:      { control: 'select', options: ['left', 'right', 'center'] },
    emphasized: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CellComponent>;

export const Default: Story = {
  args: { size: 'm', align: 'left', emphasized: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:240px;">
        <ds-cell [size]="size" [align]="align" [emphasized]="emphasized">036601</ds-cell>
      </div>
    `,
  }),
};

export const Emphasized: Story = {
  name: 'Emphasized (new row)',
  args: { size: 'm', emphasized: true },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:240px;">
        <ds-cell [size]="size" [emphasized]="emphasized">036601</ds-cell>
      </div>
    `,
  }),
};

export const SizeS: Story = {
  name: 'Size S',
  args: { size: 's' },
  render: (args) => ({
    props: args,
    template: `<div style="width:240px;"><ds-cell [size]="size">036601</ds-cell></div>`,
  }),
};

export const RightAligned: Story = {
  name: 'Right aligned (numeric)',
  args: { align: 'right' },
  render: (args) => ({
    props: args,
    template: `<div style="width:240px;"><ds-cell [align]="align">€ 1 240,00</ds-cell></div>`,
  }),
};
