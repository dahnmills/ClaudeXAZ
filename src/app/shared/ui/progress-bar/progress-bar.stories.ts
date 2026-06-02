import type { Meta, StoryObj } from '@storybook/angular';
import { ProgressBarComponent } from './progress-bar.component';

const meta: Meta<ProgressBarComponent> = {
  title: 'Design System/Feedback/Progress Bar',
  component: ProgressBarComponent,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    size:  { control: 'select', options: ['s', 'm'] },
    tone:  { control: 'select', options: ['brand', 'positive', 'warning', 'negative'] },
  },
};
export default meta;
type Story = StoryObj<ProgressBarComponent>;

export const Default: Story = {
  args: { value: 0.6, size: 's', tone: 'brand' },
  render: (args) => ({
    props: args,
    template: `<div style="width:240px;"><ds-progress-bar [value]="value" [size]="size" [tone]="tone" /></div>`,
  }),
};

export const Tones: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;width:240px;">
        <ds-progress-bar [value]="0.7" tone="brand" />
        <ds-progress-bar [value]="0.7" tone="positive" />
        <ds-progress-bar [value]="0.7" tone="warning" />
        <ds-progress-bar [value]="0.7" tone="negative" />
      </div>
    `,
  }),
};
