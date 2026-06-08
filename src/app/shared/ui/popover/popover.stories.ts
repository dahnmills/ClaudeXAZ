import type { Meta, StoryObj } from '@storybook/angular';
import { PopoverComponent } from './popover.component';

const meta: Meta<PopoverComponent> = {
  title: 'Design System/Feedback/Popover',
  component: PopoverComponent,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    position: {
      control: 'select',
      options: [
        'top-left', 'top-center', 'top-right',
        'bottom-left', 'bottom-center', 'bottom-right',
        'right-top', 'right-center', 'right-bottom',
        'left-top', 'left-center', 'left-bottom',
      ],
    },
    reversed:    { control: 'boolean' },
    dismissible: { control: 'boolean' },
    closed:      { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<PopoverComponent>;

export const Playground: Story = {
  args: {
    title: 'Help us improve Qirin !',
    position: 'bottom-left',
    reversed: false,
    dismissible: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:60px;">
        <ds-popover [title]="title" [position]="position" [reversed]="reversed" [dismissible]="dismissible">
          Here at Qirin, it's important to get your voice and point of view.
          That's why, if you have time and want to help us improve it we created a survey.
        </ds-popover>
      </div>
    `,
  }),
};

export const Reversed: Story = {
  args: { title: 'Help us improve Qirin !', position: 'bottom-left', reversed: true, dismissible: true },
  render: Playground.render,
};
