import type { Meta, StoryObj } from '@storybook/angular';
import { PieChartComponent, PieChartSegment } from './pie-chart.component';

const SEGMENTS: PieChartSegment[] = [
  { label: 'Low risk', value: 62, tone: 'positive', tooltip: 'Low risk — 62%' },
  { label: 'Medium risk', value: 24, tone: 'warning', tooltip: 'Medium risk — 24%' },
  { label: 'High risk', value: 14, tone: 'negative', tooltip: 'High risk — 14%' },
];

const meta: Meta<PieChartComponent> = {
  title: 'Design System/Data Display/Pie Chart',
  component: PieChartComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'number' },
    thickness: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<PieChartComponent>;

export const Default: Story = {
  args: { segments: SEGMENTS, size: 120, thickness: 16 },
};

export const SingleSegment: Story = {
  args: { segments: [{ label: 'All', value: 1, tone: 'brand', tooltip: 'All — 100%' }], size: 120, thickness: 16 },
};
