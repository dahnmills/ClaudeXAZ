import type { Meta, StoryObj } from '@storybook/angular';
import { SnackbarComponent } from './snackbar.component';

const meta: Meta<SnackbarComponent> = {
  title: 'Design System/Feedback/Snackbar',
  component: SnackbarComponent,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    tone: { control: 'select', options: ['neutral', 'success', 'error'] },
    icon: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<SnackbarComponent>;

export const Default: Story = {
  args: { text: 'Changes saved.', tone: 'neutral', icon: null },
};

export const Success: Story = {
  args: { text: 'Company created successfully.', tone: 'success', icon: 'check' },
};

export const Error: Story = {
  args: { text: 'Something went wrong. Please try again.', tone: 'error', icon: 'alert' },
};
