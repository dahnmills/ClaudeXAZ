import type { Meta, StoryObj } from '@storybook/angular';
import { StepperComponent } from './stepper.component';

const meta: Meta<StepperComponent> = {
  title: 'Design System/Navigation/Stepper',
  component: StepperComponent,
  tags: ['autodocs'],
  argTypes: {
    current: { control: { type: 'number', min: 0, max: 4 } },
  },
};
export default meta;
type Story = StoryObj<StepperComponent>;

export const Default: Story = {
  args: {
    current: 2,
    steps: [
      { label: 'Identity' },
      { label: 'Address' },
      { label: 'Information & Contacts' },
      { label: 'Financial information' },
      { label: 'Activities' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<div style="width:240px;"><ds-stepper [steps]="steps" [current]="current" /></div>`,
  }),
};
