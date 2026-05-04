import type { Meta, StoryObj } from '@storybook/angular';
import { MoreCriteriaComponent } from './more-criteria.component';

const meta: Meta<MoreCriteriaComponent> = {
  title: 'Local Components/More Criteria',
  component: MoreCriteriaComponent,
  tags: ['autodocs'],
  argTypes: {
    cleared: { action: 'cleared' },
    closed: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<MoreCriteriaComponent>;

export const Default: Story = {};
