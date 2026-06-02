import type { Meta, StoryObj } from '@storybook/angular';
import { NewsfeedComponent } from './newsfeed.component';

const meta: Meta<NewsfeedComponent> = {
  title: 'Design System/Data Display/Newsfeed',
  component: NewsfeedComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<NewsfeedComponent>;

export const Default: Story = {
  args: {
    title: 'Newsfeed',
    tags: [
      { label: 'Positive', status: 'success' },
      { label: 'Important', status: 'error' },
    ],
    headline: 'JP Morgan Investment Trusts Ten Largest Investments',
    date: '11 nov 2024 - 16:42',
    excerpt: 'Yesterday, someone bought an electric car, since then, he can’t…',
  },
  render: (args) => ({
    props: args,
    template: `<div style="width:300px;height:258px;">
      <ds-newsfeed [title]="title" [tags]="tags" [headline]="headline" [date]="date" [excerpt]="excerpt" />
    </div>`,
  }),
};
