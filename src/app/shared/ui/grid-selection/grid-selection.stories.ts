import type { Meta, StoryObj } from '@storybook/angular';
import { GridSelectionComponent, LayoutConfig } from './grid-selection.component';

const LAYOUT_2X2: LayoutConfig = {
  id: '2x2-full',
  label: '2×2',
  gridCols: 2,
  slots: [
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
  ],
};

const meta: Meta<GridSelectionComponent> = {
  title: 'Design System/Data Entry/Grid Selection',
  component: GridSelectionComponent,
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'boolean' },
    selectedChange: { action: 'selectedChange' },
  },
};

export default meta;
type Story = StoryObj<GridSelectionComponent>;

export const Default: Story = {
  args: { layout: LAYOUT_2X2, selected: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:160px;">
        <ds-grid-selection [layout]="layout" [selected]="selected" (selectedChange)="selectedChange($event)" />
      </div>
    `,
  }),
};

export const Selected: Story = {
  args: { layout: LAYOUT_2X2, selected: true },
  render: (args) => ({
    props: args,
    template: `
      <div style="width:160px;">
        <ds-grid-selection [layout]="layout" [selected]="selected" (selectedChange)="selectedChange($event)" />
      </div>
    `,
  }),
};
