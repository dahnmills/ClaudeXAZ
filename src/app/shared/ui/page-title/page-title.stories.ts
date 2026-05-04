import type { Meta, StoryObj } from '@storybook/angular';
import { PageTitleComponent } from './page-title.component';

const meta: Meta<PageTitleComponent> = {
  title: 'Design System/Page Title',
  component: PageTitleComponent,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<PageTitleComponent>;

export const Default: Story = {
  args: { title: 'Current page' },
  render: (args) => ({
    props: args,
    template: `<ds-page-title [title]="title" />`,
  }),
};
