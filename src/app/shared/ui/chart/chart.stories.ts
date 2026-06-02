import type { Meta, StoryObj } from '@storybook/angular';
import { ChartComponent } from './chart.component';

const meta: Meta<ChartComponent> = {
  title: 'Design System/Data Display/Chart',
  component: ChartComponent,
  tags: ['autodocs'],
  argTypes: {
    tone:    { control: 'select', options: ['brand', 'positive', 'warning', 'negative'] },
    height:  { control: { type: 'range', min: 80, max: 320, step: 8 } },
    invertY: { control: 'boolean' },
    showGrid:{ control: 'boolean' },
    showDots:{ control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<ChartComponent>;

const MONTHS = ['May 23', 'Jul 23', 'Sep 23', 'Nov 23', 'Jan 24', 'Mar 24', 'May 24', 'Jul 24', 'Sep 24', 'Nov 24', 'Jan 25', 'Mar 25'];
const GRADE_Y = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'N/A'];

/** Reproduit le widget "Grade" de Buyer Summary (axe Y inversé, 1 = meilleur en haut). */
export const Grade: Story = {
  args: {
    data: [6, 6, 6, 7, 6, 5, 5, 6],
    xLabels: MONTHS.slice(0, 8),
    yLabels: GRADE_Y,
    min: 1,
    max: 11,
    invertY: true,
    height: 160,
    tone: 'brand',
  },
  render: (args) => ({
    props: args,
    template: `<div style="width:520px;border:1px solid #d9d9d9;border-radius:4px;padding:24px;">
      <ds-chart [data]="data" [xLabels]="xLabels" [yLabels]="yLabels" [min]="min" [max]="max"
                [invertY]="invertY" [height]="height" [tone]="tone" />
    </div>`,
  }),
};

/** Tendance simple (axe Y standard, plus haut = plus grand). */
export const Trend: Story = {
  args: {
    data: [12, 18, 15, 22, 28, 26, 34, 40],
    xLabels: MONTHS.slice(0, 8),
    height: 160,
    tone: 'positive',
  },
  render: (args) => ({
    props: args,
    template: `<div style="width:520px;border:1px solid #d9d9d9;border-radius:4px;padding:24px;">
      <ds-chart [data]="data" [xLabels]="xLabels" [height]="height" [tone]="tone" />
    </div>`,
  }),
};
